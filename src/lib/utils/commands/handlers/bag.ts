import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { generateOutputId } from '../parser';
import { wallet, isConnected } from '$lib/stores/wallet';
import { tokens } from '$lib/stores/tokens';
import { getTokenHoldings, getSOLBalance } from '$lib/services/tokenBalance';
import { get } from 'svelte/store';

/**
 * BAG command - Show real portfolio from blockchain
 * Fetches actual SPL token balances from connected wallet
 */
export const bagHandler: CommandHandler = async (args, rawInput): Promise<CommandOutput> => {
	// Check if wallet is connected
	if (!get(isConnected)) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-2001
DESCRIPTION: NO WALLET DETECTED
SUGGESTION: TYPE "CONNECT" TO LINK WALLET FIRST
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	try {
		console.log('📊 Fetching real portfolio from blockchain...');

		// Get token feed for metadata
		const tokenFeed = get(tokens).feed;

		// Fetch real token holdings from blockchain
		const holdings = await getTokenHoldings(tokenFeed);

		// Update wallet store with real holdings
		// Note: We need to convert TokenHolding to WalletHolding format
		get(wallet); // Trigger store update

		console.log(`Found ${holdings.length} tokens in wallet`);

		// If no holdings, show message
		if (holdings.length === 0) {
			return {
				id: generateOutputId(),
				command: rawInput,
				output: `
═══════════════════════════════════════
 YOUR PORTFOLIO (REAL BLOCKCHAIN DATA)
═══════════════════════════════════════

📭 NO TOKEN HOLDINGS FOUND

Your wallet has no SPL tokens yet.

SUGGESTIONS:
- Use "SCAN" to find tokens
- Use "CLAW [TICKER] [AMOUNT]" to buy tokens
- Make sure you have SOL in your wallet

Current SOL Balance: ${(await getSOLBalance()).toFixed(4)} SOL
`,
				timestamp: Date.now(),
				type: 'text'
			};
		}

		// Return portfolio component output with real holdings
		return {
			id: generateOutputId(),
			command: rawInput,
			output: {
				type: 'bag',
				data: {
					holdings,
					solBalance: await getSOLBalance(),
					isRealData: true
				}
			},
			timestamp: Date.now(),
			type: 'component'
		};
	} catch (error: any) {
		console.error('Error fetching portfolio:', error);

		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-5001
DESCRIPTION: FAILED TO FETCH PORTFOLIO FROM BLOCKCHAIN
DETAILS: ${error.message || 'Unknown error'}

TROUBLESHOOTING:
- Check internet connection
- Make sure wallet is still connected
- Try "DISCONNECT" then "CONNECT" again
- Check RPC status

TYPE "BAG" TO TRY AGAIN
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}
};
