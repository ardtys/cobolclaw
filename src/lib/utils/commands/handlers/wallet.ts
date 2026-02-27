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
> DETECTED: PHANTOM WALLET

CONNECTING... (PLEASE APPROVE IN PHANTOM POPUP)
`;

	// Attempt connection (REAL Phantom wallet)
	const result = await wallet.connect();

	if (result.success) {
		const walletState = get(wallet);
		output += `
WALLET LINKED SUCCESSFULLY.
ADDRESS: ${walletState.address}
BALANCE: ${walletState.balance.toFixed(4)} SOL
STATUS:  ██ CONNECTED

⚠️  REAL WALLET CONNECTED - USE WITH CAUTION
THE CLAW IS READY. TYPE "SCAN" TO BEGIN.
`;
	} else {
		// Handle specific error cases
		if (result.error?.includes('not installed')) {
			output = `
ERROR CODE: E-2004
DESCRIPTION: PHANTOM WALLET NOT FOUND

Phantom wallet extension is not installed in your browser.

INSTALLATION STEPS:
1. Visit https://phantom.app/download
2. Install the browser extension
3. Create or import your wallet
4. Return here and type "CONNECT"

TYPE "CONNECT" AFTER INSTALLING PHANTOM.
`;
		} else if (result.error?.includes('rejected')) {
			output = `
ERROR CODE: E-2005
DESCRIPTION: USER REJECTED CONNECTION

You declined the connection request in Phantom.

TYPE "CONNECT" TO TRY AGAIN.
`;
		} else {
			output = `
ERROR CODE: E-2006
DESCRIPTION: WALLET CONNECTION FAILED
DETAILS: ${result.error || 'UNKNOWN ERROR'}

TROUBLESHOOTING:
- Make sure Phantom is unlocked
- Check browser permissions
- Try refreshing the page

TYPE "CONNECT" TO TRY AGAIN.
`;
		}
	}

	return {
		id: generateOutputId(),
		command: rawInput,
		output,
		timestamp: Date.now(),
		type: result.success ? 'text' : 'error'
	};
};

export const disconnectHandler: CommandHandler = async (args, rawInput): Promise<CommandOutput> => {
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

	// Disconnect wallet (async for real Phantom disconnect)
	await wallet.disconnect();

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
