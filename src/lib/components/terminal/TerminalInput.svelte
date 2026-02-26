<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { terminal } from '$lib/stores/terminal';
	import { audio } from '$lib/stores/audio';
	import { settings } from '$lib/stores/settings';
	import CRTCursor from '$lib/components/crt/CRTCursor.svelte';

	export let disabled: boolean = false;

	const dispatch = createEventDispatcher<{
		submit: string;
		input: string;
	}>();

	let input = '';
	let inputElement: HTMLInputElement;
	let showCursor = true;
	let suggestions: string[] = [];
	let selectedSuggestion = -1;

	// Available commands for autocomplete
	const commands = [
		'SCAN',
		'CLAW',
		'DUMP',
		'AUDIT',
		'BAG',
		'ALERTS',
		'ALERT',
		'SETTINGS',
		'SET',
		'HELP',
		'CLEAR',
		'MENU',
		'DOCS',
		'BACK',
		'CONNECT',
		'DISCONNECT'
	];

	onMount(() => {
		inputElement?.focus();

		// Initialize audio on first interaction
		const initAudio = () => {
			audio.initialize();
			document.removeEventListener('click', initAudio);
			document.removeEventListener('keydown', initAudio);
		};

		document.addEventListener('click', initAudio, { once: true });
		document.addEventListener('keydown', initAudio, { once: true });
	});

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		input = target.value.toUpperCase();

		// Play keystroke sound
		if ($settings.soundEffects) {
			audio.playKeystroke();
		}

		// Update suggestions for autocomplete
		if (input.length > 0) {
			suggestions = commands.filter((cmd) => cmd.startsWith(input));
			selectedSuggestion = suggestions.length > 0 ? 0 : -1;
		} else {
			suggestions = [];
			selectedSuggestion = -1;
		}

		dispatch('input', input);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (disabled) return;

		// Enter - Submit command
		if (event.key === 'Enter') {
			event.preventDefault();
			if (input.trim()) {
				dispatch('submit', input.trim());
				terminal.addCommandToHistory(input.trim());
				input = '';
				suggestions = [];
				selectedSuggestion = -1;
			}
		}
		// Up arrow - Navigate history
		else if (event.key === 'ArrowUp') {
			event.preventDefault();
			terminal.navigateHistory('up');
			// Get the current input from terminal store
			terminal.subscribe((state) => {
				input = state.currentInput;
			})();
		}
		// Down arrow - Navigate history
		else if (event.key === 'ArrowDown') {
			event.preventDefault();
			terminal.navigateHistory('down');
			terminal.subscribe((state) => {
				input = state.currentInput;
			})();
		}
		// Tab - Autocomplete
		else if (event.key === 'Tab') {
			event.preventDefault();
			if (suggestions.length > 0) {
				input = suggestions[selectedSuggestion >= 0 ? selectedSuggestion : 0];
				suggestions = [];
				selectedSuggestion = -1;
			}
		}
		// Escape - Clear input or close suggestions
		else if (event.key === 'Escape') {
			event.preventDefault();
			if (suggestions.length > 0) {
				suggestions = [];
				selectedSuggestion = -1;
			} else {
				input = '';
			}
		}
	}

	function selectSuggestion(suggestion: string) {
		input = suggestion;
		suggestions = [];
		selectedSuggestion = -1;
		inputElement?.focus();
	}

	// Blink cursor every 530ms
	let cursorInterval: NodeJS.Timeout;
	onMount(() => {
		cursorInterval = setInterval(() => {
			showCursor = !showCursor;
		}, 530);

		return () => {
			if (cursorInterval) clearInterval(cursorInterval);
		};
	});
</script>

<div class="terminal-input-container relative">
	<!-- Autocomplete suggestions -->
	{#if suggestions.length > 0}
		<div
			class="suggestions absolute bottom-full left-0 mb-2 bg-bg-dark border border-crt-green-dim p-2 min-w-48 z-50"
		>
			<div class="text-crt-green-dim text-xs mb-1">SUGGESTIONS:</div>
			{#each suggestions as suggestion, i}
				<button
					type="button"
					class="block w-full text-left px-2 py-1 hover:bg-crt-green-dim hover:text-bg-black transition-colors"
					class:bg-crt-green-dim={i === selectedSuggestion}
					class:text-bg-black={i === selectedSuggestion}
					on:click={() => selectSuggestion(suggestion)}
				>
					{suggestion}
				</button>
			{/each}
			<div class="text-crt-green-dim text-xs mt-1 border-t border-crt-green-dim pt-1">
				[TAB] TO COMPLETE
			</div>
		</div>
	{/if}

	<!-- Input bar -->
	<div class="input-bar flex items-center bg-bg-dark border-t border-crt-green-dim p-3 gap-2">
		<span class="prompt text-crt-green-dim font-bold">COBOLCLAW&gt;</span>
		<div class="input-wrapper flex-1 relative">
			<input
				bind:this={inputElement}
				type="text"
				value={input}
				on:input={handleInput}
				on:keydown={handleKeyDown}
				{disabled}
				class="terminal-input w-full bg-transparent border-none outline-none text-crt-green font-mono uppercase text-terminal-cmd"
				placeholder=""
				autocomplete="off"
				spellcheck="false"
			/>
			{#if !input && showCursor}
				<CRTCursor visible={true} />
			{/if}
		</div>
	</div>
</div>

<style>
	.terminal-input {
		caret-color: var(--crt-green);
		text-shadow: 0 0 8px var(--crt-green-glow);
		letter-spacing: 0.05em;
	}

	.terminal-input::placeholder {
		color: var(--crt-green-dim);
		opacity: 0.5;
	}

	.terminal-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.prompt {
		text-shadow: 0 0 6px var(--crt-green-glow);
		white-space: nowrap;
	}

	.suggestions {
		box-shadow: 0 0 20px var(--crt-green-glow);
		font-family: 'IBM Plex Mono', monospace;
	}
</style>
