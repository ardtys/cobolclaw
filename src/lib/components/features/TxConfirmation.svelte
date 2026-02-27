<script lang="ts">
	import { onMount } from 'svelte';
	import type { Token } from '$lib/types/token';
	import { formatCurrency, formatCoin } from '$lib/utils/formatters';
	import { settings } from '$lib/stores/settings';
	import { wallet } from '$lib/stores/wallet';
	import { getBuyQuote, getSellQuote } from '$lib/services/jupiter';
	import { executeBuy, executeSell, SAFETY_LIMITS } from '$lib/services/jupiterSwap';
	import { getTokenBalance, refreshAllBalances } from '$lib/services/tokenBalance';
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
		progress = 0;

		try {
			console.log('🚨 EXECUTING REAL SWAP TRANSACTION');

			// Prepare transaction
			progress = 10;

			let result;
			const slippageBps = $settings.slippage * 100;

			if (action === 'BUY') {
				// Execute real BUY (SOL → Token)
				progress = 20;
				console.log(`Buying ${token.ticker} with ${amountSol} SOL`);

				result = await executeBuy(token.address, amountSol, slippageBps);
			} else {
				// Execute real SELL (Token → SOL)
				progress = 20;
				console.log(`Selling ${amountSol} ${token.ticker} for SOL`);

				result = await executeSell(token.address, amountSol, slippageBps);
			}

			if (!result.success) {
				// Transaction failed
				executing = false;
				confirmed = false;
				throw new Error(result.error || 'Transaction failed');
			}

			// Transaction sent
			progress = 50;
			txHash = result.signature || '';

			// Wait for confirmation
			progress = 75;
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Refresh balances after successful swap
			progress = 90;
			await refreshAllBalances();
			await wallet.refreshBalance();

			// Complete
			progress = 100;
			executing = false;

			console.log('✅ Transaction successful:', txHash);
			onConfirm(txHash);
		} catch (error: any) {
			console.error('❌ Transaction failed:', error);

			executing = false;
			confirmed = false;
			progress = 0;

			// Show error to user
			alert(`Transaction Failed:\n${error.message || 'Unknown error'}\n\nPlease try again.`);

			// Call onCancel to close the confirmation
			onCancel();
		}
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
 🚨 REAL TRANSACTION CONFIRMATION 🚨
═══════════════════════════════════════

 ⚠️  WARNING: THIS WILL EXECUTE A REAL
     BLOCKCHAIN TRANSACTION WITH REAL MONEY

 ACTION:      {action === 'BUY' ? 'BUY (CLAW)' : 'SELL (DUMP)'}
 TOKEN:       {token.ticker} ({token.name})
 AMOUNT:      {action === 'BUY' ? formatCoin(amountSol) : `${estimatedTokens.toLocaleString()} ${token.ticker}`}
 EST. {action === 'BUY' ? 'TOKENS' : 'SOL'}:  {action === 'BUY' ? `~${estimatedTokens.toLocaleString()} ${token.ticker}` : formatCoin(estimatedTokens * token.price)}
 PRICE IMPACT: {priceImpact.toFixed(2)}%{quoteError ? ' (ESTIMATED)' : ' (JUPITER)'}
 SLIPPAGE:    {$settings.slippage}%
 PRIORITY:    {$settings.priorityFee} ({typeof $settings.priorityFee === 'string' ? '0.0001 SOL' : formatCoin($settings.priorityFee)})

 🔐 SAFETY LIMITS:
 - MAX PER TRADE: {SAFETY_LIMITS.MAX_SOL_PER_TRADE} SOL
 - MAX SLIPPAGE: {SAFETY_LIMITS.MAX_SLIPPAGE_BPS / 100}%
 - MAX PRICE IMPACT: 10%

 📝 YOU WILL NEED TO:
 1. Approve in Phantom wallet popup
 2. Wait for blockchain confirmation

 PROCEED WITH REAL TRANSACTION? [Y/N]
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
🚨 EXECUTING REAL BLOCKCHAIN TRANSACTION...

{#if progress < 20}
PREPARING TRANSACTION...
{:else if progress < 50}
WAITING FOR PHANTOM SIGNATURE...
⏳ Please approve in your Phantom wallet
{:else if progress < 75}
BROADCASTING TO BLOCKCHAIN...
TX: {txHash || 'PENDING...'}
{:else if progress < 100}
WAITING FOR CONFIRMATION...
TX: {txHash}
{:else}
TRANSACTION CONFIRMED ✅
TX: {txHash}
{/if}
			</pre>
			<div class="mt-2">
				<ProgressBar {progress} animated={true} />
			</div>
			<pre class="text-crt-amber mt-2">
⚠️  DO NOT CLOSE THIS WINDOW
    Transaction in progress...
			</pre>
		</div>
	{:else}
		<!-- Success -->
		<div class="execution-success">
			<pre class="text-crt-green">
✅ REAL TRANSACTION CONFIRMED ✅

TX SIGNATURE: {txHash}

{#if action === 'BUY'}
BOUGHT: ~{estimatedTokens.toLocaleString()} {token.ticker}
SPENT: {formatCoin(amountSol)}
{:else}
SOLD: {estimatedTokens.toLocaleString()} {token.ticker}
RECEIVED: ~{formatCoin(estimatedTokens * token.price)}
{/if}

🔍 View on Solscan:
   https://solscan.io/tx/{txHash}

💼 TYPE "BAG" TO VIEW YOUR REAL PORTFOLIO
   (May take a few seconds to update)
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
