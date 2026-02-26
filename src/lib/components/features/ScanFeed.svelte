<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { filteredTokens, tokens } from '$lib/stores/tokens';
	import { settings } from '$lib/stores/settings';
	import { generateMockToken, updateTokenPrices } from '$lib/mock-data/tokens';
	import { globalPricePoller } from '$lib/services/pricePoller';
	import TokenRow from './TokenRow.svelte';
	import { padString, formatCobolDateTime } from '$lib/utils/formatters';

	export let autoRefresh: boolean = true;

	const dispatch = createEventDispatcher<{
		audit: string;
	}>();

	let newTokenIds = new Set<string>();
	let refreshInterval: NodeJS.Timeout;
	let updateInterval: NodeJS.Timeout;

	onMount(() => {
		// Auto-refresh: add new tokens periodically
		if (autoRefresh) {
			refreshInterval = setInterval(
				() => {
					addNewToken();
				},
				$settings.scanRefreshRate * 1000
			);

			// Start real-time price polling if we have tokens
			if ($filteredTokens.length > 0) {
				const tokenAddresses = $filteredTokens.map((t) => t.address);
				globalPricePoller.start(tokenAddresses, (prices) => {
					// Update token prices in store
					tokens.updatePrices(prices);
				}, 5000);
			} else {
				// Fallback to mock price updates
				updateInterval = setInterval(() => {
					updatePrices();
				}, 5000);
			}
		}
	});

	onDestroy(() => {
		if (refreshInterval) clearInterval(refreshInterval);
		if (updateInterval) clearInterval(updateInterval);
		globalPricePoller.stop();
	});

	function addNewToken() {
		const newToken = generateMockToken();
		tokens.addToken(newToken);

		// Mark as new for flash animation
		newTokenIds.add(newToken.id);

		// Remove flash after 500ms
		setTimeout(() => {
			newTokenIds.delete(newToken.id);
			newTokenIds = new Set(newTokenIds);
		}, 500);
	}

	function updatePrices() {
		// Get current feed
		const currentFeed = $filteredTokens;

		if (currentFeed.length === 0) return;

		// Update each token
		const updated = updateTokenPrices(currentFeed);

		// Set the updated feed
		tokens.setFeed(updated);
	}

	function handleAudit(event: CustomEvent<string>) {
		dispatch('audit', event.detail);
	}

	// Table column widths
	const colWidths = [16, 8, 7, 11, 9, 8, 8];
	const headers = ['TOKEN NAME', 'TICKER', 'AGE', 'MCAP', 'VOL(5M)', 'HOLDERS', 'STATUS'];
</script>

<div class="scan-feed font-mono">
	<!-- Header -->
	<div class="feed-header text-crt-green mb-2">
		<pre class="text-xs">
════════════════════════════════════════════════════════════════
 COBOLCLAW SCAN REPORT          DATE: {formatCobolDateTime(Date.now())}
 LIVE TOKEN FEED                CHAIN: BLOCKCHAIN MAINNET
════════════════════════════════════════════════════════════════
		</pre>
	</div>

	<!-- Column Headers -->
	<div class="table-header text-crt-green-dim text-xs mb-1">
		{#each headers as header, i}
			<span>{padString(header, colWidths[i])}</span>
		{/each}
	</div>

	<!-- Separator -->
	<div class="text-crt-green-dim text-xs mb-2">
		{#each colWidths as width}
			{'─'.repeat(width)}
		{/each}
	</div>

	<!-- Token Rows -->
	<div class="token-list space-y-0 max-h-96 overflow-y-auto">
		{#if $filteredTokens.length === 0}
			<div class="text-crt-green-dim text-center py-4">NO TOKENS FOUND</div>
		{:else}
			{#each $filteredTokens as token (token.id)}
				<TokenRow {token} isNew={newTokenIds.has(token.id)} on:audit={handleAudit} />
			{/each}
		{/if}
	</div>

	<!-- Footer -->
	<div class="feed-footer text-crt-green-dim text-xs mt-2">
		<pre>
──────────────────────────────────────────────────────────────
 [AUTO-REFRESH: {$settings.scanRefreshRate}S]  CLICK TICKER TO AUDIT
 TYPE "AUDIT [TICKER]" TO VIEW FULL ANALYSIS
──────────────────────────────────────────────────────────────
		</pre>
	</div>
</div>

<style>
	.scan-feed {
		font-family: 'IBM Plex Mono', monospace;
	}

	.table-header span {
		margin-right: 0.5rem;
	}

	.token-list::-webkit-scrollbar {
		width: 6px;
	}

	.token-list::-webkit-scrollbar-track {
		background: var(--bg-dark);
	}

	.token-list::-webkit-scrollbar-thumb {
		background: var(--crt-green-dim);
	}

	pre {
		margin: 0;
		line-height: 1.4;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.scan-feed {
			font-size: 10px;
		}

		.token-list {
			max-height: 60vh;
		}
	}
</style>
