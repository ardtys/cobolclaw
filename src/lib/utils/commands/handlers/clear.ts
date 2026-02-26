import type { CommandHandler, CommandOutput } from '$lib/types/command';
import { terminal } from '$lib/stores/terminal';
import { generateOutputId } from '../parser';

export const clearHandler: CommandHandler = (args, rawInput): CommandOutput => {
	// Clear the terminal output
	terminal.clear();

	return {
		id: generateOutputId(),
		command: rawInput,
		output: 'TERMINAL CLEARED',
		timestamp: Date.now(),
		type: 'text'
	};
};
