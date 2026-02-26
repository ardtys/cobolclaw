import type { CommandRegistry } from '$lib/types/command';
import { helpHandler } from './handlers/help';
import { clearHandler } from './handlers/clear';
import { connectHandler, disconnectHandler } from './handlers/wallet';
import { scanHandler } from './handlers/scan';
import { bagHandler } from './handlers/bag';
import { auditHandler } from './handlers/audit';
import { clawHandler } from './handlers/claw';
import { dumpHandler } from './handlers/dump';

/**
 * Command registry mapping command names to their handlers
 */
export const commandRegistry: CommandRegistry = {
	HELP: {
		handler: helpHandler,
		description: 'SHOW AVAILABLE COMMANDS',
		usage: 'HELP'
	},
	CLEAR: {
		handler: clearHandler,
		description: 'CLEAR TERMINAL OUTPUT',
		usage: 'CLEAR'
	},
	CONNECT: {
		handler: connectHandler,
		description: 'CONNECT WALLET',
		usage: 'CONNECT'
	},
	DISCONNECT: {
		handler: disconnectHandler,
		description: 'DISCONNECT WALLET',
		usage: 'DISCONNECT'
	},
	SCAN: {
		handler: scanHandler,
		description: 'SHOW LIVE TOKEN FEED',
		usage: 'SCAN [FILTER] | SCAN SORT:VOL | SCAN SORT:MCAP'
	},
	BAG: {
		handler: bagHandler,
		description: 'SHOW PORTFOLIO HOLDINGS',
		usage: 'BAG'
	},
	AUDIT: {
		handler: auditHandler,
		description: 'ANALYZE TOKEN RISK',
		usage: 'AUDIT [TICKER] | AUDIT [ADDRESS]'
	},
	CLAW: {
		handler: clawHandler,
		description: 'BUY TOKEN',
		usage: 'CLAW [TICKER] [AMOUNT_SOL]'
	},
	DUMP: {
		handler: dumpHandler,
		description: 'SELL TOKEN',
		usage: 'DUMP [TICKER] [AMOUNT] | DUMP [TICKER] ALL'
	}
	// More handlers will be added for ALERTS, SETTINGS, etc.
};

/**
 * Get all available command names
 */
export function getAvailableCommands(): string[] {
	return Object.keys(commandRegistry);
}

/**
 * Check if a command exists in the registry
 */
export function commandExists(commandName: string): boolean {
	return commandName.toUpperCase() in commandRegistry;
}

/**
 * Get command info
 */
export function getCommandInfo(commandName: string) {
	return commandRegistry[commandName.toUpperCase()];
}
