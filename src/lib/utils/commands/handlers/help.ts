import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { generateOutputId } from '../parser';
import { getAvailableCommands, commandRegistry } from '../registry';
import { padString } from '../../formatters';

export const helpHandler: CommandHandler = (args, rawInput): CommandOutput => {
	const commands = getAvailableCommands();

	let output = `
════════════════════════════════════════════════════════════════
 COBOLCLAW COMMAND REFERENCE
 AVAILABLE COMMANDS
════════════════════════════════════════════════════════════════

`;

	// Add each command with description and usage
	commands.forEach((cmd) => {
		const info = commandRegistry[cmd];
		output += ` ${padString(cmd, 15)} ${info.description}\n`;
		output += ` ${padString('', 15)} USAGE: ${info.usage}\n\n`;
	});

	output += `════════════════════════════════════════════════════════════════
 TYPE ANY COMMAND TO EXECUTE
 USE [TAB] FOR AUTOCOMPLETE
 USE [UP]/[DOWN] FOR COMMAND HISTORY
════════════════════════════════════════════════════════════════
`;

	return {
		id: generateOutputId(),
		command: rawInput,
		output,
		timestamp: Date.now(),
		type: 'text'
	};
};
