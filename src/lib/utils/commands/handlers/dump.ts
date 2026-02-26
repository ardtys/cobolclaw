import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { generateOutputId, validateNumber } from '../parser';
import { wallet, isConnected } from '$lib/stores/wallet';
import { get } from 'svelte/store';

export const dumpHandler: CommandHandler = (args, rawInput): CommandOutput => {
	// Check wallet connected
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

	// Require token identifier
	if (args.length === 0) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-1002
DESCRIPTION: TOKEN IDENTIFIER REQUIRED
USAGE: DUMP [TICKER] [AMOUNT] or DUMP [TICKER] ALL
EXAMPLE: DUMP $BEER 500000 or DUMP $BEER ALL
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	const tokenIdentifier = args[0].toUpperCase();

	// Find token in portfolio
	const walletState = get(wallet);
	const holding = walletState.holdings.find(
		(h) =>
			h.token.ticker.toUpperCase() === tokenIdentifier ||
			h.token.address.toUpperCase() === tokenIdentifier.toUpperCase()
	);

	if (!holding) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-3002
DESCRIPTION: TOKEN NOT IN PORTFOLIO
INPUT: ${tokenIdentifier}
SUGGESTION: TYPE "BAG" TO VIEW YOUR HOLDINGS
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	// Get amount (default to ALL if not provided)
	let amountTokens = holding.amount;
	if (args.length > 1) {
		if (args[1].toUpperCase() === 'ALL') {
			amountTokens = holding.amount;
		} else {
			const validation = validateNumber(args[1]);
			if (!validation.valid) {
				return {
					id: generateOutputId(),
					command: rawInput,
					output: `
ERROR CODE: E-1002
DESCRIPTION: INVALID AMOUNT
${validation.error}
USAGE: DUMP [TICKER] [AMOUNT] or DUMP [TICKER] ALL
`,
					timestamp: Date.now(),
					type: 'error'
				};
			}
			amountTokens = validation.value!;
		}
	}

	// Check sufficient tokens
	if (amountTokens > holding.amount) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-4002
DESCRIPTION: INSUFFICIENT TOKEN BALANCE
REQUIRED: ${amountTokens.toLocaleString()} ${holding.token.ticker}
AVAILABLE: ${holding.amount.toLocaleString()} ${holding.token.ticker}
SUGGESTION: REDUCE AMOUNT OR USE "DUMP ${holding.token.ticker} ALL"
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	// Return transaction confirmation component
	return {
		id: generateOutputId(),
		command: rawInput,
		output: {
			type: 'tx-confirm',
			data: {
				action: 'SELL',
				token: holding.token,
				amountSol: amountTokens // For SELL, this is token amount
			}
		},
		timestamp: Date.now(),
		type: 'component'
	};
};
