import type { Token } from './token';

export interface Wallet {
	connected: boolean;
	address: string | null;
	balance: number; // COIN
	holdings: WalletHolding[];
}

export interface WalletHolding {
	token: Token;
	amount: number;
	value: number; // USD value
	entryPrice: number;
	currentPrice: number;
	pnl: number;
	pnlPercentage: number;
	purchasedAt: number; // timestamp
}

export interface TransactionResult {
	success: boolean;
	txHash: string;
	error?: string;
}
