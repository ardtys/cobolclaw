import { connection } from './helius';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

// Raydium AMM V4 Program ID
export const RAYDIUM_AMM_V4 = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';

// Raydium API endpoint
const RAYDIUM_API = 'https://api.raydium.io/v2';

export interface RaydiumPool {
	poolId: string;
	baseMint: string;
	quoteMint: string;
	lpMint: string;
	baseVault: string;
	quoteVault: string;
	openTime: number;
	baseDecimals: number;
	quoteDecimals: number;
	baseSymbol: string;
	quoteSymbol: string;
}

export interface PoolPrice {
	price: number;
	volume24h: number;
	liquidity: number;
}

/**
 * Fetch active Raydium pools from API
 */
export async function fetchRaydiumPools(limit = 50): Promise<RaydiumPool[]> {
	try {
		// Use Raydium API to get pool list
		const response = await axios.get(`${RAYDIUM_API}/main/pairs`, {
			timeout: 10000
		});

		if (!response.data || !Array.isArray(response.data)) {
			throw new Error('Invalid response from Raydium API');
		}

		// Filter for recent pools and sort by liquidity
		const pools = response.data
			.filter((pool: any) => {
				// Only include pools with SOL as quote
				return pool.quoteMint === 'So11111111111111111111111111111111111111112';
			})
			.map((pool: any) => ({
				poolId: pool.ammId,
				baseMint: pool.baseMint,
				quoteMint: pool.quoteMint,
				lpMint: pool.lpMint,
				baseVault: pool.baseVault || '',
				quoteVault: pool.quoteVault || '',
				openTime: pool.poolOpenTime || Date.now() / 1000,
				baseDecimals: pool.baseDecimals || 9,
				quoteDecimals: pool.quoteDecimals || 9,
				baseSymbol: pool.baseSymbol || 'UNKNOWN',
				quoteSymbol: pool.quoteSymbol || 'SOL'
			}))
			.slice(0, limit);

		return pools;
	} catch (error) {
		console.error('Error fetching Raydium pools:', error);
		throw error;
	}
}

/**
 * Get pool price and liquidity info
 */
export async function getPoolPrice(baseMint: string): Promise<PoolPrice> {
	try {
		// Use Raydium API to get price info
		const response = await axios.get(`${RAYDIUM_API}/main/price`, {
			timeout: 5000
		});

		const priceData = response.data[baseMint];

		if (!priceData) {
			// Return default if not found
			return {
				price: 0.00000001,
				volume24h: 0,
				liquidity: 0
			};
		}

		return {
			price: priceData.value || 0.00000001,
			volume24h: priceData.volume24h || 0,
			liquidity: priceData.liquidity || 0
		};
	} catch (error) {
		console.error('Error fetching pool price:', error);
		// Return default on error
		return {
			price: 0.00000001,
			volume24h: 0,
			liquidity: 0
		};
	}
}

/**
 * Calculate volume from recent swaps (simplified)
 */
export async function getPoolVolume(baseMint: string, timeframeMinutes = 5): Promise<number> {
	try {
		// For now, we'll estimate 5-min volume as 24h volume / 288
		const poolPrice = await getPoolPrice(baseMint);
		return poolPrice.volume24h / 288; // Rough estimate
	} catch (error) {
		console.error('Error calculating pool volume:', error);
		return 0;
	}
}

/**
 * Find pool by token mint address
 */
export async function findPoolByToken(tokenMint: string): Promise<RaydiumPool | null> {
	try {
		const pools = await fetchRaydiumPools(100);
		return pools.find((pool) => pool.baseMint === tokenMint) || null;
	} catch (error) {
		console.error('Error finding pool:', error);
		return null;
	}
}

/**
 * Get pool reserves to calculate price
 */
export async function getPoolReserves(
	poolId: string
): Promise<{ baseReserve: number; quoteReserve: number } | null> {
	try {
		const poolAccount = await connection.getAccountInfo(new PublicKey(poolId));

		if (!poolAccount) {
			return null;
		}

		// This would require parsing the pool account data
		// For now, we'll use the API price instead
		return null;
	} catch (error) {
		console.error('Error fetching pool reserves:', error);
		return null;
	}
}
