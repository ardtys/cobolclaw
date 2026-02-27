<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>What Can COBOLCLAW Do?</title>
	<meta name="description" content="Everything COBOLCLAW can do, explained without the marketing fluff." />
</svelte:head>

<div class="min-h-screen bg-black text-crt-green font-mono">
	<div class="scanline"></div>

	<!-- Simple Nav -->
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

	<main class="max-w-5xl mx-auto px-6 py-16">
		<!-- Header -->
		<div class="mb-16">
			<h1 class="text-4xl md:text-6xl font-bold mb-6">What can it do?</h1>
			<p class="text-xl text-crt-green/70 leading-relaxed">
				Everything you need to trade memecoins. Nothing you don't.
			</p>
		</div>

		<!-- Core Features -->
		<section class="mb-20">
			<h2 class="text-2xl font-bold mb-8 text-crt-green/80">The Basics</h2>

			<div class="space-y-12">
				<!-- SCAN -->
				<div class="border-l-4 border-crt-green/40 pl-8">
					<div class="flex items-baseline gap-4 mb-4">
						<code class="text-2xl font-bold text-crt-amber">SCAN</code>
						<span class="text-crt-green/60">Find new tokens</span>
					</div>
					<p class="text-crt-green/80 mb-4 leading-relaxed">
						Shows you fresh tokens from Raydium pools. Real blockchain data - price, volume, market cap, how many people are holding, how old it is.
						Updates every 5 seconds so you don't miss the pump.
					</p>
					<div class="bg-black/50 border border-crt-green/30 p-4 text-sm">
						<div class="text-crt-green/60 mb-2">Try:</div>
						<div><code>SCAN</code> - All tokens</div>
						<div><code>SCAN HOT</code> - Only new tokens with high volume</div>
						<div><code>SCAN COOL</code> - Older, more stable tokens</div>
					</div>
				</div>

				<!-- AUDIT -->
				<div class="border-l-4 border-crt-green/40 pl-8">
					<div class="flex items-baseline gap-4 mb-4">
						<code class="text-2xl font-bold text-crt-amber">AUDIT</code>
						<span class="text-crt-green/60">Check if it's a scam</span>
					</div>
					<p class="text-crt-green/80 mb-4 leading-relaxed">
						The most important command. Analyzes the token on-chain to find red flags. Checks who owns what, if the creator can mint more tokens,
						if they've rugged before. Gives you a risk score. Not perfect, but way better than guessing.
					</p>
					<div class="bg-black/50 border border-crt-green/30 p-4 text-sm space-y-2">
						<div class="text-crt-green/60">What it checks:</div>
						<div>• Top 10 holders own 80%? Red flag.</div>
						<div>• Dev wallet has 10%? Red flag.</div>
						<div>• Mint authority still active? Red flag.</div>
						<div>• Deployer rugged 5 tokens before? HUGE red flag.</div>
						<div>• Only 50 holders on a "hot" token? Probably fake volume.</div>
					</div>
				</div>

				<!-- CLAW -->
				<div class="border-l-4 border-crt-green/40 pl-8">
					<div class="flex items-baseline gap-4 mb-4">
						<code class="text-2xl font-bold text-crt-amber">CLAW</code>
						<span class="text-crt-green/60">Buy tokens</span>
					</div>
					<p class="text-crt-green/80 mb-4 leading-relaxed">
						Execute a buy through Jupiter. Type the token symbol and how much SOL you want to spend.
						Get a quote, confirm in terminal, approve in Phantom. That's it. Max 0.5 SOL per trade so you can't accidentally nuke your portfolio.
					</p>
					<div class="bg-black/50 border border-crt-green/30 p-4 text-sm">
						<div class="text-crt-green/60 mb-2">Example:</div>
						<div><code>CLAW $BONK 0.1</code> - Buy $BONK with 0.1 SOL</div>
						<div class="text-crt-green/50 mt-2 text-xs">
							Jupiter finds the best route across all DEXs. You get the best price automatically.
						</div>
					</div>
				</div>

				<!-- DUMP -->
				<div class="border-l-4 border-crt-green/40 pl-8">
					<div class="flex items-baseline gap-4 mb-4">
						<code class="text-2xl font-bold text-crt-amber">DUMP</code>
						<span class="text-crt-green/60">Sell tokens</span>
					</div>
					<p class="text-crt-green/80 mb-4 leading-relaxed">
						Sell your tokens. Specify how much (percentage or "ALL"). Same flow - confirm, approve, done.
						When you see the rug pull coming, type <code>DUMP $TOKEN ALL</code> and get out fast.
					</p>
					<div class="bg-black/50 border border-crt-green/30 p-4 text-sm">
						<div class="text-crt-green/60 mb-2">Example:</div>
						<div><code>DUMP $BONK 50</code> - Sell half your $BONK</div>
						<div><code>DUMP $BONK ALL</code> - Sell everything</div>
					</div>
				</div>

				<!-- BAG -->
				<div class="border-l-4 border-crt-green/40 pl-8">
					<div class="flex items-baseline gap-4 mb-4">
						<code class="text-2xl font-bold text-crt-amber">BAG</code>
						<span class="text-crt-green/60">Check your holdings</span>
					</div>
					<p class="text-crt-green/80 mb-4 leading-relaxed">
						Shows your entire portfolio - all tokens, their current value, your SOL balance, total worth.
						Fetches real balances from the blockchain, not fake cached data.
					</p>
				</div>

				<!-- CONNECT/DISCONNECT -->
				<div class="border-l-4 border-crt-green/40 pl-8">
					<div class="flex items-baseline gap-4 mb-4">
						<code class="text-2xl font-bold text-crt-amber">CONNECT</code>
						<span class="text-crt-green/60">Link your Phantom wallet</span>
					</div>
					<p class="text-crt-green/80 mb-4 leading-relaxed">
						Connects to Phantom wallet. You need this before you can trade. <code>DISCONNECT</code> when you're done.
						Your keys stay in Phantom - COBOLCLAW never sees them.
					</p>
				</div>
			</div>
		</section>

		<!-- Under the Hood -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8 text-crt-green/80">How It Actually Works</h2>

			<div class="space-y-8">
				<div>
					<h3 class="text-xl font-bold mb-3">Token Data: Raydium</h3>
					<p class="text-crt-green/70 leading-relaxed">
						COBOLCLAW scans Raydium AMM pools for new tokens. Not some third-party API that might lie to you -
						direct from the blockchain. If a token has a Raydium pool, you'll see it.
					</p>
				</div>

				<div>
					<h3 class="text-xl font-bold mb-3">Swap Execution: Jupiter Aggregator</h3>
					<p class="text-crt-green/70 leading-relaxed">
						When you trade, Jupiter checks every DEX on Solana (Raydium, Orca, Meteora, etc) and finds the best route.
						Sometimes it splits your trade across multiple pools. You get the best price without thinking about it.
					</p>
				</div>

				<div>
					<h3 class="text-xl font-bold mb-3">Blockchain Access: Helius RPC</h3>
					<p class="text-crt-green/70 leading-relaxed">
						Fast RPC node so you don't wait 10 seconds for a response. If Helius is down, COBOLCLAW falls back to cached data
						and shows you a warning. No silent failures.
					</p>
				</div>

				<div>
					<h3 class="text-xl font-bold mb-3">Wallet: Phantom</h3>
					<p class="text-crt-green/70 leading-relaxed">
						You need Phantom installed. Every transaction needs your approval in Phantom. COBOLCLAW can't access your wallet
						without permission. Can't move your funds. Can't see your seed phrase. Non-custodial, period.
					</p>
				</div>
			</div>
		</section>

		<!-- Safety Features -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8 text-crt-green/80">Built-In Protection</h2>

			<div class="grid md:grid-cols-2 gap-8">
				<div class="border border-crt-green/30 p-6">
					<h3 class="text-lg font-bold mb-3">Trade Limits</h3>
					<div class="space-y-2 text-sm text-crt-green/70">
						<div>Max: 0.5 SOL per trade</div>
						<div>Min: 0.001 SOL per trade</div>
						<div>Max slippage: 10%</div>
						<div class="pt-2 text-xs text-crt-green/50">
							Stops you from accidentally buying $10,000 of a scam token.
						</div>
					</div>
				</div>

				<div class="border border-crt-green/30 p-6">
					<h3 class="text-lg font-bold mb-3">Double Confirmation</h3>
					<div class="text-sm text-crt-green/70">
						<div class="mb-2">Every trade needs approval twice:</div>
						<div>1. Confirm in terminal (Y/N)</div>
						<div>2. Approve in Phantom wallet</div>
						<div class="pt-2 text-xs text-crt-green/50">
							Can't fat-finger a trade by accident.
						</div>
					</div>
				</div>

				<div class="border border-crt-green/30 p-6">
					<h3 class="text-lg font-bold mb-3">Price Impact Warnings</h3>
					<div class="text-sm text-crt-green/70">
						If your trade will move the price more than 5%, you'll see a big warning.
						Small liquidity pools can slip 20-30% on a 0.1 SOL buy. We tell you before you confirm.
					</div>
				</div>

				<div class="border border-crt-green/30 p-6">
					<h3 class="text-lg font-bold mb-3">Risk Scores</h3>
					<div class="text-sm text-crt-green/70">
						AUDIT calculates a 0-10 risk score. 0-3 is low risk. 4-6 is medium. 7-10 means high chance of rug.
						Not financial advice, but better than nothing.
					</div>
				</div>
			</div>
		</section>

		<!-- What It Can't Do -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8 text-red-400">What It Can't Do</h2>

			<div class="space-y-4 text-crt-green/70 leading-relaxed">
				<p>
					<strong class="text-crt-green">Can't predict the future.</strong> AUDIT shows you data, not destiny.
					A token with a clean audit can still rug. A token with red flags might moon. We show you the data. You decide.
				</p>
				<p>
					<strong class="text-crt-green">Can't guarantee profits.</strong> Most memecoins go to zero.
					Some are scams. Some just fail. COBOLCLAW gives you tools, not magic.
				</p>
				<p>
					<strong class="text-crt-green">Can't execute trades without you.</strong> No bots. No auto-trading.
					No "set it and forget it." Every trade needs your manual approval. This is a tool, not a money printer.
				</p>
				<p>
					<strong class="text-crt-green">Can't protect you from yourself.</strong> If you ignore all the red flags
					and YOLO your entire portfolio into $SCAMCOIN, that's on you. We'll warn you. We can't stop you.
				</p>
			</div>
		</section>

		<!-- Other Stuff -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8 text-crt-green/80">Other Stuff</h2>

			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-bold mb-2"><code>HELP</code></h3>
					<p class="text-crt-green/70">Shows all commands. Useful when you forget syntax.</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2"><code>CLEAR</code></h3>
					<p class="text-crt-green/70">Clears the terminal. Clean slate.</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2"><code>SETTINGS</code></h3>
					<p class="text-crt-green/70">
						Change slippage tolerance, theme color, auto-refresh rate. <code>SETTINGS SLIPPAGE 2.5</code> sets slippage to 2.5%.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2"><code>HISTORY</code></h3>
					<p class="text-crt-green/70">Shows your command history for the session.</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<div class="border-t-2 border-crt-green/20 pt-12 text-center">
			<h2 class="text-3xl font-bold mb-6">Want to see it in action?</h2>
			<button
				on:click={() => goto('/terminal')}
				class="px-10 py-4 bg-crt-green text-black text-xl font-bold hover:bg-crt-green/90 transition-all hover:shadow-[0_0_30px_rgba(51,255,51,0.7)]"
			>
				Launch Terminal →
			</button>
			<p class="mt-4 text-sm text-crt-green/50">
				Or <a href="/how-it-works" class="underline hover:text-crt-green">read the step-by-step guide</a>
			</p>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-crt-green/20 py-8 px-6 mt-20">
		<div class="max-w-5xl mx-auto text-center text-xs text-crt-green/40">
			<p>Not financial advice. These are just tools. What you do with them is up to you.</p>
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
	}
</style>
