<script lang="ts">
	import { wallet, totalPortfolioValue, totalPnL, totalPnLPercentage, diamondHandsScore } from '$lib/stores/wallet';
	import { padString, formatCurrency, formatPercentage, createProgressBar } from '$lib/utils/formatters';
	import { formatAddress } from '$lib/utils/formatters';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		audit: string;
	}>();

	function handleRowClick(tokenAddress: string) {
		dispatch('audit', tokenAddress);
	}

	// Calculate diamond hands progress bar
	$: diamondHandsBar = createProgressBar($diamondHandsScore, 10);
</script>

<div class="portfolio-table font-mono">
	<!-- Header -->
	<div class="portfolio-header text-crt-green mb-2">
		<pre class="text-xs">
════════════════════════════════════════════════════════════════
 PORTFOLIO REPORT                WALLET: {$wallet.address ? formatAddress($wallet.address, 4, 4) : 'N/A'}
 GENERATED: {new Date().toISOString().slice(0, 19).replace('T', ' ')}  COIN BALANCE: {$wallet.balance.toFixed(2)} COIN
════════════════════════════════════════════════════════════════
		</pre>
	</div>

	<!-- Column Headers -->
	<div class="table-header text-crt-green-dim text-xs mb-1">
		<span>{padString('#', 3)}</span>
		<span>{padString('TOKEN', 14)}</span>
		<span>{padString('AMOUNT', 14)}</span>
		<span>{padString('VALUE', 11)}</span>
		<span>{padString('ENTRY', 9)}</span>
		<span>{padString('NOW', 9)}</span>
		<span>{padString('PNL', 11)}</span>
	</div>

	<!-- Separator -->
	<div class="text-crt-green-dim text-xs mb-2">
		{'──  '.repeat(7)}
	</div>

	<!-- Holdings -->
	<div class="holdings-list space-y-1 max-h-64 overflow-y-auto">
		{#if $wallet.holdings.length === 0}
			<div class="text-crt-green-dim text-center py-4">NO TOKENS HELD</div>
		{:else}
			{#each $wallet.holdings as holding, i}
				<button
					type="button"
					on:click={() => handleRowClick(holding.token.address)}
					class="holding-row block w-full text-left hover:bg-crt-green/10 transition-colors font-mono text-terminal whitespace-nowrap py-1"
				>
					<span class="text-crt-green-dim">{padString((i + 1).toString().padStart(2, '0'), 3)}</span>
					<span class="text-crt-green terminal-clickable">{padString(holding.token.ticker, 14)}</span>
					<span>{padString(holding.amount.toLocaleString(), 14)}</span>
					<span>{padString(formatCurrency(holding.value), 11)}</span>
					<span>{padString(holding.entryPrice.toFixed(8), 9)}</span>
					<span>{padString(holding.currentPrice.toFixed(8), 9)}</span>
					<span class:text-crt-green={holding.pnl >= 0} class:text-red={holding.pnl < 0}>
						{padString(`${holding.pnl >= 0 ? '+' : ''}${formatCurrency(holding.pnl)} (${formatPercentage(holding.pnlPercentage, 1, true)})`, 11)}
					</span>
				</button>
			{/each}
		{/if}
	</div>

	<!-- Summary Footer -->
	<div class="portfolio-footer text-crt-green mt-2">
		<pre class="text-xs">
──────────────────────────────────────────────────────────────
 TOTAL VALUE:     {formatCurrency($totalPortfolioValue)}
 TOTAL PNL:       <span class:text-crt-green={$totalPnL >= 0} class:text-red={$totalPnL < 0}>{$totalPnL >= 0 ? '+' : ''}{formatCurrency($totalPnL)} ({formatPercentage($totalPnLPercentage, 1, true)})</span>
 DIAMOND HANDS:   {diamondHandsBar} {$diamondHandsScore.toFixed(0)}%
──────────────────────────────────────────────────────────────
 TYPE "DUMP [TICKER]" TO SELL  |  TYPE "CLAW [TICKER]" TO BUY MORE
		</pre>
	</div>
</div>

<style>
	.portfolio-table {
		font-family: 'IBM Plex Mono', monospace;
	}

	.table-header span {
		margin-right: 0.5rem;
		display: inline-block;
	}

	.holding-row span {
		margin-right: 0.5rem;
		display: inline-block;
	}

	.holding-row:hover {
		text-shadow: 0 0 12px var(--crt-green-glow);
	}

	.holdings-list::-webkit-scrollbar {
		width: 6px;
	}

	.holdings-list::-webkit-scrollbar-track {
		background: var(--bg-dark);
	}

	.holdings-list::-webkit-scrollbar-thumb {
		background: var(--crt-green-dim);
	}

	pre {
		margin: 0;
		line-height: 1.4;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.portfolio-table {
			font-size: 10px;
		}

		.holdings-list {
			max-height: 50vh;
		}
	}
</style>
