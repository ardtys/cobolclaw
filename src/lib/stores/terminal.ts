import { writable, derived, get } from 'svelte/store';
import type { CommandOutput } from '$lib/types/command';
import { browser } from '$app/environment';

interface TerminalState {
	outputs: CommandOutput[];
	commandHistory: string[];
	historyIndex: number;
	currentInput: string;
	isProcessing: boolean;
}

const initialState: TerminalState = {
	outputs: [],
	commandHistory: [],
	historyIndex: -1,
	currentInput: '',
	isProcessing: false
};

// Load command history from sessionStorage
function loadHistory(): string[] {
	if (!browser) return [];
	try {
		const stored = sessionStorage.getItem('cobolclaw_command_history');
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('Failed to load command history:', error);
	}
	return [];
}

function createTerminalStore() {
	const { subscribe, set, update } = writable<TerminalState>({
		...initialState,
		commandHistory: loadHistory()
	});

	function saveHistory(history: string[]) {
		if (!browser) return;
		try {
			sessionStorage.setItem('cobolclaw_command_history', JSON.stringify(history));
		} catch (error) {
			console.error('Failed to save command history:', error);
		}
	}

	return {
		subscribe,

		addOutput: (output: CommandOutput) => {
			update((state) => ({
				...state,
				outputs: [...state.outputs, output]
			}));
		},

		addCommandToHistory: (command: string) => {
			update((state) => {
				const newHistory = [...state.commandHistory, command];
				saveHistory(newHistory);
				return {
					...state,
					commandHistory: newHistory,
					historyIndex: -1 // Reset index after adding new command
				};
			});
		},

		setCurrentInput: (input: string) => {
			update((state) => ({
				...state,
				currentInput: input
			}));
		},

		navigateHistory: (direction: 'up' | 'down') => {
			update((state) => {
				const { commandHistory, historyIndex } = state;

				if (commandHistory.length === 0) return state;

				let newIndex = historyIndex;

				if (direction === 'up') {
					// Go back in history
					newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
				} else {
					// Go forward in history
					newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1);

					// If we reach the end, reset to current input
					if (newIndex === commandHistory.length - 1) {
						newIndex = -1;
					}
				}

				const newInput = newIndex === -1 ? '' : commandHistory[newIndex];

				return {
					...state,
					historyIndex: newIndex,
					currentInput: newInput
				};
			});
		},

		setProcessing: (processing: boolean) => {
			update((state) => ({
				...state,
				isProcessing: processing
			}));
		},

		clear: () => {
			update((state) => ({
				...state,
				outputs: []
			}));
		},

		reset: () => {
			set({
				...initialState,
				commandHistory: get({ subscribe }).commandHistory
			});
		},

		clearHistory: () => {
			update((state) => {
				saveHistory([]);
				return {
					...state,
					commandHistory: [],
					historyIndex: -1
				};
			});
		}
	};
}

export const terminal = createTerminalStore();

// Derived store for output count
export const outputCount = derived(terminal, ($terminal) => $terminal.outputs.length);

// Derived store for checking if terminal is empty
export const terminalEmpty = derived(terminal, ($terminal) => $terminal.outputs.length === 0);
