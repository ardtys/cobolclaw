import {
	Connection,
	PublicKey,
	Transaction,
	VersionedTransaction,
	TransactionInstruction,
	LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { connection } from './helius';
import { phantomWallet } from './phantomWallet';
import axios from 'axios';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const NATIVE_SOL_MINT = 'So11111111111111111111111111111111111111112';

/**
 * ⚠️ CRITICAL SAFETY LIMITS ⚠️
 * These limits prevent accidental large trades
 */
export const SAFETY_LIMITS = {
	MAX_SOL_PER_TRADE: 0.5, // Maximum 0.5 SOL per trade
	MIN_SOL_PER_TRADE: 0.001, // Minimum 0.001 SOL (dust protection)
	MAX_SLIPPAGE_BPS: 1000, // Maximum 10% slippage
	CONFIRMATION_TIMEOUT: 60000 // 60 second timeout
};

export interface SwapQuote {
	inputMint: string;
	outputMint: string;
	inAmount: number;
	outAmount: number;
	priceImpactPct: number;
	slippageBps: number;
	routePlan: any[];
}

export interface SwapResult {
	success: boolean;
	signature?: string;
	error?: string;
	inAmount?: number;
	outAmount?: number;
	priceImpact?: number;
}

/**
 * Get swap quote from Jupiter
 */
export async function getSwapQuote(
	inputMint: string,
	outputMint: string,
	amount: number,
	slippageBps: number = 100
): Promise<SwapQuote> {
	try {
		// Safety check: validate slippage
		if (slippageBps > SAFETY_LIMITS.MAX_SLIPPAGE_BPS) {
			throw new Error(
				`Slippage ${slippageBps / 100}% exceeds maximum ${SAFETY_LIMITS.MAX_SLIPPAGE_BPS / 100}%`
			);
		}

		// Convert to lamports
		const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL);

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

		if (!response.data || !response.data.outAmount) {
			throw new Error('Invalid quote response from Jupiter');
		}

		const quote = response.data;

		return {
			inputMint,
			outputMint,
			inAmount: parseInt(quote.inAmount) / LAMPORTS_PER_SOL,
			outAmount: parseInt(quote.outAmount) / LAMPORTS_PER_SOL,
			priceImpactPct: quote.priceImpactPct || 0,
			slippageBps,
			routePlan: quote.routePlan || []
		};
	} catch (error: any) {
		console.error('Error getting swap quote:', error);
		throw error;
	}
}

/**
 * Execute real swap via Jupiter
 * ⚠️ THIS EXECUTES REAL TRANSACTIONS - USE WITH CAUTION
 */
export async function executeSwap(
	inputMint: string,
	outputMint: string,
	amount: number,
	slippageBps: number = 100,
	priorityFeeLamports: number = 100000 // 0.0001 SOL default
): Promise<SwapResult> {
	try {
		console.log('🚨 EXECUTING REAL SWAP - THIS IS NOT A DRILL');
		console.log(`Input: ${amount} ${inputMint === NATIVE_SOL_MINT ? 'SOL' : 'TOKEN'}`);

		// SAFETY CHECK 1: Wallet must be connected
		if (!phantomWallet.isConnected()) {
			throw new Error('Wallet not connected');
		}

		// SAFETY CHECK 2: Validate amount limits
		if (inputMint === NATIVE_SOL_MINT) {
			if (amount > SAFETY_LIMITS.MAX_SOL_PER_TRADE) {
				throw new Error(
					`Amount ${amount} SOL exceeds safety limit of ${SAFETY_LIMITS.MAX_SOL_PER_TRADE} SOL per trade`
				);
			}
			if (amount < SAFETY_LIMITS.MIN_SOL_PER_TRADE) {
				throw new Error(
					`Amount ${amount} SOL below minimum ${SAFETY_LIMITS.MIN_SOL_PER_TRADE} SOL`
				);
			}
		}

		// SAFETY CHECK 3: Get and validate quote
		const quote = await getSwapQuote(inputMint, outputMint, amount, slippageBps);

		console.log('Quote received:', {
			inAmount: quote.inAmount,
			outAmount: quote.outAmount,
			priceImpact: quote.priceImpactPct
		});

		// SAFETY CHECK 4: Validate price impact
		if (Math.abs(quote.priceImpactPct) > 10) {
			throw new Error(
				`Price impact ${quote.priceImpactPct.toFixed(2)}% is too high (max 10%)`
			);
		}

		// Get wallet public key
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			throw new Error('Failed to get wallet public key');
		}

		const userPublicKey = provider.publicKey;

		// Get swap transaction from Jupiter
		console.log('Requesting swap transaction from Jupiter...');
		const swapResponse = await axios.post(
			`${JUPITER_API}/swap`,
			{
				quoteResponse: {
					inputMint: quote.inputMint,
					inAmount: Math.floor(quote.inAmount * LAMPORTS_PER_SOL).toString(),
					outputMint: quote.outputMint,
					outAmount: Math.floor(quote.outAmount * LAMPORTS_PER_SOL).toString(),
					otherAmountThreshold: Math.floor(quote.outAmount * LAMPORTS_PER_SOL * 0.99).toString(),
					swapMode: 'ExactIn',
					slippageBps: quote.slippageBps,
					priceImpactPct: quote.priceImpactPct,
					routePlan: quote.routePlan
				},
				userPublicKey: userPublicKey.toString(),
				wrapAndUnwrapSol: true,
				prioritizationFeeLamports: priorityFeeLamports,
				asLegacyTransaction: false,
				useSharedAccounts: true,
				dynamicComputeUnitLimit: true
			},
			{
				timeout: 15000
			}
		);

		if (!swapResponse.data || !swapResponse.data.swapTransaction) {
			throw new Error('Failed to get swap transaction from Jupiter');
		}

		const swapTransactionBuf = Buffer.from(swapResponse.data.swapTransaction, 'base64');
		const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

		console.log('Transaction received, requesting user signature...');

		// SAFETY CHECK 5: User must manually sign transaction in Phantom
		// This shows transaction details in Phantom for user review
		const signedTransaction = await provider.signTransaction(transaction);

		console.log('Transaction signed, sending to blockchain...');

		// Send transaction
		const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
			skipPreflight: false,
			maxRetries: 3
		});

		console.log('Transaction sent:', signature);
		console.log('Waiting for confirmation...');

		// Wait for confirmation
		const confirmation = await connection.confirmTransaction(
			signature,
			'confirmed'
		);

		if (confirmation.value.err) {
			throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
		}

		console.log('✅ Transaction confirmed!');

		return {
			success: true,
			signature,
			inAmount: quote.inAmount,
			outAmount: quote.outAmount,
			priceImpact: quote.priceImpactPct
		};
	} catch (error: any) {
		console.error('❌ Swap execution failed:', error);

		// Handle specific errors
		if (error.message?.includes('User rejected')) {
			return {
				success: false,
				error: 'Transaction rejected by user'
			};
		}

		if (error.code === 4001) {
			return {
				success: false,
				error: 'Transaction rejected by user'
			};
		}

		return {
			success: false,
			error: error.message || 'Swap execution failed'
		};
	}
}

