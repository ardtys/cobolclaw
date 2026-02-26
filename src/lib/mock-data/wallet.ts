import type { WalletHolding } from '$lib/types/wallet';
import { generateMockToken } from './tokens';

/**
 * Generate mock wallet holdings
 */
export function generateMockHoldings(count: number = 3): WalletHolding[] {
	const holdings: WalletHolding[] = [];

	for (let i = 0; i < count; i++) {
		const token = generateMockToken();

		// Random entry price (lower than current for some profit)
		const entryPriceMultiplier = 0.5 + Math.random() * 1.5; // 0.5x to 2x current price
		const entryPrice = token.price * entryPriceMultiplier;

		// Random amount held
		const amount = Math.floor(Math.random() * 10000000) + 100000; // 100K to 10M tokens

		const value = amount * token.price;
		const pnl = value - amount * entryPrice;
		const pnlPercentage = ((token.price - entryPrice) / entryPrice) * 100;

		// Purchase time (1 hour to 7 days ago)
		const hoursAgo = Math.floor(Math.random() * 168) + 1; // 1-168 hours
		const purchasedAt = Date.now() - hoursAgo * 60 * 60 * 1000;

		holdings.push({
			token,
			amount,
			value,
			entryPrice,
			currentPrice: token.price,
			pnl,
			pnlPercentage,
			purchasedAt
		});
	}

	return holdings;
}

/**
 * Generate a mock wallet address
 */
export function generateMockAddress(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
	let address = '';
	for (let i = 0; i < 44; i++) {
		address += chars[Math.floor(Math.random() * chars.length)];
	}
	return address;
}

/**
 * Generate mock transaction hash
 */
export function generateMockTxHash(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
	let hash = '';
	for (let i = 0; i < 88; i++) {
		hash += chars[Math.floor(Math.random() * chars.length)];
	}
	return hash;
}
