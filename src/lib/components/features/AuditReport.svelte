<script lang="ts">
	import type { AuditReport } from '$lib/types/audit';
	import { getRiskDisplay, getRiskClass, getRiskLevel } from '$lib/types/audit';
	import { formatAddress, formatCobolDateTime, createProgressBar } from '$lib/utils/formatters';
	import { formatAge } from '$lib/types/token';
	import { getRiskVerdict } from '$lib/utils/risk-calculator';

	export let audit: AuditReport;

	$: bondcurveBar = createProgressBar(audit.token.bondcurveProgress, 16);
	$: riskBar = getRiskDisplay(audit.riskScore);
	$: riskLevel = getRiskLevel(audit.riskScore);
	$: riskClass = getRiskClass(audit.riskScore);
</script>

<div class="audit-report font-mono">
	<!-- Header -->
	<div class="audit-header text-crt-green mb-2">
		<pre class="text-xs">
════════════════════════════════════════════════════════════════
 COBOLCLAW AUDIT DIVISION
 SUBJECT: {audit.token.ticker} ({audit.token.name})
 CONTRACT: {formatAddress(audit.token.address, 6, 6)}
 AUDIT DATE: {formatCobolDateTime(audit.generatedAt)}
════════════════════════════════════════════════════════════════
		</pre>
	</div>

	<!-- Section A: Overview -->
	<div class="audit-section mb-4">
		<div class="section-header text-crt-green mb-2 font-bold">SECTION A: OVERVIEW</div>
		<div class="text-xs space-y-1">
			<div class="flex">
				<span class="text-crt-green-dim w-32">DEPLOYER:</span>
				<span class="text-crt-green">{formatAddress(audit.token.deployer, 4, 4)}</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">DEPLOY TIME:</span>
				<span class="text-crt-green">
					{formatCobolDateTime(audit.token.deployTime)} ({formatAge(audit.token.age)} AGO)
				</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">SUPPLY:</span>
				<span class="text-crt-green">{audit.token.supply.toLocaleString()}</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">MCAP:</span>
				<span class="text-crt-green">${audit.token.mcap.toLocaleString()}</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">LIQUIDITY:</span>
				<span class="text-crt-green">${audit.token.liquidity.toFixed(2)} (BONDING CURVE)</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">BONDCURVE PROG:</span>
				<span class="text-crt-green">{bondcurveBar} {audit.token.bondcurveProgress.toFixed(0)}%</span>
			</div>
		</div>
	</div>

	<!-- Section B: Holder Analysis -->
	<div class="audit-section mb-4">
		<div class="section-header text-crt-green mb-2 font-bold">SECTION B: HOLDER ANALYSIS</div>
		<div class="text-xs space-y-1">
			<div class="flex">
				<span class="text-crt-green-dim w-32">TOTAL HOLDERS:</span>
				<span class="text-crt-green">{audit.holderAnalysis.totalHolders}</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">TOP 10 HOLD:</span>
				<span class:text-amber={audit.holderAnalysis.top10Percentage > 60} class:text-red={audit.holderAnalysis.top10Percentage > 80}>
					{audit.holderAnalysis.top10Percentage.toFixed(1)}%
					{#if audit.holderAnalysis.top10Percentage > 60}⚠ CONCENTRATED{/if}
				</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">DEV WALLET:</span>
				<span class:text-amber={audit.holderAnalysis.devWalletPercentage > 10} class:text-red={audit.holderAnalysis.devWalletPercentage > 20}>
					{audit.holderAnalysis.devWalletPercentage.toFixed(1)}%
					{#if audit.holderAnalysis.devWalletPercentage > 10}⚠ HIGH DEV HOLD{/if}
				</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">SNIPER WALLETS:</span>
				<span class="text-crt-green">{audit.holderAnalysis.sniperCount} DETECTED</span>
			</div>
		</div>

		<!-- Top Holders -->
		<div class="mt-3">
			<div class="text-crt-green-dim text-xs mb-1">TOP HOLDERS:</div>
			<div class="space-y-1 text-xs">
				{#each audit.holderAnalysis.topHolders.slice(0, 3) as holder, i}
					<div class="flex">
						<span class="text-crt-green-dim w-8">#{i + 1}</span>
						<span class="text-crt-green mr-2">{formatAddress(holder.address, 4, 4)}</span>
						<span class="text-crt-green">{holder.percentage.toFixed(1)}%</span>
						{#if holder.isDeployer}
							<span class="text-amber ml-2">[DEPLOYER]</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Section C: Risk Assessment -->
	<div class="audit-section mb-4">
		<div class="section-header text-crt-green mb-2 font-bold">SECTION C: RISK ASSESSMENT</div>
		<div class="text-xs space-y-2">
			<div class="flex">
				<span class="text-crt-green-dim w-32">OVERALL RISK:</span>
				<span class="{riskClass}">{riskBar} {audit.riskScore}/10 — {riskLevel}</span>
			</div>

			<!-- Risk Factors -->
			<div class="mt-2 space-y-1">
				{#each audit.riskFactors as factor}
					<div class="flex items-start">
						{#if factor.type === 'success'}
							<span class="text-crt-green mr-2">[✓]</span>
						{:else if factor.type === 'warning'}
							<span class="text-amber mr-2">[⚠]</span>
						{:else}
							<span class="text-red mr-2">[✗]</span>
						{/if}
						<span class:text-crt-green={factor.type === 'success'} class:text-amber={factor.type === 'warning'} class:text-red={factor.type === 'critical'}>
							{factor.message}
						</span>
					</div>
				{/each}
			</div>

			<!-- Verdict -->
			<div class="mt-3 p-2 border border-crt-green-dim">
				<div class="text-crt-green-dim text-xs">VERDICT:</div>
				<div class="{riskClass} font-bold">{getRiskVerdict(audit.riskScore)}</div>
			</div>
		</div>
	</div>

	<!-- Section D: Deployer History -->
	<div class="audit-section mb-4">
		<div class="section-header text-crt-green mb-2 font-bold">SECTION D: DEPLOYER HISTORY</div>
		<div class="text-xs space-y-1">
			<div class="flex">
				<span class="text-crt-green-dim w-32">TOKENS DEPLOYED:</span>
				<span class="text-crt-green">{audit.deployerHistory.tokensDeployed}</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">RUGGED:</span>
				<span class:text-amber={audit.deployerHistory.rugRate > 50} class:text-red={audit.deployerHistory.rugRate > 80}>
					{audit.deployerHistory.ruggedCount} ({audit.deployerHistory.rugRate.toFixed(1)}%)
				</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">AVG TOKEN LIFE:</span>
				<span class="text-crt-green">{audit.deployerHistory.avgTokenLife} MINUTES</span>
			</div>
			<div class="flex">
				<span class="text-crt-green-dim w-32">VERDICT:</span>
				<span class:text-crt-green={audit.deployerHistory.rugRate < 20} class:text-amber={audit.deployerHistory.rugRate >= 20 && audit.deployerHistory.rugRate < 60} class:text-red={audit.deployerHistory.rugRate >= 60}>
					{audit.deployerHistory.verdict}
				</span>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div class="audit-footer text-crt-green-dim border-t border-crt-green-dim pt-2">
		<pre class="text-xs">
════════════════════════════════════════════════════════════════
 PROCEED? TYPE "CLAW {audit.token.ticker} [AMOUNT]" TO BUY
 OR TYPE "SCAN" TO RETURN TO FEED
════════════════════════════════════════════════════════════════
		</pre>
	</div>
</div>

<style>
	.audit-report {
		font-family: 'IBM Plex Mono', monospace;
	}

	.section-header {
		letter-spacing: 0.1em;
	}

	pre {
		margin: 0;
		line-height: 1.4;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.audit-report {
			font-size: 10px;
		}
	}
</style>
