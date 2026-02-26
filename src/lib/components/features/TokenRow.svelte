<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Token } from '$lib/types/token';
	import { formatAge, formatMcap, formatVolume, getStatusDisplay, getStatusClass } from '$lib/types/token';
	import { padString } from '$lib/utils/formatters';

	export let token: Token;
	export let isNew: boolean = false;

	const dispatch = createEventDispatcher<{
		audit: string;
	}>();

	function handleClick() {
		dispatch('audit', token.address);
	}

	// Format values with fixed widths for table alignment
	$: name = padString(token.name.substring(0, 16), 16);
	$: ticker = padString(token.ticker, 8);
	$: age = padString(formatAge(token.age), 7);
	$: mcap = padString(formatMcap(token.mcap), 11);
	$: volume = padString(formatVolume(token.volume5m), 9);
	$: holders = padString(token.holders.toString(), 8);
	$: statusDisplay = getStatusDisplay(token.status);
</script>

<button
	type="button"
	on:click={handleClick}
	class="token-row block w-full text-left hover:bg-crt-green/10 transition-colors font-mono text-terminal whitespace-nowrap overflow-x-auto"
	class:flash-new={isNew}
>
	<span>{name}</span>
	<span class="terminal-clickable {getStatusClass(token.status)}">{ticker}</span>
	<span>{age}</span>
	<span>{mcap}</span>
	<span>{volume}</span>
	<span>{holders}</span>
	<span class="{getStatusClass(token.status)}">{statusDisplay}</span>
</button>

<style>
	.token-row {
		padding: 0.25rem 0;
		border-bottom: 1px solid rgba(51, 255, 51, 0.1);
	}

	.token-row:hover {
		text-shadow: 0 0 12px var(--crt-green-glow);
	}

	.token-row span {
		margin-right: 0.5rem;
	}

	/* Mobile: Wrap text */
	@media (max-width: 768px) {
		.token-row {
			font-size: 10px;
			white-space: normal;
		}
	}
</style>
