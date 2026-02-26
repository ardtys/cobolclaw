<script lang="ts">
	import { onMount } from 'svelte';
	import type { Token } from '$lib/types/token';
	import { formatCurrency, formatCoin } from '$lib/utils/formatters';
	import { settings } from '$lib/stores/settings';
	import { wallet } from '$lib/stores/wallet';
	import { generateMockTxHash } from '$lib/mock-data/wallet';
	import { getBuyQuote, getSellQuote } from '$lib/services/jupiter';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	export let action: 'BUY' | 'SELL';
	export let token: Token;
	export let amountSol: number;
	export let onConfirm: (txHash: string) => void;
	export let onCancel: () => void;

	let confirmed = false;
	let executing = false;
	let progress = 0;
	let txHash = '';
	let estimatedTokens = 0;
	let priceImpact = 0;
	let loadingQuote = true;
	let quoteError = false;

	// Fetch real quote from Jupiter on mount
	onMount(async () => {
		try {
			if (action === 'BUY') {
				const quote = await getBuyQuote(
					token.address,
					amountSol,
					$settings.slippage * 100
				);
				estimatedTokens = quote.outAmount;
				priceImpact = quote.priceImpactPct;
			} else {
				const quote = await getSellQuote(
					token.address,
					amountSol,
					$settings.slippage * 100
				);
				estimatedTokens = amountSol; // Token amount for sell
				priceImpact = quote.priceImpactPct;
			}
			loadingQuote = false;
		} catch (error) {
			console.warn('Failed to fetch Jupiter quote, using fallback calculation', error);
			quoteError = true;
			// Fallback to simple price calculation
			if (action === 'BUY') {
				estimatedTokens = amountSol / token.price;
			} else {
				estimatedTokens = amountSol;
			}
			priceImpact = 0.5; // Default estimate
			loadingQuote = false;
		}
	});

	async function handleConfirm() {
		if (confirmed || executing) return;

		confirmed = true;
		executing = true;

		// Simulate transaction execution
		const totalTime = 2000 + Math.random() * 1000; // 2-3 seconds
		const steps = 20;
		const interval = totalTime / steps;

		for (let i = 0; i <= steps; i++) {
			progress = (i / steps) * 100;
			await new Promise((resolve) => setTimeout(resolve, interval));
		}

		// Generate tx hash
		txHash = generateMockTxHash();

		// Complete
		executing = false;
		onConfirm(txHash);
	}

	function handleCancel() {
		if (executing) return;
		onCancel();
	}
</script>

<div class="tx-confirmation font-mono text-xs">
	{#if !confirmed}
		<!-- Confirmation Prompt -->
		<div class="confirmation-prompt">
			{#if loadingQuote}
				<pre class="text-crt-green">
═══════════════════════════════════════
 TRANSACTION CONFIRMATION
═══════════════════════════════════════

 FETCHING REAL-TIME QUOTE FROM JUPITER...
 PLEASE WAIT...
				</pre>
			{:else}
				<pre class="text-crt-green">
═══════════════════════════════════════
 TRANSACTION CONFIRMATION
═══════════════════════════════════════

 ACTION:      {action === 'BUY' ? 'BUY (CLAW)' : 'SELL (DUMP)'}
 TOKEN:       {token.ticker} ({token.name})
 AMOUNT:      {action === 'BUY' ? formatCoin(amountSol) : `${estimatedTokens.toLocaleString()} ${token.ticker}`}
 EST. {action === 'BUY' ? 'TOKENS' : 'COIN'}:  {action === 'BUY' ? `~${estimatedTokens.toLocaleString()} ${token.ticker}` : formatCoin(estimatedTokens * token.price)}
 PRICE IMPACT: {priceImpact.toFixed(2)}%{quoteError ? ' (ESTIMATED)' : ' (JUPITER)'}
 SLIPPAGE:    {$settings.slippage}%
 PRIORITY:    {$settings.priorityFee} ({typeof $settings.priorityFee === 'string' ? '0.0001 COIN' : formatCoin($settings.priorityFee)})

 CONFIRM? [Y/N]
				</pre>
			{/if}

			<div class="flex gap-4 mt-4">
				<button
					type="button"
					on:click={handleConfirm}
					disabled={loadingQuote}
					class="confirm-btn px-4 py-2 bg-crt-green text-bg-black font-bold hover:bg-crt-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					[Y] CONFIRM
				</button>
				<button
					type="button"
					on:click={handleCancel}
					disabled={loadingQuote}
					class="cancel-btn px-4 py-2 border border-crt-red text-crt-red hover:bg-crt-red/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					[N] CANCEL
				</button>
			</div>
		</div>
	{:else if executing}
		<!-- Execution Progress -->
		<div class="execution-progress">
			<pre class="text-crt-green">
EXECUTING TRANSACTION...
TX: {txHash || 'PENDING...'}
			</pre>
			<div class="mt-2">
				<ProgressBar {progress} animated={true} />
			</div>
		</div>
	{:else}
		<!-- Success -->
		<div class="execution-success">
			<pre class="text-crt-green">
TRANSACTION CONFIRMED.
TX: {txHash}
{#if action === 'BUY'}
RECEIVED: {estimatedTokens.toLocaleString()} {token.ticker}
{:else}
RECEIVED: {formatCoin(estimatedTokens * token.price)}
{/if}
FEE: 0.000005 COIN

TYPE "BAG" TO VIEW UPDATED PORTFOLIO.
			</pre>
		</div>
	{/if}
</div>

<style>
	.tx-confirmation {
		font-family: 'IBM Plex Mono', monospace;
	}

	pre {
		margin: 0;
		line-height: 1.4;
	}

	.confirm-btn,
	.cancel-btn {
		font-family: 'IBM Plex Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.confirm-btn {
		box-shadow: 0 0 15px var(--crt-green-glow);
	}

	.cancel-btn {
		box-shadow: 0 0 10px rgba(255, 51, 51, 0.4);
	}
</style>
