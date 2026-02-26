import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { generateOutputId } from '../parser';
import { tokens } from '$lib/stores/tokens';
import { getInitialTokenFeed } from '$lib/mock-data/tokens';
import { get } from 'svelte/store';
import { fetchRaydiumPools, getPoolPrice } from '$lib/services/raydium';
import { batchFetchMetadata } from '$lib/services/metadata';
import { getTokenSupply, getTokenHolders } from '$lib/services/helius';
import { transformPoolToToken } from '$lib/services/tokenTransformer';

// Flag to control real data vs mock
const USE_REAL_DATA = true;

export const scanHandler: CommandHandler = async (args, rawInput): Promise<CommandOutput> => {
	// Initialize token feed if empty
	const currentTokens = get(tokens);
	if (currentTokens.feed.length === 0) {
		if (USE_REAL_DATA) {
			try {
				// Fetch real tokens from Raydium
				await fetchRealTokens();
			} catch (error) {
				console.error('Failed to fetch real tokens, using mock data:', error);
				const initialFeed = getInitialTokenFeed();
				tokens.setFeed(initialFeed);
			}
		} else {
			const initialFeed = getInitialTokenFeed();
			tokens.setFeed(initialFeed);
		}
	}

	// Check for filter argument
	if (args.length > 0) {
		const filterKeyword = args[0];

		// Handle special sorting commands
		if (filterKeyword.startsWith('SORT:')) {
			const sortBy = filterKeyword.split(':')[1]?.toLowerCase();

			if (sortBy === 'vol' || sortBy === 'volume') {
				tokens.setSorting('volume5m', 'desc');
				return {
					id: generateOutputId(),
					command: rawInput,
					output: {
						type: 'scan',
						data: {
							filter: null,
							sortBy: 'volume5m'
						}
					},
					timestamp: Date.now(),
					type: 'component'
				};
			} else if (sortBy === 'mcap') {
				tokens.setSorting('mcap', 'desc');
				return {
					id: generateOutputId(),
					command: rawInput,
					output: {
						type: 'scan',
						data: {
							filter: null,
							sortBy: 'mcap'
						}
					},
					timestamp: Date.now(),
					type: 'component'
				};
			} else if (sortBy === 'age') {
				tokens.setSorting('age', 'asc');
				return {
					id: generateOutputId(),
					command: rawInput,
					output: {
						type: 'scan',
						data: {
							filter: null,
							sortBy: 'age'
						}
					},
					timestamp: Date.now(),
					type: 'component'
				};
			} else if (sortBy === 'holders') {
				tokens.setSorting('holders', 'desc');
				return {
					id: generateOutputId(),
					command: rawInput,
					output: {
						type: 'scan',
						data: {
							filter: null,
							sortBy: 'holders'
						}
					},
					timestamp: Date.now(),
					type: 'component'
				};
			}
		} else {
			// Apply keyword filter
			tokens.setFilter(filterKeyword);
			tokens.clearSorting();

			return {
				id: generateOutputId(),
				command: rawInput,
				output: {
					type: 'scan',
					data: {
						filter: filterKeyword,
						sortBy: null
					}
				},
				timestamp: Date.now(),
				type: 'component'
			};
		}
	}

	// Clear any filters/sorting
	tokens.clearFilter();
	tokens.clearSorting();

	// Return scan component output
	return {
		id: generateOutputId(),
		command: rawInput,
		output: {
			type: 'scan',
			data: {
				filter: null,
				sortBy: null
			}
		},
		timestamp: Date.now(),
		type: 'component'
	};
};

/**
 * Fetch real tokens from Raydium pools
 */
async function fetchRealTokens(): Promise<void> {
	try {
		// Fetch Raydium pools
		const pools = await fetchRaydiumPools(30);

		if (pools.length === 0) {
			throw new Error('No pools found');
		}

		// Extract mint addresses
		const mintAddresses = pools.map((pool) => pool.baseMint);

		// Batch fetch metadata
		const metadataMap = await batchFetchMetadata(mintAddresses);

		// Fetch prices, supply, and holders in parallel
		const tokenDataPromises = pools.map(async (pool) => {
			try {
				const [poolPrice, supply, holders] = await Promise.all([
					getPoolPrice(pool.baseMint),
					getTokenSupply(pool.baseMint),
					getTokenHolders(pool.baseMint)
				]);

				const metadata = metadataMap.get(pool.baseMint);
				if (!metadata) {
					return null;
				}

				return transformPoolToToken(pool, metadata, poolPrice, supply, holders);
			} catch (error) {
				console.error(`Error fetching data for ${pool.baseMint}:`, error);
				return null;
			}
		});

		const tokenResults = await Promise.all(tokenDataPromises);

		// Filter out nulls and update store
		const realTokens = tokenResults.filter((token) => token !== null);

		if (realTokens.length > 0) {
			tokens.setFeed(realTokens);
		} else {
			throw new Error('No valid tokens after processing');
		}
	} catch (error) {
		console.error('Error in fetchRealTokens:', error);
		throw error;
	}
}
