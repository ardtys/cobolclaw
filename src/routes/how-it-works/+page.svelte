<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>How to Use COBOLCLAW</title>
	<meta name="description" content="Step-by-step guide to trading memecoins through a terminal. Simpler than it looks." />
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
			<h1 class="text-4xl md:text-6xl font-bold mb-6">How to use it</h1>
			<p class="text-xl text-crt-green/70">
				Simpler than it looks. Here's the complete walkthrough.
			</p>
		</div>

		<!-- The Actual Steps -->
		<section class="space-y-16 mb-20">
			<!-- Step 1 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">1.</div>
				<h2 class="text-2xl font-bold mb-4">Get Phantom wallet</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					You need Phantom to interact with the blockchain. It's a browser extension - like MetaMask but for Solana.
				</p>
				<div class="bg-black/50 border border-crt-green/30 p-4 text-sm space-y-2 mb-4">
					<div>1. Go to <a href="https://phantom.app" target="_blank" class="text-crt-amber underline hover:text-crt-green">phantom.app</a></div>
					<div>2. Click "Download" and add to Chrome/Brave/Firefox</div>
					<div>3. Create a new wallet (or import if you have one)</div>
					<div>4. Write down your seed phrase somewhere safe</div>
				</div>
				<p class="text-sm text-crt-green/50">
					<strong class="text-crt-red">Important:</strong> Your seed phrase is the master key. If you lose it, your funds are gone forever.
					If someone gets it, they can steal everything. Don't screenshot it. Don't email it. Write it on paper.
				</p>
			</div>

			<!-- Step 2 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">2.</div>
				<h2 class="text-2xl font-bold mb-4">Get some SOL</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					You need SOL to trade. It's Solana's native currency. You'll use it to buy tokens and pay for transaction fees (which are tiny, like $0.0001).
				</p>
				<div class="bg-black/50 border border-crt-green/30 p-4 text-sm space-y-2">
					<div>Option 1: Buy directly in Phantom (easy but higher fees)</div>
					<div>Option 2: Buy on an exchange (Coinbase, Binance, etc) and send to Phantom</div>
					<div>Option 3: Someone sends you some</div>
				</div>
				<p class="text-sm text-crt-green/50 mt-4">
					Start with a small amount. Like $20-50 worth. Get comfortable first.
				</p>
			</div>

			<!-- Step 3 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">3.</div>
				<h2 class="text-2xl font-bold mb-4">Connect your wallet</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					Open COBOLCLAW terminal and type <code>CONNECT</code>. Phantom will pop up asking for permission. Click approve.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 font-mono text-sm">
					<div class="text-crt-green">&gt; CONNECT</div>
					<div class="text-crt-green/70 mt-2">Requesting wallet connection...</div>
					<div class="text-crt-green/70">[Phantom popup appears]</div>
					<div class="text-crt-green mt-2">✓ Wallet connected</div>
					<div class="text-crt-green/70">Address: 7xKp...3fRm</div>
					<div class="text-crt-green/70">Balance: 0.5 SOL</div>
				</div>
				<p class="text-sm text-crt-green/50 mt-4">
					COBOLCLAW can now see your address and balance. It still can't move your funds without your approval.
				</p>
			</div>

			<!-- Step 4 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">4.</div>
				<h2 class="text-2xl font-bold mb-4">Scan for tokens</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					Type <code>SCAN</code> to see what's new. You'll get a feed of tokens from Raydium pools with all the important data.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 font-mono text-sm">
					<div class="text-crt-green">&gt; SCAN</div>
					<div class="text-crt-green/70 mt-2">Scanning Raydium pools...</div>
					<div class="text-crt-green/40 mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
					<div class="mt-1">TICKER   MCAP    VOL     HOLDERS  STATUS</div>
					<div class="text-crt-amber">$PEPE    1.2M    45K     3.2K     <span class="text-red-400">HOT</span></div>
					<div class="text-crt-amber">$WOJAK   890K    32K     2.8K     <span class="text-red-400">HOT</span></div>
					<div class="text-crt-amber">$DOGE    650K    28K     2.1K     <span class="text-yellow-400">WARM</span></div>
				</div>
				<p class="text-sm text-crt-green/50 mt-4">
					HOT = new & volatile. WARM = still risky but established. COOL = older, stabler. DEAD = no volume, stay away.
				</p>
			</div>

			<!-- Step 5 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">5.</div>
				<h2 class="text-2xl font-bold mb-4">Check if it's a scam</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					<strong class="text-crt-red">Never skip this.</strong> Type <code>AUDIT $SYMBOL</code> before buying anything.
					It checks the blockchain for red flags.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 font-mono text-sm">
					<div class="text-crt-green">&gt; AUDIT $PEPE</div>
					<div class="text-crt-green/70 mt-2">Analyzing token on-chain...</div>
					<div class="mt-2">RISK SCORE: <span class="text-yellow-400">6/10 (MEDIUM RISK)</span></div>
					<div class="mt-2 space-y-1 text-sm">
						<div>Top 10 holders: 42.3%</div>
						<div>Dev wallet: 8.2% <span class="text-yellow-400">⚠</span></div>
						<div>Mint authority: <span class="text-crt-green">REVOKED ✓</span></div>
						<div>Freeze authority: <span class="text-crt-green">REVOKED ✓</span></div>
						<div>Deployer verdict: <span class="text-yellow-400">⚠ NEW WALLET</span></div>
					</div>
				</div>
				<p class="text-sm text-crt-green/50 mt-4">
					Red flags: Dev holds too much. Deployer is brand new (no track record). But at least they can't mint more tokens or freeze wallets.
					Medium risk. Your call.
				</p>
			</div>

			<!-- Step 6 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">6.</div>
				<h2 class="text-2xl font-bold mb-4">Buy (if you dare)</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					Type <code>CLAW $SYMBOL [AMOUNT]</code> where amount is how much SOL you want to spend. Start small.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 font-mono text-sm">
					<div class="text-crt-green">&gt; CLAW $PEPE 0.1</div>
					<div class="text-crt-green/70 mt-2">Fetching quote from Jupiter...</div>
					<div class="mt-2 space-y-1">
						<div>Estimated tokens: ~847,592 $PEPE</div>
						<div>Price impact: 0.8%</div>
						<div>Slippage: 1.0%</div>
						<div class="mt-2">Confirm purchase? (Y/N) <span class="animate-pulse">█</span></div>
					</div>
				</div>
				<p class="text-sm text-crt-green/50 mt-4">
					Type Y, hit enter. Phantom pops up. Review the transaction. Click approve. Done. The tokens appear in your wallet in ~3 seconds.
				</p>
			</div>

			<!-- Step 7 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">7.</div>
				<h2 class="text-2xl font-bold mb-4">Sell when you want</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					Type <code>DUMP $SYMBOL [AMOUNT]</code>. Amount can be a number (tokens to sell) or <code>ALL</code> to sell everything.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 font-mono text-sm">
					<div class="text-crt-green">&gt; DUMP $PEPE 50</div>
					<div class="text-crt-green/70">Selling 50% of your $PEPE...</div>
					<div class="mt-2 text-crt-green">&gt; DUMP $PEPE ALL</div>
					<div class="text-crt-green/70">Selling all your $PEPE...</div>
				</div>
				<p class="text-sm text-crt-green/50 mt-4">
					Same flow - get quote, confirm, approve in Phantom. SOL arrives in your wallet immediately.
				</p>
			</div>

			<!-- Step 8 -->
			<div class="border-l-4 border-crt-green/40 pl-8">
				<div class="text-4xl font-bold text-crt-green/40 mb-4">8.</div>
				<h2 class="text-2xl font-bold mb-4">Check your portfolio</h2>
				<p class="text-crt-green/80 mb-4 leading-relaxed">
					Type <code>BAG</code> to see everything you're holding and what it's worth right now.
				</p>
				<div class="bg-black border border-crt-green/30 p-4 font-mono text-sm">
					<div class="text-crt-green">&gt; BAG</div>
					<div class="text-crt-green/70 mt-2">Fetching portfolio...</div>
					<div class="text-crt-green/40 mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
					<div class="mt-1">TOKEN     BALANCE        VALUE</div>
					<div>$PEPE     847,592        0.12 SOL</div>
					<div>SOL       0.38 SOL       0.38 SOL</div>
					<div class="text-crt-green/40 mt-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
					<div class="mt-1">TOTAL PORTFOLIO: 0.50 SOL</div>
				</div>
			</div>
		</section>

		<!-- Tips -->
		<section class="border-t border-crt-green/20 pt-12 mb-20">
			<h2 class="text-2xl font-bold mb-8">Things to remember</h2>
			<div class="space-y-4 text-crt-green/70">
				<p>
					<strong class="text-crt-green">Start small.</strong> Test with amounts you're okay losing completely. Get comfortable with the flow before going bigger.
				</p>
				<p>
					<strong class="text-crt-green">Always AUDIT first.</strong> Takes 5 seconds. Could save you from a rug pull.
				</p>
				<p>
					<strong class="text-crt-green">Watch the price impact.</strong> If your trade moves the price more than a few percent, the pool is too small. You'll get wrecked by slippage.
				</p>
				<p>
					<strong class="text-crt-green">Most tokens go to zero.</strong> This is memecoin trading. The odds are against you. Only trade with money you can afford to lose.
				</p>
				<p>
					<strong class="text-crt-green">Take profits.</strong> If something pumps, sell some. Don't get greedy and ride it all the way back down.
				</p>
			</div>
		</section>

		<!-- Common Questions -->
		<section class="border-t border-crt-green/20 pt-12 mb-20">
			<h2 class="text-2xl font-bold mb-8">Common questions</h2>

			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-bold mb-2 text-crt-amber">How much should I start with?</h3>
					<p class="text-crt-green/70">
						$20-50 worth of SOL is plenty to learn. You can make hundreds of trades with that. Don't start with your life savings.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2 text-crt-amber">What are the fees?</h3>
					<p class="text-crt-green/70">
						Solana transaction fees are tiny - usually $0.0001-0.001. Jupiter takes a small percentage (&lt; 0.5%). No hidden fees from COBOLCLAW.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2 text-crt-amber">Can I cancel a trade after confirming?</h3>
					<p class="text-crt-green/70">
						Only before you approve in Phantom. Once you click approve there, the transaction goes to the blockchain and can't be reversed.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2 text-crt-amber">What if I lose my seed phrase?</h3>
					<p class="text-crt-green/70">
						Your funds are gone. Forever. No one can recover them, not Phantom, not COBOLCLAW, not anyone. This is why you write it down somewhere safe.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2 text-crt-amber">How do I know if a token is about to rug?</h3>
					<p class="text-crt-green/70">
						You don't. AUDIT helps spot obvious scams (deployer rugged before, can mint unlimited tokens, etc). But some rugs are planned in advance and look clean.
						This is why you only trade with money you can lose.
					</p>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<div class="border-t-2 border-crt-green/20 pt-12 text-center">
			<h2 class="text-3xl font-bold mb-6">Ready to try it?</h2>
			<p class="text-crt-green/70 mb-8">
				You know the risks. You know how it works. Time to hunt.
			</p>
			<button
				on:click={() => goto('/terminal')}
				class="px-10 py-4 bg-crt-green text-black text-xl font-bold hover:bg-crt-green/90 transition-all hover:shadow-[0_0_30px_rgba(51,255,51,0.7)]"
			>
				Launch Terminal →
			</button>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-crt-green/20 py-8 px-6 mt-20">
		<div class="max-w-4xl mx-auto text-center text-xs text-crt-green/40">
			<p>Good luck. You'll need it.</p>
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

	.animate-pulse {
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}
</style>
