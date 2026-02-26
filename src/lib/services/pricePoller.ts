import { getPoolPrice, findPoolByToken } from './raydium';

export class PricePoller {
	private interval: NodeJS.Timeout | null = null;
	private isRunning = false;

	/**
	 * Start polling prices for given token addresses
	 */
	start(
		tokenAddresses: string[],
		callback: (prices: Map<string, number>) => void,
		intervalMs = 5000
	): void {
		if (this.isRunning) {
			console.warn('PricePoller already running');
			return;
		}

		this.isRunning = true;

		// Initial fetch
		this.fetchPrices(tokenAddresses, callback);

		// Set up interval
		this.interval = setInterval(() => {
			this.fetchPrices(tokenAddresses, callback);
		}, intervalMs);
	}

	/**
	 * Stop polling
	 */
	stop(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.isRunning = false;
	}

	/**
	 * Check if currently polling
	 */
	get running(): boolean {
		return this.isRunning;
	}

	/**
	 * Fetch prices for all tokens
	 */
	private async fetchPrices(
		tokenAddresses: string[],
		callback: (prices: Map<string, number>) => void
	): Promise<void> {
		const priceMap = new Map<string, number>();

		// Fetch prices in batches to avoid overwhelming the RPC
		const batchSize = 5;
		for (let i = 0; i < tokenAddresses.length; i += batchSize) {
			const batch = tokenAddresses.slice(i, i + batchSize);

			const pricePromises = batch.map(async (address) => {
				try {
					const poolPrice = await getPoolPrice(address);
					return { address, price: poolPrice.price };
				} catch (error) {
					console.error(`Error fetching price for ${address}:`, error);
					return { address, price: null };
				}
			});

			const results = await Promise.all(pricePromises);

			results.forEach(({ address, price }) => {
				if (price !== null) {
					priceMap.set(address, price);
				}
			});

			// Small delay between batches to avoid rate limiting
			if (i + batchSize < tokenAddresses.length) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}

		// Call callback with updated prices
		callback(priceMap);
	}

	/**
	 * Update polling interval
	 */
	updateInterval(newIntervalMs: number, tokenAddresses: string[], callback: (prices: Map<string, number>) => void): void {
		if (this.isRunning) {
			this.stop();
			this.start(tokenAddresses, callback, newIntervalMs);
		}
	}
}

/**
 * Create a singleton instance
 */
export const globalPricePoller = new PricePoller();
