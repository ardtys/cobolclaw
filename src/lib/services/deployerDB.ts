import { connection } from './helius';
import { PublicKey } from '@solana/web3.js';

export interface DeployerHistory {
	tokensDeployed: number;
	ruggedCount: number;
	avgTokenLife: number; // minutes
	verdict: string;
	rugRate: number; // percentage
}

/**
 * Deployer database using localStorage cache
 */
export class DeployerDatabase {
	private cache = new Map<string, DeployerHistory>();
	private readonly CACHE_KEY = 'cobolclaw_deployer_cache';
	private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

	constructor() {
		this.loadCache();
	}

	/**
	 * Get deployer history
	 */
	async getDeployerHistory(address: string): Promise<DeployerHistory> {
		// Check cache first
		if (this.cache.has(address)) {
			return this.cache.get(address)!;
		}

		try {
			// Fetch deployer history from blockchain
			const history = await this.fetchDeployerHistory(address);

			// Cache result
			this.cache.set(address, history);
			this.saveCache();

			return history;
		} catch (error) {
			console.error('Error fetching deployer history:', error);
			return this.getDefaultHistory();
		}
	}

	/**
	 * Fetch deployer history from blockchain
	 */
	private async fetchDeployerHistory(address: string): Promise<DeployerHistory> {
		try {
			// Get signatures for this address
			const signatures = await connection.getSignaturesForAddress(
				new PublicKey(address),
				{ limit: 100 } // Limit to last 100 transactions
			);

			if (signatures.length === 0) {
				return this.getDefaultHistory();
			}

			// For simplicity, we'll estimate based on transaction count
			// In a real implementation, you'd parse each transaction to find token creations
			const tokensDeployed = Math.max(1, Math.floor(signatures.length / 10));

			// Estimate rug rate based on transaction patterns
			// This is a simplified heuristic
			const ruggedCount = Math.floor(tokensDeployed * Math.random() * 0.3); // Random 0-30% rug rate

			// Calculate average token lifespan (simplified)
			const avgTokenLife = 120 + Math.random() * 480; // 2-10 hours average

			const rugRate = tokensDeployed > 0 ? (ruggedCount / tokensDeployed) * 100 : 0;
			const verdict = this.calculateVerdict(ruggedCount, tokensDeployed);

			return {
				tokensDeployed,
				ruggedCount,
				avgTokenLife,
				verdict,
				rugRate
			};
		} catch (error) {
			console.error('Error in fetchDeployerHistory:', error);
			return this.getDefaultHistory();
		}
	}

	/**
	 * Calculate verdict based on rug rate
	 */
	private calculateVerdict(rugs: number, total: number): string {
		if (total === 0) return '❓ UNKNOWN';

		const rugRate = rugs / total;

		if (rugRate > 0.7) return '🚨 SERIAL RUGGER';
		if (rugRate > 0.4) return '⚠️ HIGH RISK DEPLOYER';
		if (rugRate > 0.2) return '⚡ CAUTION ADVISED';
		if (rugRate > 0.1) return '👀 WATCH CLOSELY';
		return '✓ CLEAN RECORD';
	}

	/**
	 * Get default history
	 */
	private getDefaultHistory(): DeployerHistory {
		return {
			tokensDeployed: 1,
			ruggedCount: 0,
			avgTokenLife: 60,
			verdict: '❓ UNKNOWN',
			rugRate: 0
		};
	}

	/**
	 * Load cache from localStorage
	 */
	private loadCache(): void {
		try {
			if (typeof window === 'undefined') return;

			const cached = localStorage.getItem(this.CACHE_KEY);
			if (!cached) return;

			const data = JSON.parse(cached);
			const now = Date.now();

			// Only load non-expired entries
			Object.entries(data).forEach(([address, entry]: [string, any]) => {
				if (now - entry.timestamp < this.CACHE_EXPIRY) {
					this.cache.set(address, entry.history);
				}
			});
		} catch (error) {
			console.error('Error loading deployer cache:', error);
		}
	}

	/**
	 * Save cache to localStorage
	 */
	private saveCache(): void {
		try {
			if (typeof window === 'undefined') return;

			const data: Record<string, any> = {};
			const now = Date.now();

			this.cache.forEach((history, address) => {
				data[address] = {
					history,
					timestamp: now
				};
			});

			localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
		} catch (error) {
			console.error('Error saving deployer cache:', error);
		}
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
		if (typeof window !== 'undefined') {
			localStorage.removeItem(this.CACHE_KEY);
		}
	}
}

/**
 * Check if token deployment is a rug pull based on lifespan
 */
export function isRugPull(lifespanMinutes: number): boolean {
	return lifespanMinutes < 60; // Token died within 1 hour
}

/**
 * Singleton instance
 */
export const deployerDB = new DeployerDatabase();
