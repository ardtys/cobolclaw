<script lang="ts">
	import { goto } from '$app/navigation';

	let openFaq = 0;

	const categories = [
		{
			title: 'Getting started',
			questions: [
				{
					q: 'What is this thing?',
					a: 'A terminal for trading Solana memecoins. Scans Raydium pools for new tokens, shows you on-chain data, executes trades through Jupiter. Think of it like a Bloomberg terminal from 1979, except for $BONK instead of IBM stock.'
				},
				{
					q: 'Do I need special software?',
					a: 'Yeah, Phantom wallet. That\'s it. Install the browser extension from phantom.app, fund it with some SOL, and you\'re good. COBOLCLAW connects to Phantom to actually execute trades on-chain.'
				},
				{
					q: 'Does it cost money?',
					a: 'COBOLCLAW itself? No, it\'s free. You pay normal Solana gas fees (~0.001 SOL per trade) and whatever you spend buying tokens. No subscription, no platform fees, no hidden costs.'
				},
				{
					q: 'How do I start?',
					a: 'Get Phantom. Add SOL. Go to /terminal. Type CONNECT. Then SCAN to find tokens. Always AUDIT before you buy. That\'s it.'
				}
			]
		},
		{
			title: 'Wallet stuff',
			questions: [
				{
					q: 'Is my wallet safe?',
					a: 'COBOLCLAW never sees your keys. Every trade needs approval in Phantom. We can\'t access your wallet without you clicking "approve." That said, always double-check what you\'re approving in Phantom before you click yes.'
				},
				{
					q: 'Can it trade without asking me?',
					a: 'No. Every trade needs two confirmations: Y in the terminal, then approve in Phantom. Nothing happens without both.'
				},
				{
					q: 'Should I use my main wallet?',
					a: 'Hell no. Make a separate wallet for trading. Only put in what you\'re willing to lose. Keep your serious money somewhere safer.'
				},
				{
					q: 'What are the trade limits?',
					a: 'Max 0.5 SOL per trade. Min 0.001 SOL. Max 10% slippage. These exist so you can\'t accidentally YOLO your entire portfolio in one click.'
				}
			]
		},
		{
			title: 'Trading',
			questions: [
				{
					q: 'How does SCAN work?',
					a: 'Fetches real tokens from Raydium pools. Shows price, volume, holders, age. Updates every 5 seconds. It\'s actual blockchain data, not made-up numbers.'
				},
				{
					q: 'What do HOT/WARM/COOL/DEAD mean?',
					a: 'HOT = brand new (<5min), high volume, extremely volatile. WARM = a bit older, still moving. COOL = established, less risky. DEAD = no volume, nobody cares, don\'t touch it.'
				},
				{
					q: 'Why use AUDIT?',
					a: 'Because most tokens are scams. AUDIT checks who owns what, if the dev rugged before, if they can mint unlimited tokens. Takes 5 seconds. Might save you from losing money.'
				},
				{
					q: 'How do I spot a rug pull?',
					a: 'Red flags: deployer rugged other tokens before, top holders own 80%+, mint authority still active, freeze authority enabled, dev wallet huge, barely any real holders. AUDIT catches most of this.'
				},
				{
					q: 'What\'s slippage?',
					a: 'The difference between the price you see and the price you actually get. New/volatile tokens need higher slippage (2-5%). Established tokens can use lower (0.5-1%). Don\'t go above 10% unless you know what you\'re doing.'
				},
				{
					q: 'Why did my trade fail?',
					a: 'Not enough SOL (you need extra for gas). Price moved too much (increase slippage). Network congestion (try again). You cancelled in Phantom. Or the token\'s liquidity died.'
				},
				{
					q: 'Can I cancel after confirming?',
					a: 'Until you approve in Phantom, yes. Once you click approve in Phantom and it hits the blockchain, no. It\'s gone. Double-check everything.'
				}
			]
		},
		{
			title: 'Technical stuff',
			questions: [
				{
					q: 'Does it work on mobile?',
					a: 'Technically? Maybe. Recommended? No. The terminal works way better on desktop. Plus Phantom mobile support is iffy.'
				},
				{
					q: 'Can I use wallets besides Phantom?',
					a: 'Not right now. Phantom only. Other wallets might come later.'
				},
				{
					q: 'Where\'s my trading history?',
					a: 'HISTORY command shows your current session. For full on-chain history, check Solscan or SolanaFM with your wallet address.'
				},
				{
					q: 'Can I set alerts or stop losses?',
					a: 'Nope. Everything is manual. You have to watch and execute trades yourself. This isn\'t a bot - it\'s a tool.'
				},
				{
					q: 'What\'s Jupiter?',
					a: 'A DEX aggregator. Finds the best price across all Solana exchanges. Splits your trade across multiple pools if needed. You get better prices without thinking about it.'
				},
				{
					q: 'Why the retro look?',
					a: 'Because trading memecoins through a 1979 IBM terminal is funny. Plus the aesthetic is sick.'
				},
				{
					q: 'What\'s RPC?',
					a: 'How COBOLCLAW talks to Solana. We use Helius for fast, reliable connections. If it fails, you\'ll see a warning and we fall back to cached data.'
				},
				{
					q: 'What are gas fees?',
					a: 'Tiny fees to Solana validators (~0.001 SOL per trade). You need a bit more SOL than your trade amount to cover it.'
				}
			]
		},
		{
			title: 'Risk stuff',
			questions: [
				{
					q: 'Is this risky?',
					a: 'YES. Extremely. Most memecoins go to zero. Rug pulls are common. You can lose everything. Only use money you can afford to lose.'
				},
				{
					q: 'Does COBOLCLAW prevent rug pulls?',
					a: 'No. AUDIT helps you spot red flags, but it can\'t predict the future. Even "clean" tokens can rug. Do your own research. Trust nothing.'
				},
				{
					q: 'Is this financial advice?',
					a: 'Absolutely not. COBOLCLAW is a tool. What you do with it is your decision. We\'re not telling you what to buy or how to trade.'
				},
				{
					q: 'What if I lose money?',
					a: 'That\'s on you. We provide the tool. You make the decisions. No refunds, no guarantees, no customer service for bad trades.'
				},
				{
					q: 'Any guarantees?',
					a: 'None. No guarantees of profit, accurate data, uptime, successful trades, or safety. Markets are unpredictable. Act accordingly.'
				}
			]
		},
		{
			title: 'Help',
			questions: [
				{
					q: 'I found a bug.',
					a: 'Report it on GitHub or email support@cobolclaw.com. Include what browser you\'re using, what happened, error messages, screenshots. We\'ll look into it.'
				},
				{
					q: 'My transaction failed. Now what?',
					a: 'Check the error in the terminal. Look up the TX hash on Solscan if you got one. Read the TROUBLESHOOTING section in /docs. Still stuck? Email support.'
				},
				{
					q: 'Can I request features?',
					a: 'Yeah, GitHub issues or support@cobolclaw.com. If enough people want it and it makes sense, we\'ll build it.'
				}
			]
		}
	];

	function toggleFaq(categoryIndex: number, questionIndex: number) {
		const faqId = categoryIndex * 100 + questionIndex;
		openFaq = openFaq === faqId ? -1 : faqId;
	}
