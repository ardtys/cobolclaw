<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Safety & Risks - COBOLCLAW</title>
	<meta name="description" content="What can go wrong, and how to not lose all your money." />
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
			<h1 class="text-4xl md:text-6xl font-bold mb-6 text-red-400">Let's talk about risk</h1>
			<p class="text-xl text-crt-green/70">
				What can go wrong, and how to not lose all your money.
			</p>
		</div>

		<!-- The Brutal Truth -->
		<section class="mb-20 border-l-4 border-red-500/50 pl-8">
			<h2 class="text-2xl font-bold mb-6 text-red-400">The brutal truth</h2>
			<div class="space-y-4 text-crt-green/80 leading-relaxed">
				<p>
					Most memecoins go to zero. Like, 95%+ of them. They pump for a few hours, maybe a few days, then die.
				</p>
				<p>
					Some are straight-up scams - rug pulls where the creator drains all the liquidity and disappears. Others just fail because no one cares after the initial hype.
				</p>
				<p>
					COBOLCLAW executes <strong class="text-crt-green">real blockchain transactions</strong> with <strong class="text-crt-green">real money</strong>.
					When you buy, you spend actual SOL. When you sell, you might get less back than you put in. Or nothing.
				</p>
				<p class="text-red-400">
					<strong>All trades are final.</strong> No refunds. No customer service. No "undo" button. The blockchain doesn't care if you made a mistake.
				</p>
			</div>
		</section>

		<!-- What COBOLCLAW Does to Help -->
		<section class="mb-20">
			<h2 class="text-2xl font-bold mb-8 border-b border-crt-green/20 pb-2">What COBOLCLAW does to help</h2>

			<div class="space-y-8">
				<div class="border border-crt-green/30 p-6">
					<h3 class="text-xl font-bold mb-3">Trade Limits</h3>
					<div class="space-y-2 text-sm text-crt-green/70 mb-3">
						<div>• Max 0.5 SOL per trade</div>
						<div>• Min 0.001 SOL per trade</div>
						<div>• Max 10% slippage</div>
					</div>
					<p class="text-sm text-crt-green/60">
						Can't accidentally YOLO your entire wallet in one trade. You'd have to do it deliberately, multiple times.
					</p>
				</div>

				<div class="border border-crt-green/30 p-6">
					<h3 class="text-xl font-bold mb-3">AUDIT Command</h3>
					<p class="text-crt-green/70 mb-3">
						Checks the blockchain for red flags before you buy. Not perfect, but catches obvious scams.
					</p>
					<div class="text-sm text-crt-green/60 space-y-1">
						<div>• Top holders own 80%? Red flag.</div>
						<div>• Deployer rugged 5 tokens before? Red flag.</div>
						<div>• Can mint unlimited tokens? Red flag.</div>
						<div>• Can freeze your wallet? Red flag.</div>
					</div>
				</div>

				<div class="border border-crt-green/30 p-6">
					<h3 class="text-xl font-bold mb-3">Double Confirmation</h3>
					<p class="text-crt-green/70 mb-3">
						Every trade needs approval twice:
					</p>
					<div class="text-sm text-crt-green/60 space-y-1">
						<div>1. Type Y in the terminal</div>
						<div>2. Click approve in Phantom</div>
					</div>
					<p class="text-sm text-crt-green/60 mt-3">
						Gives you two chances to realize you're about to do something stupid.
					</p>
				</div>

				<div class="border border-crt-green/30 p-6">
					<h3 class="text-xl font-bold mb-3">Price Impact Warnings</h3>
					<p class="text-crt-green/70">
						If your trade will move the price more than 5%, you'll see a warning. Small liquidity = huge slippage.
						That 0.1 SOL buy could slip 30% in a tiny pool.
					</p>
				</div>
			</div>
		</section>

		<!-- What COBOLCLAW Can't Do -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8 text-red-400">What it can't do</h2>

			<div class="space-y-4 text-crt-green/70 leading-relaxed">
				<p>
					<strong class="text-crt-green">Can't predict rug pulls.</strong> Some scams are sophisticated. The deployer waits weeks, builds trust, then pulls.
					AUDIT checks history, but it can't see the future.
				</p>
				<p>
					<strong class="text-crt-green">Can't guarantee AUDIT is right.</strong> The risk score is based on on-chain data. But data can be gamed.
					A token with a "clean" audit can still be a scam.
				</p>
				<p>
					<strong class="text-crt-green">Can't stop you from making bad decisions.</strong> If you ignore all warnings and buy a token that's obviously a rug,
					that's on you. We show the data. You decide.
				</p>
				<p>
					<strong class="text-crt-green">Can't execute trades without Phantom approval.</strong> This is good for security, but it means you can't set automated stop-losses or take-profit orders.
					Every trade is manual.
				</p>
			</div>
		</section>

		<!-- Wallet Security -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8">Wallet security basics</h2>

			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-bold mb-3 text-crt-amber">Your seed phrase is everything</h3>
					<p class="text-crt-green/70 mb-2">
						If someone gets your seed phrase, they own your wallet. All of it. They can drain it in seconds, and you can't do anything about it.
					</p>
					<div class="bg-black/50 border border-crt-green/30 p-4 text-sm space-y-1">
						<div class="text-crt-green/60">DO:</div>
						<div>• Write it on paper</div>
						<div>• Store it somewhere safe (like a safe)</div>
						<div>• Make a backup copy in a different location</div>
						<div class="text-red-400 mt-3">DON'T:</div>
						<div class="text-red-400/80">• Screenshot it</div>
						<div class="text-red-400/80">• Email it to yourself</div>
						<div class="text-red-400/80">• Store it in Notes app</div>
						<div class="text-red-400/80">• Tell anyone what it is</div>
					</div>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-3 text-crt-amber">COBOLCLAW never sees your keys</h3>
					<p class="text-crt-green/70">
						COBOLCLAW connects to Phantom. Phantom holds your keys. Every transaction needs Phantom's approval.
						We literally can't access your wallet without you clicking "approve."
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-3 text-crt-amber">Use a separate trading wallet</h3>
					<p class="text-crt-green/70">
						Don't keep your life savings in the wallet you use for memecoin trading. Make a separate Phantom wallet just for this.
						Transfer in what you're willing to trade with, leave the rest somewhere safer.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-3 text-crt-amber">Watch out for fake sites</h3>
					<p class="text-crt-green/70 mb-2">
						Scammers make fake versions of popular sites (including wallets) to steal seed phrases.
					</p>
					<div class="text-sm text-crt-green/60">
						<div>• Always check the URL before entering your seed phrase</div>
						<div>• Bookmark the real Phantom site (phantom.app)</div>
						<div>• COBOLCLAW will NEVER ask for your seed phrase</div>
					</div>
				</div>
			</div>
		</section>

		<!-- How to Not Get Rekt -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8">How to not get completely rekt</h2>

			<div class="space-y-4 text-crt-green/70">
				<p>
					<strong class="text-crt-green">Start small.</strong> Like really small. $20-50 small. Learn how everything works before you go bigger.
				</p>
				<p>
					<strong class="text-crt-green">Always AUDIT first.</strong> Every. Single. Time. It takes 5 seconds. Might save you from a rug.
				</p>
				<p>
					<strong class="text-crt-green">If it seems too good to be true, it is.</strong> A brand new token up 1000% in an hour? Probably a pump and dump.
					You're not early. You're exit liquidity.
				</p>
				<p>
					<strong class="text-crt-green">Take profits.</strong> If something pumps 2x, 3x, 5x - sell some. Don't be greedy. Most pumps don't last.
				</p>
				<p>
					<strong class="text-crt-green">Set a loss limit.</strong> Decide before you buy: "If this goes down 50%, I'm out." Then actually do it. Don't hope it'll recover.
				</p>
				<p>
					<strong class="text-crt-green">Don't trade on emotion.</strong> FOMO makes you buy tops. Fear makes you sell bottoms. If you're feeling emotional, close the terminal.
				</p>
				<p>
					<strong class="text-crt-green">Most tokens go to zero.</strong> I know I already said this, but it's worth repeating. The odds are against you. Only trade with money you can lose.
				</p>
			</div>
		</section>

		<!-- If Something Goes Wrong -->
		<section class="mb-20 border-t border-crt-green/20 pt-12">
			<h2 class="text-2xl font-bold mb-8 text-red-400">If something goes wrong</h2>

			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-bold mb-2">Token rugged?</h3>
					<p class="text-crt-green/70">
						Sell immediately if you can. Don't wait for it to "recover." It won't. Cut your losses and move on.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2">Transaction failed?</h3>
					<p class="text-crt-green/70">
						Check the TX hash on Solscan. Failed transactions don't cost you anything except gas (which is tiny). Just try again.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2">Wallet compromised?</h3>
					<p class="text-crt-green/70 mb-2">
						If someone has your seed phrase:
					</p>
					<div class="text-sm text-crt-green/60 space-y-1">
						<div>1. Create a new wallet immediately</div>
						<div>2. Transfer any remaining funds to the new wallet</div>
						<div>3. Never use the compromised wallet again</div>
						<div>4. Your old wallet is dead. Accept it and move on.</div>
					</div>
				</div>

				<div>
					<h3 class="text-lg font-bold mb-2">Lost your seed phrase?</h3>
					<p class="text-crt-green/70">
						Your funds are gone. No one can recover them. Not Phantom. Not COBOLCLAW. Not Solana. This is why you write it down.
					</p>
				</div>
			</div>
		</section>

		<!-- Final Word -->
		<section class="border-2 border-crt-amber/30 p-8 bg-crt-amber/5">
			<h2 class="text-2xl font-bold mb-4 text-crt-amber">The final word</h2>
			<div class="space-y-3 text-crt-green/80">
				<p>
					COBOLCLAW is a tool. It gives you real-time data, on-chain analysis, and fast execution. What you do with it is up to you.
				</p>
				<p>
					We built in safety features to make it harder to accidentally lose everything. But we can't stop you from making bad trades.
				</p>
				<p class="text-crt-amber font-bold">
					Only trade with money you can afford to lose. Seriously.
				</p>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-crt-green/20 py-8 px-6 mt-20">
		<div class="max-w-4xl mx-auto text-center text-xs text-crt-green/40">
			<p>You've been warned. Now go hunt responsibly.</p>
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
</style>
