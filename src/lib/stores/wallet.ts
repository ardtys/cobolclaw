import { writable, derived } from 'svelte/store';
import type { Wallet, WalletHolding } from '$lib/types/wallet';
import type { Token } from '$lib/types/token';
import { browser } from '$app/environment';

const initialWallet: Wallet = {
	connected: false,
	address: null,
	balance: 0,
	holdings: []
};

function createWalletStore() {
	const { subscribe, set, update } = writable<Wallet>(initialWallet);

	return {
		subscribe,

		// Mock wallet connection
		connect: async (): Promise<{ success: boolean; address?: string; error?: string }> => {
			// Simulate connection delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mock wallet address
			const mockAddress = `7xKp9f${Math.random().toString(36).substr(2, 6)}3fRmZq`;
			const mockBalance = 12.45 + Math.random() * 10;

			update((state) => ({
				...state,
				connected: true,
				address: mockAddress,
				balance: mockBalance
			}));

			return { success: true, address: mockAddress };
		},

		disconnect: () => {
			set(initialWallet);
		},

		updateBalance: (balance: number) => {
			update((state) => ({
				...state,
				balance
			}));
		},

		addHolding: (token: Token, amount: number, entryPrice: number) => {
			update((state) => {
				const value = amount * token.price;
				const pnl = value - amount * entryPrice;
				const pnlPercentage = ((token.price - entryPrice) / entryPrice) * 100;

				const newHolding: WalletHolding = {
					token,
					amount,
					value,
					entryPrice,
					currentPrice: token.price,
					pnl,
					pnlPercentage,
					purchasedAt: Date.now()
				};

				return {
					...state,
					holdings: [...state.holdings, newHolding]
				};
			});
		},

		updateHolding: (tokenAddress: string, amount: number) => {
			update((state) => {
				const holdings = state.holdings.map((holding) => {
					if (holding.token.address === tokenAddress) {
						const value = amount * holding.token.price;
						const pnl = value - amount * holding.entryPrice;
						const pnlPercentage = ((holding.token.price - holding.entryPrice) / holding.entryPrice) * 100;

						return {
							...holding,
							amount,
							value,
							pnl,
							pnlPercentage
						};
					}
					return holding;
				});

				return {
					...state,
					holdings
				};
			});
		},

		removeHolding: (tokenAddress: string) => {
			update((state) => ({
				...state,
				holdings: state.holdings.filter((h) => h.token.address !== tokenAddress)
			}));
		},

		updatePrices: () => {
			update((state) => {
				const holdings = state.holdings.map((holding) => {
					const value = holding.amount * holding.token.price;
					const pnl = value - holding.amount * holding.entryPrice;
					const pnlPercentage = ((holding.token.price - holding.entryPrice) / holding.entryPrice) * 100;

					return {
						...holding,
						currentPrice: holding.token.price,
						value,
						pnl,
						pnlPercentage
					};
				});

				return {
					...state,
					holdings
				};
			});
		}
	};
}

export const wallet = createWalletStore();

// Derived stores
export const isConnected = derived(wallet, ($wallet) => $wallet.connected);

export const totalPortfolioValue = derived(wallet, ($wallet) =>
	$wallet.holdings.reduce((total, holding) => total + holding.value, 0)
);

export const totalPnL = derived(wallet, ($wallet) =>
	$wallet.holdings.reduce((total, holding) => total + holding.pnl, 0)
);

export const totalPnLPercentage = derived([wallet, totalPortfolioValue], ([$wallet, $total]) => {
	if ($total === 0) return 0;
	const invested = $wallet.holdings.reduce((sum, h) => sum + h.amount * h.entryPrice, 0);
	if (invested === 0) return 0;
	return (($total - invested) / invested) * 100;
});

export const diamondHandsScore = derived(wallet, ($wallet) => {
	if ($wallet.holdings.length === 0) return 0;

	const now = Date.now();
	const holdingOver24h = $wallet.holdings.filter(
		(h) => now - h.purchasedAt > 24 * 60 * 60 * 1000
	).length;

	return (holdingOver24h / $wallet.holdings.length) * 100;
});
