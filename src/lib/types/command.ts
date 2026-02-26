export interface Command {
	name: string;
	args: string[];
	rawInput: string;
}

export interface CommandOutput {
	id: string;
	command: string;
	output: string | CommandOutputBlock;
	timestamp: number;
	type: 'text' | 'component' | 'error';
}

export interface CommandOutputBlock {
	type: 'scan' | 'bag' | 'audit' | 'alert' | 'settings' | 'help' | 'error' | 'tx-confirm';
	data: any;
}

export type CommandHandler = (
	args: string[],
	rawInput: string
) => Promise<CommandOutput> | CommandOutput;

export interface CommandRegistry {
	[key: string]: {
		handler: CommandHandler;
		description: string;
		usage: string;
		aliases?: string[];
	};
}
