import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { wallet, isConnected } from '$lib/stores/wallet';
import { generateOutputId } from '../parser';
import { get } from 'svelte/store';

export const connectHandler: CommandHandler = async (args, rawInput): Promise<CommandOutput> => {
	// Check if already connected
	if (get(isConnected)) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-2002
DESCRIPTION: WALLET ALREADY CONNECTED
ADDRESS: ${get(wallet).address}
SUGGESTION: USE "DISCONNECT" TO DISCONNECT CURRENT WALLET
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	// Show connection initiation message
	let output = `
INITIATING WALLET HANDSHAKE...
> SCANNING FOR WALLET PROVIDERS...
> DETECTED: PHANTOM v24.1.0 (MOCK)

CONNECTING...
`;

	// Attempt connection (mock)
	const result = await wallet.connect();

	if (result.success) {
		const walletState = get(wallet);
		output += `
WALLET LINKED SUCCESSFULLY.
ADDRESS: ${walletState.address}
BALANCE: ${walletState.balance.toFixed(2)} COIN
STATUS:  ██ CONNECTED

THE CLAW IS READY. TYPE "SCAN" TO BEGIN.
`;
	} else {
		output = `
ERROR: WALLET CONNECTION REJECTED.
${result.error || 'UNKNOWN ERROR'}
TYPE "CONNECT" TO TRY AGAIN.
`;
	}

	return {
		id: generateOutputId(),
		command: rawInput,
		output,
		timestamp: Date.now(),
		type: result.success ? 'text' : 'error'
	};
};

export const disconnectHandler: CommandHandler = (args, rawInput): CommandOutput => {
	// Check if wallet is connected
	if (!get(isConnected)) {
		return {
			id: generateOutputId(),
			command: rawInput,
			output: `
ERROR CODE: E-2003
DESCRIPTION: NO WALLET CONNECTED
SUGGESTION: USE "CONNECT" TO CONNECT A WALLET FIRST
`,
			timestamp: Date.now(),
			type: 'error'
		};
	}

	const address = get(wallet).address;

	// Disconnect wallet
	wallet.disconnect();

	return {
		id: generateOutputId(),
		command: rawInput,
		output: `
WALLET DISCONNECTED SUCCESSFULLY.
ADDRESS: ${address}
STATUS: DISCONNECTED

TYPE "CONNECT" TO RECONNECT.
`,
		timestamp: Date.now(),
		type: 'text'
	};
};
