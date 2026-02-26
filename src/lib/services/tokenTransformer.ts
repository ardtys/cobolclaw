import type { Token, TokenStatus } from '$lib/types/token';
import type { RaydiumPool, PoolPrice } from './raydium';
import type { TokenMetadata } from './metadata';

/**
 * Transform Raydium pool data + metadata into Token interface
 */
export function transformPoolToToken(
	pool: RaydiumPool,
	metadata: TokenMetadata,
	poolPrice: PoolPrice,
	supply: number,
	holders: number
): Token {
	const now = Date.now();
	const deployTime = pool.openTime * 1000;
	const age = Math.floor((now - deployTime) / 1000);

	// Calculate market cap
	const mcap = poolPrice.price * supply;

	// Estimate 5-minute volume from 24h volume
	const volume5m = poolPrice.volume24h / 288;

	// Calculate status based on age, volume, and holders
	const status = calculateStatus(age, volume5m, holders, poolPrice.liquidity);

	return {
		id: pool.baseMint,
		name: metadata.name,
		ticker: metadata.symbol,
		address: pool.baseMint,
		age,
		mcap,
		volume5m,
		holders,
		status,
		price: poolPrice.price,
		supply,
		liquidity: poolPrice.liquidity,
		bondcurveProgress: 100, // Raydium = bonding curve completed
		deployer: metadata.updateAuthority,
		deployTime,
		createdAt: deployTime
	};
}

/**
 * Calculate token status based on metrics
 */
function calculateStatus(
	age: number,
	volume5m: number,
	holders: number,
	liquidity: number
): TokenStatus {
	// DEAD: Very low activity or liquidity
	if (volume5m < 10 || holders < 5 || liquidity < 100) {
		return 'DEAD';
	}

	// HOT: Fresh token with high volume
	if (age < 300 && volume5m > 1000) {
		// < 5 min, > $1k volume
		return 'HOT';
	}

	// WARM: Recent token with decent volume
	if (age < 600 && volume5m > 500) {
		// < 10 min, > $500 volume
		return 'WARM';
	}

	// WARM: Good liquidity and volume regardless of age
	if (liquidity > 10000 && volume5m > 1000) {
		return 'WARM';
	}

	// COOL: Everything else
	return 'COOL';
}

/**
 * Calculate market cap from price and supply
 */
export function calculateMarketCap(price: number, supply: number): number {
	return price * supply;
}

/**
 * Calculate liquidity from pool reserves
 */
export function calculateLiquidity(baseReserve: number, quoteReserve: number): number {
	// Liquidity is typically measured as total value locked (TVL)
	// For SOL pairs, we multiply quote reserve by 2 (assuming balanced)
	return quoteReserve * 2;
}

/**
 * Batch transform multiple pools into tokens
 */
export async function batchTransformPools(
	pools: RaydiumPool[],
	metadataMap: Map<string, TokenMetadata>,
	priceMap: Map<string, PoolPrice>,
	supplyMap: Map<string, number>,
	holdersMap: Map<string, number>
): Promise<Token[]> {
	const tokens: Token[] = [];

	for (const pool of pools) {
		const metadata = metadataMap.get(pool.baseMint);
		const poolPrice = priceMap.get(pool.baseMint);
		const supply = supplyMap.get(pool.baseMint);
		const holders = holdersMap.get(pool.baseMint);

		// Skip if missing critical data
		if (!metadata || !poolPrice || !supply) {
			continue;
		}

		const token = transformPoolToToken(pool, metadata, poolPrice, supply, holders || 0);
		tokens.push(token);
	}

	return tokens;
}

/**
 * Filter tokens by criteria
 */
export function filterTokens(
	tokens: Token[],
	criteria: {
		minLiquidity?: number;
		minHolders?: number;
		maxAge?: number; // seconds
		status?: TokenStatus[];
	}
): Token[] {
	return tokens.filter((token) => {
		if (criteria.minLiquidity && token.liquidity < criteria.minLiquidity) {
			return false;
		}

		if (criteria.minHolders && token.holders < criteria.minHolders) {
			return false;
		}

		if (criteria.maxAge && token.age > criteria.maxAge) {
			return false;
		}

		if (criteria.status && !criteria.status.includes(token.status)) {
			return false;
		}

		return true;
	});
}

/**
 * Sort tokens by various criteria
 */
export function sortTokens(
	tokens: Token[],
	sortBy: 'age' | 'mcap' | 'volume5m' | 'holders' | 'liquidity',
	order: 'asc' | 'desc' = 'desc'
): Token[] {
	const sorted = [...tokens].sort((a, b) => {
		let comparison = 0;

		switch (sortBy) {
			case 'age':
				comparison = a.age - b.age;
				break;
			case 'mcap':
				comparison = a.mcap - b.mcap;
				break;
			case 'volume5m':
				comparison = a.volume5m - b.volume5m;
				break;
			case 'holders':
				comparison = a.holders - b.holders;
				break;
			case 'liquidity':
				comparison = a.liquidity - b.liquidity;
				break;
		}

		return order === 'asc' ? comparison : -comparison;
	});

	return sorted;
}
