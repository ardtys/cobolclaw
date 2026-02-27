<script lang="ts">
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { terminal } from '$lib/stores/terminal';
	import CommandHistory from './CommandHistory.svelte';

	const dispatch = createEventDispatcher<{
		command: string;
	}>();

	let outputContainer: HTMLDivElement;
	let autoScroll = true;

	function handleCommand(event: CustomEvent<string>) {
		dispatch('command', event.detail);
	}

	// Auto-scroll to bottom when new output is added
	afterUpdate(() => {
		if (autoScroll && outputContainer) {
			outputContainer.scrollTop = outputContainer.scrollHeight;
		}
	});

	onMount(() => {
		// Check if user is scrolled to bottom
		const handleScroll = () => {
			if (!outputContainer) return;

			const { scrollTop, scrollHeight, clientHeight } = outputContainer;
			autoScroll = scrollTop + clientHeight >= scrollHeight - 10;
		};

		outputContainer?.addEventListener('scroll', handleScroll);

		return () => {
			outputContainer?.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div
	bind:this={outputContainer}
	class="terminal-output flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
>
	{#if $terminal.outputs.length === 0}
		<div class="welcome-message text-crt-green-dim">
			<pre class="font-mono text-terminal">
════════════════════════════════════════════════════════════════
 COBOLCLAW MAINFRAME TERMINAL v1.0.0
 (C) 2026 COBOLCLAW LABORATORIES
════════════════════════════════════════════════════════════════

 OLD CODE. FAST CLAWS.

 TYPE "HELP" FOR AVAILABLE COMMANDS
 TYPE "SCAN" TO VIEW LIVE TOKEN FEED
 TYPE "DOCS" FOR DOCUMENTATION

════════════════════════════════════════════════════════════════
			</pre>
		</div>
	{:else}
		<CommandHistory outputs={$terminal.outputs} on:command={handleCommand} />
	{/if}
</div>

<style>
	.terminal-output {
		min-height: 0;
		font-family: 'IBM Plex Mono', monospace;
	}

	.terminal-output::-webkit-scrollbar {
		width: 8px;
	}

	.terminal-output::-webkit-scrollbar-track {
		background: var(--bg-dark);
	}

	.terminal-output::-webkit-scrollbar-thumb {
		background: var(--crt-green-dim);
		border: 1px solid var(--crt-green-dim);
	}

	.terminal-output::-webkit-scrollbar-thumb:hover {
		background: var(--crt-green);
	}

	.welcome-message pre {
		line-height: 1.4;
	}
</style>
