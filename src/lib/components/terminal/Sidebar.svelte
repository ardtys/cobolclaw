<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { wallet, totalPortfolioValue, totalPnL, diamondHandsScore } from '$lib/stores/wallet';
	import { tokenCount } from '$lib/stores/tokens';
	import { activeAlertCount } from '$lib/stores/alerts';

	export let visible: boolean = true;
	export let activeItem: string = '';

	const dispatch = createEventDispatcher<{
		navigate: string;
		command: string;
	}>();

	interface MenuItem {
		id: string;
		label: string;
		command: string;
		number: number;
	}

	const menuItems: MenuItem[] = [
		{ id: 'scan', label: 'SCAN', command: 'SCAN', number: 1 },
		{ id: 'bag', label: 'BAG', command: 'BAG', number: 2 },
		{ id: 'audit', label: 'AUDIT', command: 'AUDIT', number: 3 },
		{ id: 'alerts', label: 'ALERTS', command: 'ALERTS', number: 4 },
		{ id: 'settings', label: 'SETTINGS', command: 'SETTINGS', number: 5 },
		{ id: 'docs', label: 'DOCS', command: 'DOCS', number: 6 },
		{ id: 'help', label: 'HELP', command: 'HELP', number: 7 }
	];

	function handleItemClick(item: MenuItem) {
		dispatch('command', item.command);
	}

	function formatPnL(pnl: number): string {
		const sign = pnl >= 0 ? '+' : '';
		return `${sign}$${pnl.toFixed(2)}`;
	}

	function formatPercentage(percentage: number): string {
		const sign = percentage >= 0 ? '+' : '';
		return `${sign}${percentage.toFixed(1)}%`;
	}
</script>

<aside
	class="sidebar border-r border-crt-green-dim bg-bg-dark transition-transform duration-300"
	class:visible
	class:hidden={!visible}
>
	<!-- Main Menu -->
	<div class="menu-section p-4">
		<div class="menu-header text-crt-green text-center border-b border-t border-crt-green-dim py-2 mb-4">
			═══════════════════
			<div class="font-bold my-1">MAIN MENU</div>
			═══════════════════
		</div>

		<nav class="space-y-1">
			{#each menuItems as item}
				<button
					type="button"
					class="menu-item w-full text-left py-2 px-3 transition-colors"
					class:active={activeItem === item.id}
					on:click={() => handleItemClick(item)}
				>
					<span class="mr-2 text-crt-green-dim">[{item.number}]</span>
					{#if activeItem === item.id}
						<span class="mr-1">&gt;</span>
					{/if}
					{item.label}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Quick Stats -->
	<div class="stats-section p-4 border-t border-crt-green-dim">
		<div class="stats-header text-crt-green-dim text-xs mb-3">
			═══════════════════
			<div class="text-center my-1">QUICK STATS</div>
			═══════════════════
		</div>

		{#if $wallet.connected}
			<div class="stats-content space-y-2 text-xs">
				<div class="stat-line">
					<span class="text-crt-green-dim">COIN:</span>
					<span class="text-crt-green font-bold ml-1">{$wallet.balance.toFixed(2)}</span>
				</div>
				<div class="stat-line">
					<span class="text-crt-green-dim">TOKENS:</span>
					<span class="text-crt-green font-bold ml-1">{$wallet.holdings.length}</span>
				</div>
				<div class="stat-line">
					<span class="text-crt-green-dim">VALUE:</span>
					<span class="text-crt-green font-bold ml-1">${$totalPortfolioValue.toFixed(2)}</span>
				</div>
				<div class="stat-line">
					<span class="text-crt-green-dim">24H PNL:</span>
					<span
						class="font-bold ml-1"
						class:text-crt-green={$totalPnL >= 0}
						class:text-red={$totalPnL < 0}
					>
						{formatPnL($totalPnL)}
					</span>
				</div>
				<div class="stat-line">
					<span class="text-crt-green-dim">💎 HANDS:</span>
					<span class="text-crt-green font-bold ml-1">{$diamondHandsScore.toFixed(0)}%</span>
				</div>
			</div>
		{:else}
			<div class="text-crt-green-dim text-xs text-center">
				NO WALLET CONNECTED
			</div>
		{/if}
	</div>

	<!-- System Info -->
	<div class="system-info p-4 border-t border-crt-green-dim text-xs text-crt-green-dim">
		<div class="space-y-1">
			<div>FEED: {$tokenCount} TOKENS</div>
			<div>ALERTS: {$activeAlertCount} ACTIVE</div>
		</div>
	</div>
</aside>

<style>
	.sidebar {
		width: 200px;
		min-height: calc(100vh - 2rem);
		font-family: 'IBM Plex Mono', monospace;
		position: relative;
	}

	.menu-header {
		font-size: 11px;
		font-family: 'Share Tech Mono', monospace;
	}

	.menu-item {
		font-size: 12px;
		color: var(--crt-green);
		text-shadow: 0 0 6px var(--crt-green-glow);
	}

	.menu-item:hover {
		background-color: rgba(51, 255, 51, 0.1);
		text-shadow: 0 0 12px var(--crt-green-glow);
	}

	.menu-item.active {
		background-color: rgba(51, 255, 51, 0.2);
		color: var(--crt-green);
		font-weight: bold;
	}

	.stat-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* Mobile: Sidebar slides in from left */
	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			left: 0;
			top: 2rem;
			bottom: 0;
			z-index: 40;
			transform: translateX(-100%);
			box-shadow: 2px 0 20px var(--crt-green-glow);
		}

		.sidebar.visible {
			transform: translateX(0);
		}
	}

	/* Desktop: Always visible */
	@media (min-width: 769px) {
		.sidebar {
			transform: none !important;
		}
	}
</style>
