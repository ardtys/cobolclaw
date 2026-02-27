import { writable, derived } from 'svelte/store';
import type { Wallet, WalletHolding } from '$lib/types/wallet';
import type { Token } from '$lib/types/token';
import { browser } from '$app/environment';
import { phantomWallet } from '$lib/services/phantomWallet';

const initialWallet: Wallet = {
	connected: false,
	address: null,
	balance: 0,
	holdings: []
};

function createWalletStore() {
	const { subscribe, set, update } = writable<Wallet>(initialWallet);

	// Listen for Phantom events
	if (browser) {
		// Account changed event
		window.addEventListener('phantom:accountChanged', async (event: any) => {
			const publicKey = event.detail;
			if (publicKey) {
				const balance = await phantomWallet.getBalance(publicKey);
				update((state) => ({
					...state,
					address: publicKey.toString(),
					balance
				}));
			} else {
				// Account disconnected
				set(initialWallet);
			}
		});

		// Disconnect event
		window.addEventListener('phantom:disconnect', () => {
			set(initialWallet);
		});
	}

	return {
		subscribe,

		// Real Phantom wallet connection
		connect: async (): Promise<{ success: boolean; address?: string; error?: string }> => {
			try {
				const result = await phantomWallet.connect();

				if (result.success && result.address) {
					update((state) => ({
						...state,
						connected: true,
						address: result.address!,
						balance: result.balance || 0
					}));
				}

				return result;
			} catch (error: any) {
				console.error('Wallet connection error:', error);
				return {
					success: false,
					error: error.message || 'Failed to connect wallet'
				};
			}
		},

		disconnect: async () => {
			await phantomWallet.disconnect();
			set(initialWallet);
		},

		updateBalance: (balance: number) => {
			update((state) => ({
				...state,
				balance
			}));
		},

		// Refresh balance from blockchain
		refreshBalance: async () => {
			if (!phantomWallet.isConnected()) return;

			const address = phantomWallet.getConnectedAddress();
			if (!address) return;

			try {
				const { PublicKey } = await import('@solana/web3.js');
				const publicKey = new PublicKey(address);
				const balance = await phantomWallet.getBalance(publicKey);

				update((state) => ({
					...state,
					balance
				}));
			} catch (error) {
				console.error('Error refreshing balance:', error);
			}
		},

		// Try to auto-reconnect on page load
		tryAutoReconnect: async () => {
			const result = await phantomWallet.tryAutoReconnect();

			if (result.success && result.address) {
				update((state) => ({
					...state,
					connected: true,
					address: result.address!,
					balance: result.balance || 0
				}));
			}

			return result;
		},

		addHolding: (token: Token, amount: number, entryPrice: number) => {
			update((state) => {
				const value = amount * token.price;
				const pnl = value - amount * entryPrice;
				const pnlPercentage = ((token.price - entryPrice) / entryPrice) * 100;

				const newHolding: WalletHolding = {
					token,
					amount,
					value,
					entryPrice,
					currentPrice: token.price,
					pnl,
					pnlPercentage,
					purchasedAt: Date.now()
				};

				return {
					...state,
					holdings: [...state.holdings, newHolding]
				};
			});
		},

		updateHolding: (tokenAddress: string, amount: number) => {
			update((state) => {
				const holdings = state.holdings.map((holding) => {
					if (holding.token.address === tokenAddress) {
						const value = amount * holding.token.price;
						const pnl = value - amount * holding.entryPrice;
						const pnlPercentage = ((holding.token.price - holding.entryPrice) / holding.entryPrice) * 100;

						return {
							...holding,
							amount,
							value,
							pnl,
							pnlPercentage
						};
					}
					return holding;
				});

				return {
					...state,
					holdings
				};
			});
		},

		removeHolding: (tokenAddress: string) => {
			update((state) => ({
				...state,
				holdings: state.holdings.filter((h) => h.token.address !== tokenAddress)
			}));
		},

		updatePrices: () => {
			update((state) => {
				const holdings = state.holdings.map((holding) => {
					const value = holding.amount * holding.token.price;
					const pnl = value - holding.amount * holding.entryPrice;
					const pnlPercentage = ((holding.token.price - holding.entryPrice) / holding.entryPrice) * 100;

					return {
						...holding,
						currentPrice: holding.token.price,
						value,
						pnl,
						pnlPercentage
					};
				});

				return {
					...state,
					holdings
				};
			});
		}
	};
}

export const wallet = createWalletStore();

// Derived stores
export const isConnected = derived(wallet, ($wallet) => $wallet.connected);

export const totalPortfolioValue = derived(wallet, ($wallet) =>
	$wallet.holdings.reduce((total, holding) => total + holding.value, 0)
);

export const totalPnL = derived(wallet, ($wallet) =>
	$wallet.holdings.reduce((total, holding) => total + holding.pnl, 0)
);

export const totalPnLPercentage = derived([wallet, totalPortfolioValue], ([$wallet, $total]) => {
	if ($total === 0) return 0;
	const invested = $wallet.holdings.reduce((sum, h) => sum + h.amount * h.entryPrice, 0);
	if (invested === 0) return 0;
	return (($total - invested) / invested) * 100;
});

export const diamondHandsScore = derived(wallet, ($wallet) => {
	if ($wallet.holdings.length === 0) return 0;

	const now = Date.now();
	const holdingOver24h = $wallet.holdings.filter(
		(h) => now - h.purchasedAt > 24 * 60 * 60 * 1000
	).length;

	return (holdingOver24h / $wallet.holdings.length) * 100;
});
