<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { wallet, isConnected } from '$lib/stores/wallet';
	import { goto } from '$app/navigation';
	import { rpcErrorHandler } from '$lib/services/rpcErrorHandler';

	// Mock live data
	let blockNumber = 285472341;
	let coinPrice = 142.5;
	let gasPrice = 0.00001;

	let updateInterval: NodeJS.Timeout;

	onMount(() => {
		// Update live data every 5 seconds (block number) and 30 seconds (COIN price)
		let counter = 0;
		updateInterval = setInterval(() => {
			blockNumber += Math.floor(Math.random() * 3) + 1;
			counter++;

			if (counter % 6 === 0) {
				// Update COIN price every 30 seconds
				coinPrice += (Math.random() - 0.5) * 2; // Random fluctuation
				coinPrice = Math.max(100, Math.min(200, coinPrice)); // Keep in range
			}

			// Occasionally update gas price
			if (counter % 3 === 0) {
				gasPrice = 0.00001 + Math.random() * 0.00002;
			}
		}, 5000);
	});

	onDestroy(() => {
		if (updateInterval) clearInterval(updateInterval);
	});

	function truncateAddress(address: string): string {
		if (!address || address.length < 8) return address;
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}

	function handleWalletClick() {
		if ($isConnected) {
			// Disconnect wallet
			const confirmDisconnect = confirm('DISCONNECT WALLET?');
			if (confirmDisconnect) {
				wallet.disconnect();
			}
		}
	}
</script>

<header class="header-bar fixed top-0 left-0 right-0 z-50 bg-bg-dark border-b border-crt-green-dim">
	<div class="flex items-center justify-between h-8 px-4 text-terminal text-crt-green">
		<!-- Left: Logo & Version -->
		<div class="flex items-center gap-2">
			<img src="/logo.png" alt="COBOLCLAW Logo" class="h-6 w-6 logo-glow" />
			<span class="font-display font-bold">COBOLCLAW v1.0</span>
		</div>

		<!-- Center: Live Data -->
		<div class="hidden md:flex items-center gap-4 text-xs">
			<!-- RPC Status -->
			{#if rpcErrorHandler.getStatus().isUsingFallback}
				<span class="text-amber flex items-center gap-1">
					<span>⚠</span>
					<span>RPC OFFLINE</span>
				</span>
			{:else}
				<span class="text-crt-green flex items-center gap-1">
					<span>✓</span>
					<span>RPC OK</span>
				</span>
			{/if}
			<span class="separator">|</span>
			<span class="live-data">
				BLOCK #{blockNumber.toLocaleString()}
			</span>
			<span class="separator">|</span>
			<span class="live-data">
				COIN ${coinPrice.toFixed(2)}
			</span>
			<span class="separator">|</span>
			<span class="live-data">
				GAS: {gasPrice.toFixed(5)} COIN
			</span>
		</div>

		<!-- Right: Wallet Status -->
		<div class="wallet-status">
			{#if $isConnected}
				<button
					type="button"
					on:click={handleWalletClick}
					class="text-crt-green hover:text-crt-cyan transition-colors terminal-clickable"
				>
					[WALLET: {truncateAddress($wallet.address || '')}]
				</button>
			{:else}
				<span class="text-amber">
					[WALLET: DISCONNECTED]
				</span>
			{/if}
		</div>
	</div>
</header>

<!-- Spacer to prevent content from being hidden under fixed header -->
<div class="h-8"></div>

<style>
	.header-bar {
		font-family: 'IBM Plex Mono', monospace;
		text-shadow: 0 0 8px var(--crt-green-glow);
		backdrop-filter: blur(10px);
	}

	.live-data {
		font-weight: 500;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	.separator {
		color: var(--crt-green-dim);
	}

	.wallet-status button {
		font-size: 11px;
		text-transform: uppercase;
	}

	.text-amber {
		color: var(--crt-amber);
		text-shadow: 0 0 8px rgba(255, 176, 0, 0.4);
	}

	.logo-glow {
		filter: drop-shadow(0 0 8px var(--crt-green-glow));
		animation: logo-pulse 3s ease-in-out infinite;
	}

	@keyframes logo-pulse {
		0%,
		100% {
			filter: drop-shadow(0 0 8px var(--crt-green-glow));
		}
		50% {
			filter: drop-shadow(0 0 12px var(--crt-green-glow));
		}
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.header-bar {
			font-size: 10px;
		}

		.wallet-status {
			font-size: 9px;
		}
	}
</style>
