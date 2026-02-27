import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
	getAssociatedTokenAddress,
	getAccount,
	Account as TokenAccount,
	TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { connection } from './helius';
import { phantomWallet } from './phantomWallet';
import type { Token } from '$lib/types/token';

export interface TokenBalance {
	mint: string;
	address: string;
	balance: number;
	decimals: number;
	uiAmount: number;
}

export interface TokenHolding {
	token: Token;
	balance: number;
	value: number;
	address: string;
}

/**
 * Get all SPL token balances for connected wallet
 */
export async function getAllTokenBalances(): Promise<TokenBalance[]> {
	try {
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			throw new Error('Wallet not connected');
		}

		const walletPublicKey = provider.publicKey;

		// Get all token accounts owned by wallet
		const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
			programId: TOKEN_PROGRAM_ID
		});

		const balances: TokenBalance[] = [];

		for (const accountInfo of tokenAccounts.value) {
			const parsedInfo = accountInfo.account.data.parsed.info;

			// Only include accounts with non-zero balance
			if (parsedInfo.tokenAmount.uiAmount > 0) {
				balances.push({
					mint: parsedInfo.mint,
					address: accountInfo.pubkey.toString(),
					balance: Number(parsedInfo.tokenAmount.amount),
					decimals: parsedInfo.tokenAmount.decimals,
					uiAmount: parsedInfo.tokenAmount.uiAmount
				});
			}
		}

		console.log(`Found ${balances.length} token balances in wallet`);
		return balances;
	} catch (error) {
		console.error('Error fetching token balances:', error);
		throw error;
	}
}

/**
 * Get balance for specific SPL token
 */
export async function getTokenBalance(mintAddress: string): Promise<number> {
	try {
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			throw new Error('Wallet not connected');
		}

		const mintPubkey = new PublicKey(mintAddress);
		const walletPubkey = provider.publicKey;

		// Get associated token account address
		const tokenAddress = await getAssociatedTokenAddress(mintPubkey, walletPubkey);

		try {
			// Try to get token account
			const tokenAccount = await getAccount(connection, tokenAddress);

			// Return balance (in token units, not lamports)
			return Number(tokenAccount.amount) / Math.pow(10, 9); // Assume 9 decimals for now
		} catch (error) {
			// Token account doesn't exist, balance is 0
			return 0;
		}
	} catch (error) {
		console.error('Error fetching token balance:', error);
		return 0;
	}
}

/**
 * Get SOL balance for connected wallet
 */
export async function getSOLBalance(): Promise<number> {
	try {
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			throw new Error('Wallet not connected');
		}

		const balance = await connection.getBalance(provider.publicKey);
		return balance / LAMPORTS_PER_SOL;
	} catch (error) {
		console.error('Error fetching SOL balance:', error);
		return 0;
	}
}

/**
 * Get token holdings with metadata
 * Matches token balances with Token objects from feed
 */
export async function getTokenHoldings(tokenFeed: Token[]): Promise<TokenHolding[]> {
	try {
		const balances = await getAllTokenBalances();
		const holdings: TokenHolding[] = [];

		for (const balance of balances) {
			// Find matching token in feed
			const token = tokenFeed.find((t) => t.address === balance.mint);

			if (token) {
				holdings.push({
					token,
					balance: balance.uiAmount,
					value: balance.uiAmount * token.price,
					address: balance.address
				});
			} else {
				// Token not in feed, create minimal Token object
				console.log(`Token ${balance.mint} not found in feed, balance: ${balance.uiAmount}`);
			}
		}

		return holdings;
	} catch (error) {
		console.error('Error getting token holdings:', error);
		return [];
	}
}

/**
 * Calculate total portfolio value in SOL
 */
export async function calculatePortfolioValue(holdings: TokenHolding[]): Promise<number> {
	const tokenValue = holdings.reduce((total, holding) => total + holding.value, 0);
	const solBalance = await getSOLBalance();

	return tokenValue + solBalance;
}

/**
 * Monitor token balance changes
 * Returns a cleanup function
 */
export function watchTokenBalance(
	mintAddress: string,
	callback: (balance: number) => void,
	intervalMs: number = 10000
): () => void {
	let running = true;

	const poll = async () => {
		while (running) {
			try {
				const balance = await getTokenBalance(mintAddress);
				callback(balance);
			} catch (error) {
				console.error('Error polling token balance:', error);
			}

			await new Promise((resolve) => setTimeout(resolve, intervalMs));
		}
	};

	poll();

	// Return cleanup function
	return () => {
		running = false;
	};
}

/**
 * Check if wallet has token account for mint
 */
export async function hasTokenAccount(mintAddress: string): Promise<boolean> {
	try {
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			return false;
		}

		const mintPubkey = new PublicKey(mintAddress);
		const tokenAddress = await getAssociatedTokenAddress(mintPubkey, provider.publicKey);

		try {
			await getAccount(connection, tokenAddress);
			return true;
		} catch {
			return false;
		}
	} catch {
		return false;
	}
}

/**
 * Create associated token account if it doesn't exist
 * Returns token account address
 */
export async function ensureTokenAccount(mintAddress: string): Promise<string> {
	try {
		const provider = phantomWallet.getProvider();
		if (!provider || !provider.publicKey) {
			throw new Error('Wallet not connected');
		}

		const mintPubkey = new PublicKey(mintAddress);
		const tokenAddress = await getAssociatedTokenAddress(mintPubkey, provider.publicKey);

		// Check if account exists
		const exists = await hasTokenAccount(mintAddress);

		if (!exists) {
			console.log(
				`Token account doesn't exist for ${mintAddress}, Jupiter will create it during swap`
			);
		}

		return tokenAddress.toString();
	} catch (error) {
		console.error('Error ensuring token account:', error);
		throw error;
	}
}

/**
 * Refresh all balances
 */
export async function refreshAllBalances(): Promise<{
	sol: number;
	tokens: TokenBalance[];
}> {
	try {
		const [sol, tokens] = await Promise.all([getSOLBalance(), getAllTokenBalances()]);

		return {
			sol,
			tokens
		};
	} catch (error) {
		console.error('Error refreshing balances:', error);
		return {
			sol: 0,
			tokens: []
		};
	}
}
