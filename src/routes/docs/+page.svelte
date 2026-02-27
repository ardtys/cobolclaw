<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Command Reference - COBOLCLAW</title>
	<meta name="description" content="Every command explained. Copy, paste, trade." />
</svelte:head>

<div class="min-h-screen bg-black text-crt-green font-mono">
	<div class="scanline"></div>

	<!-- Nav -->
	<nav class="border-b border-crt-green/20 bg-black/90 backdrop-blur sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
			<button on:click={() => goto('/')} class="text-lg font-bold hover:text-crt-green/80">
				← COBOLCLAW
			</button>
			<button
				on:click={() => goto('/terminal')}
				class="px-6 py-2 bg-crt-green text-black font-bold hover:bg-crt-green/90 transition-all"
			>
				LAUNCH
			</button>
		</div>
	</nav>

	<main class="max-w-4xl mx-auto px-6 py-16">
		<!-- Header -->
		<div class="mb-16">
			<h1 class="text-4xl md:text-6xl font-bold mb-6">Command reference</h1>
			<p class="text-xl text-crt-green/70">
				Every command explained. Copy, paste, trade.
			</p>
		</div>

		<!-- Quick Reference -->
		<section class="mb-20 bg-black/50 border border-crt-green/30 p-6">
			<h2 class="text-xl font-bold mb-4">Quick reference</h2>
			<div class="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono">
				<div><code class="text-crt-amber">CONNECT</code> - Link Phantom wallet</div>
				<div><code class="text-crt-amber">SCAN</code> - Find new tokens</div>
				<div><code class="text-crt-amber">AUDIT $TOKEN</code> - Check for scams</div>
				<div><code class="text-crt-amber">CLAW $TOKEN 0.1</code> - Buy with 0.1 SOL</div>
				<div><code class="text-crt-amber">DUMP $TOKEN ALL</code> - Sell everything</div>
				<div><code class="text-crt-amber">BAG</code> - View portfolio</div>
				<div><code class="text-crt-amber">HELP</code> - Show all commands</div>
				<div><code class="text-crt-amber">CLEAR</code> - Clear terminal</div>
			</div>
		</section>

		<!-- Commands -->
		<section class="space-y-12 mb-20">
			<!-- CONNECT -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>CONNECT</code></h3>
				<p class="text-crt-green/70 mb-4">
					Links your Phantom wallet. Phantom popup appears, you click approve, done.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; CONNECT</div>
				</div>
				<div class="text-sm text-crt-green/60">
					<div class="mb-1"><strong>Need:</strong> Phantom installed and unlocked</div>
					<div><strong>Gets you:</strong> Wallet connection, balance visible</div>
				</div>
			</div>

			<!-- DISCONNECT -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>DISCONNECT</code></h3>
				<p class="text-crt-green/70 mb-4">
					Disconnects your wallet. Use this when you're done trading.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono">
					<div class="text-crt-green">&gt; DISCONNECT</div>
				</div>
			</div>

			<!-- SCAN -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>SCAN</code></h3>
				<p class="text-crt-green/70 mb-4">
					Shows new tokens from Raydium pools. Updates every 5 seconds.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; SCAN</div>
					<div class="text-crt-green">&gt; SCAN HOT</div>
					<div class="text-crt-green">&gt; SCAN WARM</div>
					<div class="text-crt-green">&gt; SCAN COOL</div>
				</div>
				<div class="text-sm text-crt-green/60 space-y-1">
					<div><strong>No filter:</strong> All tokens</div>
					<div><strong>HOT:</strong> New (&lt;5min), high volume, high risk</div>
					<div><strong>WARM:</strong> Established (&lt;10min), medium risk</div>
					<div><strong>COOL:</strong> Older, lower risk</div>
				</div>
			</div>

			<!-- AUDIT -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>AUDIT</code></h3>
				<p class="text-crt-green/70 mb-4">
					<strong class="text-crt-red">Most important command.</strong> Checks blockchain for red flags. Always run this before buying.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; AUDIT $PEPE</div>
					<div class="text-crt-green">&gt; AUDIT DezXAZ...B263</div>
				</div>
				<div class="text-sm text-crt-green/60 space-y-1 mb-3">
					<div><strong>Checks:</strong></div>
					<div>• Holder concentration (top 10 holders %)</div>
					<div>• Dev wallet holdings</div>
					<div>• Mint authority (can they print more?)</div>
					<div>• Freeze authority (can they freeze wallets?)</div>
					<div>• Deployer history (rugged before?)</div>
					<div>• Risk score 0-10</div>
				</div>
				<div class="text-sm text-crt-green/50">
					Takes ~3 seconds. Could save you from a rug pull.
				</div>
			</div>

			<!-- CLAW -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>CLAW</code></h3>
				<p class="text-crt-green/70 mb-4">
					Buy tokens. Amount is in SOL.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; CLAW $BONK 0.1</div>
					<div class="text-crt-green/70 mt-2"># Buys $BONK with 0.1 SOL</div>
				</div>
				<div class="text-sm text-crt-green/60 space-y-1 mb-3">
					<div><strong>Min:</strong> 0.001 SOL</div>
					<div><strong>Max:</strong> 0.5 SOL per trade</div>
					<div><strong>Flow:</strong> Get quote → Confirm in terminal → Approve in Phantom → Done</div>
				</div>
				<div class="text-sm text-crt-green/50">
					Jupiter finds the best route across all DEXs automatically.
				</div>
			</div>

			<!-- DUMP -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>DUMP</code></h3>
				<p class="text-crt-green/70 mb-4">
					Sell tokens. Amount can be a percentage or ALL.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; DUMP $BONK 50</div>
					<div class="text-crt-green/70"># Sells 50% of your $BONK</div>
					<div class="text-crt-green mt-2">&gt; DUMP $BONK ALL</div>
					<div class="text-crt-green/70"># Sells everything</div>
				</div>
				<div class="text-sm text-crt-green/60">
					Same flow as CLAW: quote, confirm, approve, done.
				</div>
			</div>

			<!-- BAG -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>BAG</code></h3>
				<p class="text-crt-green/70 mb-4">
					Shows your entire portfolio with current values. Real balances from blockchain.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; BAG</div>
				</div>
				<div class="text-sm text-crt-green/60">
					<div>Shows: All SPL tokens, SOL balance, current values, total portfolio worth</div>
				</div>
			</div>

			<!-- HELP -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>HELP</code></h3>
				<p class="text-crt-green/70 mb-4">
					Shows all commands with descriptions.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; HELP</div>
					<div class="text-crt-green">&gt; HELP SCAN</div>
				</div>
			</div>

			<!-- CLEAR -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>CLEAR</code></h3>
				<p class="text-crt-green/70 mb-4">
					Clears terminal output. Alias: <code>CLS</code>
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono">
					<div class="text-crt-green">&gt; CLEAR</div>
				</div>
			</div>

			<!-- SETTINGS -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>SETTINGS</code></h3>
				<p class="text-crt-green/70 mb-4">
					Change slippage, theme, auto-refresh rate.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono mb-3">
					<div class="text-crt-green">&gt; SETTINGS</div>
					<div class="text-crt-green/70"># Shows current settings</div>
					<div class="text-crt-green mt-2">&gt; SETTINGS SLIPPAGE 2.5</div>
					<div class="text-crt-green/70"># Sets slippage to 2.5%</div>
				</div>
				<div class="text-sm text-crt-green/60 space-y-1">
					<div><strong>SLIPPAGE:</strong> 0.1 - 10.0 (default: 1.0)</div>
					<div><strong>THEME:</strong> GREEN, AMBER, RED</div>
					<div><strong>REFRESH:</strong> 5-60 seconds</div>
				</div>
			</div>

			<!-- HISTORY -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<h3 class="text-2xl font-bold mb-3"><code>HISTORY</code></h3>
				<p class="text-crt-green/70 mb-4">
					Shows your command history for this session.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 text-sm font-mono">
					<div class="text-crt-green">&gt; HISTORY</div>
					<div class="text-crt-green">&gt; HISTORY 10</div>
					<div class="text-crt-green/70"># Last 10 commands</div>
				</div>
			</div>
		</section>

		<!-- Error Messages -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8">Common errors</h2>

			<div class="space-y-6">
				<div>
					<div class="font-bold text-red-400 mb-2">Wallet not connected</div>
					<p class="text-crt-green/70 text-sm">
						Run <code>CONNECT</code> first. Make sure Phantom is installed and unlocked.
					</p>
				</div>

				<div>
					<div class="font-bold text-red-400 mb-2">Insufficient balance</div>
					<p class="text-crt-green/70 text-sm">
						You need more SOL. Either for the trade itself, or for gas fees (~0.001 SOL).
					</p>
				</div>

				<div>
					<div class="font-bold text-red-400 mb-2">Slippage tolerance exceeded</div>
					<p class="text-crt-green/70 text-sm">
						Price moved too much while your trade was processing. Try again with higher slippage: <code>SETTINGS SLIPPAGE 3</code>
					</p>
				</div>

				<div>
					<div class="font-bold text-red-400 mb-2">Transaction timeout</div>
					<p class="text-crt-green/70 text-sm">
						Network was congested. Your trade didn't execute. Try again.
					</p>
				</div>

				<div>
					<div class="font-bold text-red-400 mb-2">Token not found</div>
					<p class="text-crt-green/70 text-sm">
						Check the symbol. Or use the full contract address instead.
					</p>
				</div>

				<div>
					<div class="font-bold text-red-400 mb-2">RPC error</div>
					<p class="text-crt-green/70 text-sm">
						Helius RPC is down. COBOLCLAW falls back to cached data. You'll see a warning in the header.
					</p>
				</div>
			</div>
		</section>

		<!-- Tips -->
		<section class="border-t border-crt-green/20 pt-12 mb-20">
			<h2 class="text-2xl font-bold mb-8">Command tips</h2>

			<div class="space-y-4 text-crt-green/70 text-sm">
				<p>
					<strong class="text-crt-green">Commands are case-insensitive.</strong> <code>SCAN</code>, <code>scan</code>, and <code>Scan</code> all work.
				</p>
				<p>
					<strong class="text-crt-green">Token symbols need the $.</strong> <code>AUDIT $BONK</code>, not <code>AUDIT BONK</code>.
				</p>
				<p>
					<strong class="text-crt-green">Use arrow keys.</strong> Up/down arrows cycle through command history. Faster than retyping.
				</p>
				<p>
					<strong class="text-crt-green">Check HELP.</strong> Forget syntax? Type <code>HELP COMMANDNAME</code>.
				</p>
				<p>
					<strong class="text-crt-green">Commands execute fast.</strong> Most are instant. AUDIT takes ~3 seconds. Trades depend on network.
				</p>
			</div>
		</section>

		<!-- CTA -->
		<div class="border-t-2 border-crt-green/20 pt-12 text-center">
			<h2 class="text-3xl font-bold mb-6">Ready to try them?</h2>
			<button
				on:click={() => goto('/terminal')}
				class="px-10 py-4 bg-crt-green text-black text-xl font-bold hover:bg-crt-green/90 transition-all hover:shadow-[0_0_30px_rgba(51,255,51,0.7)]"
			>
				Launch Terminal →
			</button>
			<p class="mt-4 text-sm text-crt-green/50">
				Still have questions? Check the <a href="/faq" class="underline hover:text-crt-green">FAQ</a>
			</p>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-crt-green/20 py-8 px-6 mt-20">
		<div class="max-w-4xl mx-auto text-center text-xs text-crt-green/40">
			<p>Commands are tools. What you do with them is up to you.</p>
		</div>
	</footer>
</div>

<style>
	.scanline {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(to bottom, transparent, rgba(51, 255, 51, 0.3), transparent);
		animation: scanline 8s linear infinite;
		pointer-events: none;
		z-index: 9999;
	}

	@keyframes scanline {
		from { transform: translateY(0); }
		to { transform: translateY(100vh); }
	}

	code {
		padding: 2px 6px;
		background: rgba(51, 255, 51, 0.1);
		border: 1px solid rgba(51, 255, 51, 0.2);
		border-radius: 2px;
		font-size: 0.9em;
	}
</style>
