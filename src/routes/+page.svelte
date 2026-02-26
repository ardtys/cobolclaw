<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import BootSequence from '$lib/components/features/BootSequence.svelte';

	let showBoot = false;
	let loading = true;

	onMount(() => {
		// Check if user has already seen the boot sequence
		const hasSeenBoot = browser && sessionStorage.getItem('cobolclaw_boot_seen');

		if (hasSeenBoot) {
			// Skip boot, go straight to terminal
			goto('/terminal');
		} else {
			// Show boot sequence
			loading = false;
			showBoot = true;
		}
	});
</script>

<svelte:head>
	<title>COBOLCLAW - Initializing...</title>
</svelte:head>

{#if loading}
	<div class="loading-screen flex items-center justify-center min-h-screen bg-bg-black">
		<div class="text-center">
			<div class="font-display text-terminal-header text-crt-green mb-4">COBOLCLAW</div>
			<div class="text-crt-green-dim text-terminal animate-pulse">INITIALIZING...</div>
		</div>
	</div>
{:else if showBoot}
	<BootSequence />
{/if}

<style>
	.loading-screen {
		font-family: 'Share Tech Mono', 'IBM Plex Mono', monospace;
		text-shadow: 0 0 10px var(--crt-green-glow);
	}
</style>