/**
 * Execute BUY (SOL → Token)
 */
export async function executeBuy(
	tokenMint: string,
	solAmount: number,
	slippageBps: number = 100
): Promise<SwapResult> {
	console.log(`🔵 BUY: ${solAmount} SOL → ${tokenMint}`);
	return executeSwap(NATIVE_SOL_MINT, tokenMint, solAmount, slippageBps);
}

/**
 * Execute SELL (Token → SOL)
 */
export async function executeSell(
	tokenMint: string,
	tokenAmount: number,
	slippageBps: number = 100
): Promise<SwapResult> {
	console.log(`🔴 SELL: ${tokenAmount} ${tokenMint} → SOL`);
	return executeSwap(tokenMint, NATIVE_SOL_MINT, tokenAmount, slippageBps);
}

/**
 * Validate swap parameters before execution
 */
export function validateSwapParams(
	inputMint: string,
	outputMint: string,
	amount: number
): { valid: boolean; error?: string } {
	// Check mints are different
	if (inputMint === outputMint) {
		return { valid: false, error: 'Input and output mints cannot be the same' };
	}

	// Check amount is positive
	if (amount <= 0) {
		return { valid: false, error: 'Amount must be greater than 0' };
	}

	// Check SOL amount limits
	if (inputMint === NATIVE_SOL_MINT) {
		if (amount > SAFETY_LIMITS.MAX_SOL_PER_TRADE) {
			return {
				valid: false,
				error: `Amount exceeds safety limit of ${SAFETY_LIMITS.MAX_SOL_PER_TRADE} SOL`
			};
		}
		if (amount < SAFETY_LIMITS.MIN_SOL_PER_TRADE) {
			return {
				valid: false,
				error: `Amount below minimum of ${SAFETY_LIMITS.MIN_SOL_PER_TRADE} SOL`
			};
		}
	}

	return { valid: true };
}

/**
 * Check if user has sufficient balance
 */
export async function checkSufficientBalance(
	mint: string,
	amount: number
): Promise<{ sufficient: boolean; balance: number; error?: string }> {
	try {
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			return {
				sufficient: false,
				balance: 0,
				error: 'Wallet not connected'
			};
		}

		if (mint === NATIVE_SOL_MINT) {
			// Check SOL balance
			const balance = await connection.getBalance(provider.publicKey);
			const balanceSOL = balance / LAMPORTS_PER_SOL;

			// Reserve 0.01 SOL for fees
			const availableBalance = balanceSOL - 0.01;

			return {
				sufficient: availableBalance >= amount,
				balance: balanceSOL
			};
		} else {
			// Check SPL token balance
			const { getAssociatedTokenAddress, getAccount } = await import('@solana/spl-token');

			const tokenAddress = await getAssociatedTokenAddress(
				new PublicKey(mint),
				provider.publicKey
			);

			try {
				const tokenAccount = await getAccount(connection, tokenAddress);
				const balance = Number(tokenAccount.amount) / LAMPORTS_PER_SOL;

				return {
					sufficient: balance >= amount,
					balance
				};
			} catch (error) {
				// Token account doesn't exist
				return {
					sufficient: false,
					balance: 0,
					error: 'No token balance found'
				};
			}
		}
	} catch (error: any) {
		return {
			sufficient: false,
			balance: 0,
			error: error.message
		};
	}
}
