import { Connection, PublicKey, type AccountInfo } from '@solana/web3.js';

// Helius RPC endpoint
const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=6b354dae-a508-4167-96e5-36f7bd9a9d4b';

// Create connection instance
export const connection = new Connection(HELIUS_RPC, {
	commitment: 'confirmed',
	confirmTransactionInitialTimeout: 60000
});

/**
 * Get token supply
 */
export async function getTokenSupply(mintAddress: string): Promise<number> {
	try {
		const supply = await connection.getTokenSupply(new PublicKey(mintAddress));
		return Number(supply.value.amount) / Math.pow(10, supply.value.decimals);
	} catch (error) {
		console.error('Error fetching token supply:', error);
		throw error;
	}
}

/**
 * Get number of token holders
 */
export async function getTokenHolders(mintAddress: string): Promise<number> {
	try {
		// Get largest accounts to estimate holder count
		const largestAccounts = await connection.getTokenLargestAccounts(new PublicKey(mintAddress));
		return largestAccounts.value.length;
	} catch (error) {
		console.error('Error fetching token holders:', error);
		throw error;
	}
}

/**
 * Get account info
 */
export async function getAccountInfo(
	publicKey: string
): Promise<AccountInfo<Buffer> | null> {
	try {
		return await connection.getAccountInfo(new PublicKey(publicKey));
	} catch (error) {
		console.error('Error fetching account info:', error);
		throw error;
	}
}

/**
 * Test RPC connection
 */
export async function testConnection(): Promise<boolean> {
	try {
		const slot = await connection.getSlot();
		return slot > 0;
	} catch (error) {
		console.error('RPC connection failed:', error);
		return false;
	}
}
