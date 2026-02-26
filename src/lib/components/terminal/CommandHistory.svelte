<script lang="ts">
	import type { CommandOutput } from '$lib/types/command';
	import { fade } from 'svelte/transition';
	import ScanFeed from '$lib/components/features/ScanFeed.svelte';
	import PortfolioTable from '$lib/components/features/PortfolioTable.svelte';
	import AuditReport from '$lib/components/features/AuditReport.svelte';
	import TxConfirmation from '$lib/components/features/TxConfirmation.svelte';
	import { wallet } from '$lib/stores/wallet';
	import { terminal } from '$lib/stores/terminal';
	import { createEventDispatcher } from 'svelte';

	export let outputs: CommandOutput[] = [];

	const dispatch = createEventDispatcher<{
		command: string;
	}>();

	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function handleAudit(event: CustomEvent<string>) {
		// Trigger AUDIT command for the selected token
		const address = event.detail;
		dispatch('command', `AUDIT ${address}`);
	}

	function handleTxConfirm(outputId: string, txData: any) {
		return function (txHash: string) {
			// Update wallet based on transaction
			if (txData.action === 'BUY') {
				// Add token to wallet
				const entryPrice = txData.token.price;
				const amount = txData.amountSol / entryPrice;
				wallet.addHolding(txData.token, amount, entryPrice);

				// Deduct SOL from balance
				wallet.updateBalance($wallet.balance - txData.amountSol - 0.000005); // minus gas
			} else {
				// Remove or reduce token from wallet
				const amount = txData.amountSol;
				const holding = $wallet.holdings.find(h => h.token.address === txData.token.address);

				if (holding && amount >= holding.amount) {
					wallet.removeHolding(txData.token.address);
				} else if (holding) {
					wallet.updateHolding(txData.token.address, holding.amount - amount);
				}

				// Add SOL to balance
				wallet.updateBalance($wallet.balance + (amount * txData.token.price) - 0.000005); // minus gas
			}
		};
	}

	function handleTxCancel() {
		// Just let the output stay there, user can clear it
	}
</script>

<div class="command-history space-y-4">
	{#each outputs as output (output.id)}
		<div class="output-block" transition:fade={{ duration: 200 }}>
			<!-- Command echo -->
			<div class="command-echo text-crt-green-dim mb-2">
				<span class="timestamp text-xs">[{formatTimestamp(output.timestamp)}]</span>
				<span class="font-bold">COBOLCLAW&gt;</span>
				<span class="ml-1">{output.command}</span>
			</div>

			<!-- Output separator -->
			<div class="separator text-crt-green-dim mb-2">
				--- OUTPUT ---
			</div>

			<!-- Output content -->
			<div class="output-content" class:error={output.type === 'error'}>
				{#if output.type === 'text'}
					<pre class="font-mono text-terminal whitespace-pre-wrap">{output.output}</pre>
				{:else if output.type === 'component' && typeof output.output !== 'string'}
					<!-- Component outputs -->
					{#if output.output.type === 'scan'}
						<ScanFeed on:audit={handleAudit} />
					{:else if output.output.type === 'bag'}
						<PortfolioTable on:audit={handleAudit} />
					{:else if output.output.type === 'audit'}
						<AuditReport audit={output.output.data.audit} />
					{:else if output.output.type === 'tx-confirm'}
						<TxConfirmation
							action={output.output.data.action}
							token={output.output.data.token}
							amountSol={output.output.data.amountSol}
							onConfirm={handleTxConfirm(output.id, output.output.data)}
							onCancel={handleTxCancel}
						/>
					{:else}
						<div class="text-crt-amber">
							[COMPONENT OUTPUT TYPE: {output.output.type}]
						</div>
					{/if}
				{:else if output.type === 'error'}
					<pre class="font-mono text-terminal text-red">{output.output}</pre>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.command-history {
		font-family: 'IBM Plex Mono', monospace;
	}

	.output-block {
		border-left: 2px solid var(--crt-green-dim);
		padding-left: 1rem;
	}

	.separator {
		font-size: 10px;
		letter-spacing: 0.1em;
	}

	.output-content.error {
		background-color: rgba(255, 51, 51, 0.1);
		border: 1px solid var(--crt-red);
		padding: 1rem;
		margin-top: 0.5rem;
	}

	pre {
		margin: 0;
		line-height: 1.5;
		word-wrap: break-word;
		white-space: pre-wrap;
	}
</style>
