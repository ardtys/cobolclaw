import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { generateOutputId } from '../parser';
import { wallet, isConnected } from '$lib/stores/wallet';
import { generateMockHoldings } from '$lib/mock-data/wallet';
import { get } from 'svelte/store';

export const bagHandler: CommandHandler = (args, rawInput): CommandOutput => {
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

	const walletState = get(wallet);

	// If no holdings exist, generate some mock holdings
	if (walletState.holdings.length === 0) {
		const mockHoldings = generateMockHoldings(3);
		mockHoldings.forEach((holding) => {
			wallet.addHolding(holding.token, holding.amount, holding.entryPrice);
		});
	}

	// Return portfolio component output
	return {
		id: generateOutputId(),
		command: rawInput,
		output: {
			type: 'bag',
			data: {}
		},
		timestamp: Date.now(),
		type: 'component'
	};
};
