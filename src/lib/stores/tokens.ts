import { writable, derived } from 'svelte/store';
import type { Token } from '$lib/types/token';
import type { AuditReport } from '$lib/types/audit';

interface TokensState {
	feed: Token[];
	auditCache: Map<string, AuditReport>;
	filter: string | null;
	sortBy: 'age' | 'mcap' | 'volume5m' | 'holders' | null;
	sortOrder: 'asc' | 'desc';
	lastUpdate: number;
}

const initialState: TokensState = {
	feed: [],
	auditCache: new Map(),
	filter: null,
	sortBy: null,
	sortOrder: 'desc',
	lastUpdate: 0
};

function createTokensStore() {
	const { subscribe, set, update } = writable<TokensState>(initialState);

	return {
		subscribe,

		setFeed: (tokens: Token[]) => {
			update((state) => ({
				...state,
				feed: tokens,
				lastUpdate: Date.now()
			}));
		},

		addToken: (token: Token) => {
			update((state) => ({
				...state,
				feed: [token, ...state.feed].slice(0, 50), // Keep max 50 tokens
				lastUpdate: Date.now()
			}));
		},

		updateToken: (address: string, updates: Partial<Token>) => {
			update((state) => ({
				...state,
				feed: state.feed.map((token) =>
					token.address === address ? { ...token, ...updates } : token
				)
			}));
		},

		removeToken: (address: string) => {
			update((state) => ({
				...state,
				feed: state.feed.filter((token) => token.address !== address)
			}));
		},

		setFilter: (filter: string | null) => {
			update((state) => ({
				...state,
				filter
			}));
		},

		setSorting: (sortBy: TokensState['sortBy'], sortOrder: 'asc' | 'desc' = 'desc') => {
			update((state) => ({
				...state,
				sortBy,
				sortOrder
			}));
		},

		cacheAudit: (address: string, audit: AuditReport) => {
			update((state) => {
				const newCache = new Map(state.auditCache);
				newCache.set(address, audit);
				return {
					...state,
					auditCache: newCache
				};
			});
		},

		getAudit: (address: string): AuditReport | undefined => {
			let result: AuditReport | undefined;
			subscribe((state) => {
				result = state.auditCache.get(address);
			})();
			return result;
		},

		clearFilter: () => {
			update((state) => ({
				...state,
				filter: null
			}));
		},

		clearSorting: () => {
			update((state) => ({
				...state,
				sortBy: null,
				sortOrder: 'desc'
			}));
		},

		updatePrices: (priceMap: Map<string, number>) => {
			update((state) => ({
				...state,
				feed: state.feed.map((token) => {
					const newPrice = priceMap.get(token.address);
					if (newPrice !== undefined) {
						return {
							...token,
							price: newPrice,
							mcap: newPrice * token.supply
						};
					}
					return token;
				})
			}));
		},

		reset: () => {
			set(initialState);
		}
	};
}

export const tokens = createTokensStore();

// Derived store for filtered and sorted tokens
export const filteredTokens = derived(tokens, ($tokens) => {
	let result = [...$tokens.feed];

	// Apply filter
	if ($tokens.filter) {
		const filterLower = $tokens.filter.toLowerCase();
		result = result.filter(
			(token) =>
				token.name.toLowerCase().includes(filterLower) ||
				token.ticker.toLowerCase().includes(filterLower)
		);
	}

	// Apply sorting
	if ($tokens.sortBy) {
		result.sort((a, b) => {
			const aVal = a[$tokens.sortBy!];
			const bVal = b[$tokens.sortBy!];

			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return $tokens.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
			}

			return 0;
		});
	}

	return result;
});

// Derived store for token count
export const tokenCount = derived(tokens, ($tokens) => $tokens.feed.length);
