import axios from 'axios';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const NATIVE_SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface JupiterQuote {
	inputMint: string;
	inAmount: string;
	outputMint: string;
	outAmount: string;
	otherAmountThreshold: string;
	swapMode: string;
	slippageBps: number;
	priceImpactPct: number;
	routePlan: any[];
}

export interface SwapQuoteResult {
	inAmount: number;
	outAmount: number;
	priceImpactPct: number;
	price: number;
	estimatedTokens: number;
}

/**
 * Get Jupiter swap quote
 */
export async function getJupiterQuote(
	inputMint: string,
	outputMint: string,
	amount: number,
	slippageBps: number = 100 // 1% default slippage
): Promise<SwapQuoteResult> {
	try {
		const amountLamports = Math.floor(amount * 1e9);

		const response = await axios.get(`${JUPITER_API}/quote`, {
			params: {
				inputMint,
				outputMint,
				amount: amountLamports,
				slippageBps,
				onlyDirectRoutes: false,
				asLegacyTransaction: false
			},
			timeout: 10000
		});

		const quote: JupiterQuote = response.data;

		if (!quote || !quote.outAmount) {
			throw new Error('Invalid quote response');
		}

		const inAmount = parseInt(quote.inAmount) / 1e9;
		const outAmount = parseInt(quote.outAmount) / 1e9;
		const priceImpactPct = quote.priceImpactPct || 0;
		const price = inAmount / outAmount;

		return {
			inAmount,
			outAmount,
			priceImpactPct,
			price,
			estimatedTokens: outAmount
		};
	} catch (error) {
		console.error('Error fetching Jupiter quote:', error);
		throw error;
	}
}

/**
 * Get quote for buying tokens with SOL
 */
export async function getBuyQuote(
	tokenMint: string,
	solAmount: number,
	slippageBps: number = 100
): Promise<SwapQuoteResult> {
	return getJupiterQuote(NATIVE_SOL_MINT, tokenMint, solAmount, slippageBps);
}

/**
 * Get quote for selling tokens for SOL
 */
export async function getSellQuote(
	tokenMint: string,
	tokenAmount: number,
	slippageBps: number = 100
): Promise<SwapQuoteResult> {
	return getJupiterQuote(tokenMint, NATIVE_SOL_MINT, tokenAmount, slippageBps);
}

/**
 * Get current price from Jupiter
 */
export async function getJupiterPrice(tokenMint: string): Promise<number> {
	try {
		// Get quote for 1 SOL
		const quote = await getBuyQuote(tokenMint, 1);
		return quote.price;
	} catch (error) {
		console.error('Error fetching Jupiter price:', error);
		return 0;
	}
}

/**
 * Check if token is tradeable on Jupiter
 */
export async function isTokenTradeable(tokenMint: string): Promise<boolean> {
	try {
		await getBuyQuote(tokenMint, 0.01); // Try small amount
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Get price impact warning level
 */
export function getPriceImpactLevel(priceImpactPct: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
	const impact = Math.abs(priceImpactPct);

	if (impact > 10) return 'CRITICAL';
	if (impact > 5) return 'HIGH';
	if (impact > 2) return 'MEDIUM';
	return 'LOW';
}

/**
 * Format price impact for display
 */
export function formatPriceImpact(priceImpactPct: number): string {
	const sign = priceImpactPct >= 0 ? '+' : '';
	return `${sign}${priceImpactPct.toFixed(2)}%`;
}
