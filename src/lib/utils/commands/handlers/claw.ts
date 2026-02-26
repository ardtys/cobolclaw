import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { generateOutputId, validateNumber } from '../parser';
import { tokens } from '$lib/stores/tokens';
import { wallet, isConnected } from '$lib/stores/wallet';
import { get } from 'svelte/store';

export const clawHandler: CommandHandler = (args, rawInput): CommandOutput => {
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
USAGE: CLAW [TICKER] [AMOUNT_COIN]
EXAMPLE: CLAW $BEER 0.5
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	const tokenIdentifier = args[0].toUpperCase();

	// Find token
	const tokenFeed = get(tokens).feed;
	const targetToken = tokenFeed.find(
		(t) =>
			t.ticker.toUpperCase() === tokenIdentifier ||
			t.address.toUpperCase() === tokenIdentifier.toUpperCase()
	);

	if (!targetToken) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-3001
DESCRIPTION: TOKEN NOT FOUND
INPUT: ${tokenIdentifier}
SUGGESTION: TYPE "SCAN" TO VIEW AVAILABLE TOKENS
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	// Get amount (default to 0.1 COIN if not provided)
	let amountSol = 0.1;
	if (args.length > 1) {
		const validation = validateNumber(args[1]);
		if (!validation.valid) {
			return {
				id: generateOutputId(),
				command: rawInput,
				output: `
ERROR CODE: E-1002
DESCRIPTION: INVALID AMOUNT
${validation.error}
USAGE: CLAW [TICKER] [AMOUNT_COIN]
`,
				timestamp: Date.now(),
				type: 'error'
			};
		}
		amountSol = validation.value!;
	}

	// Check sufficient balance
	const walletState = get(wallet);
	if (walletState.balance < amountSol) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-4001
DESCRIPTION: INSUFFICIENT COIN BALANCE
REQUIRED: ${amountSol} COIN | AVAILABLE: ${walletState.balance.toFixed(2)} COIN
SUGGESTION: DEPOSIT MORE COIN OR REDUCE AMOUNT
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
				action: 'BUY',
				token: targetToken,
				amountSol
			}
		},
		timestamp: Date.now(),
		type: 'component'
	};
};
