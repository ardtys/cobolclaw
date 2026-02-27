import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection } from './helius';
import { browser } from '$app/environment';

/**
 * Phantom Wallet Interface
 * Detects and interacts with Phantom wallet extension
 */

export interface PhantomProvider {
	publicKey: PublicKey | null;
	isConnected: boolean;
	connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
	disconnect: () => Promise<void>;
	signTransaction: (transaction: any) => Promise<any>;
	signAllTransactions: (transactions: any[]) => Promise<any[]>;
	on: (event: string, callback: (args: any) => void) => void;
	off: (event: string, callback: (args: any) => void) => void;
}

declare global {
	interface Window {
		solana?: PhantomProvider;
		phantom?: {
			solana?: PhantomProvider;
		};
	}
}

export interface WalletConnectionResult {
	success: boolean;
	address?: string;
	balance?: number;
	error?: string;
}

export class PhantomWalletService {
	private provider: PhantomProvider | null = null;
	private eventListeners: Map<string, ((args: any) => void)[]> = new Map();

	/**
	 * Check if Phantom is installed
	 */
	isPhantomInstalled(): boolean {
		if (!browser) return false;

		// Check multiple possible locations for Phantom
		const hasPhantom =
			window.solana?.isPhantom ||
			window.phantom?.solana?.isPhantom;

		return !!hasPhantom;
	}

	/**
	 * Get Phantom provider
	 */
	getProvider(): PhantomProvider | null {
		if (!browser) return null;

		if (this.provider) {
			return this.provider;
		}

		// Try to get Phantom from window
		if (window.phantom?.solana?.isPhantom) {
			this.provider = window.phantom.solana;
		} else if (window.solana?.isPhantom) {
			this.provider = window.solana;
		}

		return this.provider;
	}

	/**
	 * Connect to Phantom wallet
	 */
	async connect(opts?: { onlyIfTrusted?: boolean }): Promise<WalletConnectionResult> {
		try {
			// Check if we're in browser environment
			if (!browser) {
				return {
					success: false,
					error: 'Wallet connection only available in browser'
				};
			}

			// Check if Phantom is installed
			if (!this.isPhantomInstalled()) {
				return {
					success: false,
					error: 'Phantom wallet not installed. Please install from https://phantom.app'
				};
			}

			const provider = this.getProvider();
			if (!provider) {
				return {
					success: false,
					error: 'Failed to get Phantom provider'
				};
			}

			// Connect to Phantom
			const response = await provider.connect(opts);

			if (!response || !response.publicKey) {
				return {
					success: false,
					error: 'Failed to connect to Phantom'
				};
			}

			// Get wallet address
			const address = response.publicKey.toString();

			// Fetch real balance from blockchain
			const balance = await this.getBalance(response.publicKey);

			// Setup event listeners
			this.setupEventListeners(provider);

			return {
				success: true,
				address,
				balance
			};
		} catch (error: any) {
			console.error('Phantom connection error:', error);

			// Handle specific errors
			if (error.code === 4001) {
				return {
					success: false,
					error: 'User rejected the connection request'
				};
			}

			if (error.message?.includes('User rejected')) {
				return {
					success: false,
					error: 'User rejected the connection request'
				};
			}

			return {
				success: false,
				error: error.message || 'Failed to connect to Phantom wallet'
			};
		}
	}

	/**
	 * Disconnect from Phantom wallet
	 */
	async disconnect(): Promise<void> {
		try {
			const provider = this.getProvider();
			if (provider && provider.isConnected) {
				await provider.disconnect();
			}

			// Remove event listeners
			this.removeEventListeners();

			this.provider = null;
		} catch (error) {
			console.error('Disconnect error:', error);
		}
	}

	/**
	 * Get wallet balance in SOL
	 */
	async getBalance(publicKey: PublicKey): Promise<number> {
		try {
			const lamports = await connection.getBalance(publicKey);
			return lamports / LAMPORTS_PER_SOL;
		} catch (error) {
			console.error('Error fetching balance:', error);
			return 0;
		}
	}

	/**
	 * Get current connected wallet address
	 */
	getConnectedAddress(): string | null {
		const provider = this.getProvider();
		if (provider && provider.publicKey) {
			return provider.publicKey.toString();
		}
		return null;
	}

	/**
	 * Check if wallet is currently connected
	 */
	isConnected(): boolean {
		const provider = this.getProvider();
		return !!(provider && provider.isConnected && provider.publicKey);
	}

	/**
	 * Setup event listeners for wallet changes
	 */
	private setupEventListeners(provider: PhantomProvider): void {
		// Account changed
		const onAccountChanged = (publicKey: PublicKey | null) => {
			console.log('Phantom account changed:', publicKey?.toString());
			this.emitEvent('accountChanged', publicKey);
		};

		// Wallet disconnected
		const onDisconnect = () => {
			console.log('Phantom disconnected');
			this.provider = null;
			this.emitEvent('disconnect', null);
		};

		// Store listeners for cleanup
		this.eventListeners.set('accountChanged', [onAccountChanged]);
		this.eventListeners.set('disconnect', [onDisconnect]);

		// Register with Phantom
		provider.on('accountChanged', onAccountChanged);
		provider.on('disconnect', onDisconnect);
	}

	/**
	 * Remove event listeners
	 */
	private removeEventListeners(): void {
		const provider = this.getProvider();
		if (!provider) return;

		this.eventListeners.forEach((listeners, event) => {
			listeners.forEach((listener) => {
				provider.off(event, listener);
			});
		});

		this.eventListeners.clear();
	}

	/**
	 * Emit custom event
	 */
	private emitEvent(event: string, data: any): void {
		// This can be used to trigger Svelte store updates
		if (browser && window.dispatchEvent) {
			window.dispatchEvent(
				new CustomEvent(`phantom:${event}`, {
					detail: data
				})
			);
		}
	}

	/**
	 * Wait for Phantom to be ready
	 */
	async waitForPhantom(timeout = 3000): Promise<boolean> {
		if (!browser) return false;

		const startTime = Date.now();

		while (Date.now() - startTime < timeout) {
			if (this.isPhantomInstalled()) {
				return true;
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		return false;
	}

	/**
	 * Try to auto-reconnect if previously connected
	 */
	async tryAutoReconnect(): Promise<WalletConnectionResult> {
		try {
			// Wait for Phantom to load
			await this.waitForPhantom(2000);

			if (!this.isPhantomInstalled()) {
				return {
					success: false,
					error: 'Phantom not installed'
				};
			}

			// Try to connect only if trusted (no popup)
			return await this.connect({ onlyIfTrusted: true });
		} catch (error) {
			console.log('Auto-reconnect failed:', error);
			return {
				success: false,
				error: 'Auto-reconnect failed'
			};
		}
	}
}

// Export singleton instance
export const phantomWallet = new PhantomWalletService();

/**
 * Helper to check if user has Phantom
 */
export function hasPhantom(): boolean {
	return phantomWallet.isPhantomInstalled();
}

/**
 * Helper to get Phantom download URL
 */
export function getPhantomDownloadUrl(): string {
	return 'https://phantom.app/download';
}