</script>

<svelte:head>
	<title>Questions? - COBOLCLAW</title>
	<meta name="description" content="Common questions about COBOLCLAW" />
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
			<h1 class="text-4xl md:text-6xl font-bold mb-6">Questions?</h1>
			<p class="text-xl text-crt-green/70">
				Quick answers. No BS.
			</p>
		</div>

		<!-- FAQ Categories -->
		{#each categories as category, categoryIndex}
			<section class="mb-16">
				<h2 class="text-2xl font-bold mb-6 border-b border-crt-green/20 pb-2">
					{category.title}
				</h2>

				<div class="space-y-4">
					{#each category.questions as faq, questionIndex}
						{@const faqId = categoryIndex * 100 + questionIndex}
						<div class="border-l-4 border-crt-green/30 pl-6">
							<button
								on:click={() => toggleFaq(categoryIndex, questionIndex)}
								class="w-full text-left flex items-start justify-between gap-4 hover:text-crt-green/80 transition-colors"
							>
								<span class="font-bold">{faq.q}</span>
								<span class="text-crt-green/50 flex-shrink-0">
									{openFaq === faqId ? '−' : '+'}
								</span>
							</button>

							{#if openFaq === faqId}
								<div class="mt-3 text-crt-green/70 leading-relaxed">
									<p>{faq.a}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/each}

	</main>

	<!-- Footer -->
	<footer class="border-t border-crt-green/20 py-8 px-6 mt-20">
		<div class="max-w-4xl mx-auto text-center text-xs text-crt-green/40">
			<p>These are answers. What you do with them is up to you.</p>
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
