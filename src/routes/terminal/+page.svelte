<script lang="ts">
	import { onMount } from 'svelte';
	import HeaderBar from '$lib/components/terminal/HeaderBar.svelte';
	import Sidebar from '$lib/components/terminal/Sidebar.svelte';
	import TerminalOutput from '$lib/components/terminal/TerminalOutput.svelte';
	import TerminalInput from '$lib/components/terminal/TerminalInput.svelte';
	import { terminal } from '$lib/stores/terminal';
	import { wallet } from '$lib/stores/wallet';
	import { parseCommand } from '$lib/utils/commands/parser';
	import { commandRegistry, commandExists } from '$lib/utils/commands/registry';
	import { generateOutputId } from '$lib/utils/commands/parser';
	import type { CommandOutput } from '$lib/types/command';

	let sidebarVisible = true;
	let activeMenuItem = '';
	let processing = false;

	async function handleCommand(event: CustomEvent<string>) {
		const input = event.detail;

		if (processing) return;

		processing = true;
		terminal.setProcessing(true);

		try {
			// Parse the command
			const command = parseCommand(input);

			// Check if command exists
			if (!commandExists(command.name)) {
				const output: CommandOutput = {
					id: generateOutputId(),
					command: input,
					output: `
ERROR CODE: E-1001
DESCRIPTION: UNKNOWN COMMAND: "${command.name}"
SUGGESTION: TYPE "HELP" FOR AVAILABLE COMMANDS
`,
					timestamp: Date.now(),
					type: 'error'
				};
				terminal.addOutput(output);
			} else {
				// Execute the command
				const handler = commandRegistry[command.name].handler;
				const result = await handler(command.args, input);
				terminal.addOutput(result);
			}
		} catch (error) {
			console.error('Command execution error:', error);
			const output: CommandOutput = {
				id: generateOutputId(),
				command: input,
				output: `
ERROR CODE: E-9999
DESCRIPTION: INTERNAL SYSTEM ERROR
DETAILS: ${error instanceof Error ? error.message : 'UNKNOWN ERROR'}
SUGGESTION: PLEASE REPORT THIS BUG
`,
				timestamp: Date.now(),
				type: 'error'
			};
			terminal.addOutput(output);
		} finally {
			processing = false;
			terminal.setProcessing(false);
		}
	}

	function handleSidebarCommand(event: CustomEvent<string>) {
		// Trigger command from sidebar
		const command = event.detail;
		handleCommand(new CustomEvent('submit', { detail: command }));
	}

	function toggleSidebar() {
		sidebarVisible = !sidebarVisible;
	}

	onMount(async () => {
		// Try to auto-reconnect wallet if previously connected
		try {
			await wallet.tryAutoReconnect();
		} catch (error) {
			console.log('Auto-reconnect failed:', error);
		}
	});
</script>

<svelte:head>
	<title>COBOLCLAW - Terminal</title>
</svelte:head>

<div class="terminal-page h-screen flex flex-col overflow-hidden">
	<HeaderBar />

	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		<Sidebar visible={sidebarVisible} activeItem={activeMenuItem} on:command={handleSidebarCommand} />

		<!-- Main Terminal Area -->
		<main class="flex-1 flex flex-col overflow-hidden">
			<TerminalOutput on:command={handleCommand} />
			<TerminalInput disabled={processing} on:submit={handleCommand} />
		</main>
	</div>

	<!-- Mobile menu toggle button -->
	<button
		type="button"
		class="mobile-menu-toggle md:hidden fixed bottom-20 right-4 z-50 bg-bg-dark border border-crt-green p-3 rounded"
		on:click={toggleSidebar}
	>
		<span class="text-crt-green text-xs">MENU</span>
	</button>
</div>

<style>
	.terminal-page {
		background-color: var(--bg-black);
		font-family: 'IBM Plex Mono', monospace;
	}

	.mobile-menu-toggle {
		box-shadow: 0 0 15px var(--crt-green-glow);
	}

	.mobile-menu-toggle:hover {
		background-color: var(--crt-green-dim);
		color: var(--bg-black);
	}
</style>
