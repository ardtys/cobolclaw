<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { typewriterLines } from '$lib/utils/typewriter';
	import GlitchTransition from '$lib/components/crt/GlitchTransition.svelte';

	let terminalOutput: string[] = [];
	let currentIndex = 0;
	let copied = false;

	// Boot sequence states
	let showBoot = true;
	let bootComplete = false;
	let displayedLines: string[] = [];
	let showCursor = false;
	let canSkip = false;
	let skipping = false;
	let glitching = false;

	// Launch boot states
	let isLaunching = false;
	let launchLines: string[] = [];
	let launchCursor = false;

	const bootSequence = [
		'> INITIALIZING COBOLCLAW SYSTEM...',
		'> LOADING RAYDIUM SCANNER... OK',
		'> CONNECTING TO BLOCKCHAIN... OK',
		'> MOUNTING JUPITER SWAPS... OK',
		'> SYSTEM READY. TYPE "SCAN" TO BEGIN.',
		'> _'
	];

	// Placeholder contract address
	const CONTRACT_ADDRESS = 'TBA_WILL_BE_UPDATED_SOON';

	// Initial boot sequence lines
	const initialBootLines = [
		{ delay: 0, text: '██████████████████████████████████████████████' },
		{ delay: 200, text: 'COBOLCLAW MAINFRAME SYSTEMS v1.0.0' },
		{ delay: 150, text: '(C) 2025 COBOLCLAW LABORATORIES' },
		{ delay: 200, text: '██████████████████████████████████████████████' },
		{ delay: 300, text: '' },
		{ delay: 200, text: 'INITIALIZING SYSTEM...' },
		{ delay: 200, text: '> POWER ON SELF TEST.......... OK' },
		{ delay: 200, text: '> MEMORY CHECK................ 64K OK' },
		{ delay: 200, text: '> DISPLAY ADAPTER............. CRT OK' },
		{ delay: 200, text: '> NETWORK MODULE.............. ONLINE' },
		{ delay: 300, text: '' },
		{ delay: 150, text: 'ALL SYSTEMS NOMINAL.' },
		{ delay: 200, text: '' }
	];

	// Launch boot sequence lines
	const launchBootLines = [
		{ delay: 0, text: '██████████████████████████████████████████████' },
		{ delay: 150, text: 'LAUNCHING TERMINAL INTERFACE...' },
		{ delay: 150, text: '██████████████████████████████████████████████' },
		{ delay: 250, text: '' },
		{ delay: 150, text: '> CONNECTING TO BLOCKCHAIN RPC...... CONNECTED' },
		{ delay: 150, text: `> SYNCING BLOCK HEIGHT.............. #${Math.floor(Math.random() * 1000000) + 285000000}` },
		{ delay: 150, text: '> LOADING RAYDIUM POOLS............. READY' },
		{ delay: 150, text: '> INITIALIZING JUPITER AGGREGATOR... READY' },
		{ delay: 150, text: '> ARMING CLAW ENGINE................ ARMED' },
		{ delay: 200, text: '' },
		{ delay: 150, text: '> LOADING WALLET MODULE............. STANDBY' },
		{ delay: 150, text: '> LOADING TOKEN SCANNER............. READY' },
		{ delay: 200, text: '' },
		{ delay: 100, text: '============================================' },
		{ delay: 100, text: 'WARNING: TRADE AT YOUR OWN RISK. DYOR. NFA.' },
		{ delay: 100, text: '============================================' },
		{ delay: 300, text: '' },
		{ delay: 150, text: 'TERMINAL READY. ENTERING MAINFRAME...' }
	];

	onMount(async () => {
		// Check if boot has been seen this session
		const bootSeen = sessionStorage.getItem('cobolclaw_landing_boot');

		if (bootSeen) {
			showBoot = false;
			bootComplete = true;
			startLandingAnimation();
			return;
		}

		canSkip = true;

		// Run initial boot sequence
		await typewriterLines(
			initialBootLines,
			(lineIndex, text) => {
				if (skipping) return;
				displayedLines[lineIndex] = text;
				displayedLines = [...displayedLines];
			},
			20
		);

		if (!skipping) {
			displayedLines = [...displayedLines, 'PRESS [ENTER] TO CONTINUE'];
			showCursor = true;
		}
	});

	function handleKeyPress(event: KeyboardEvent) {
		if (showBoot && !bootComplete) {
			if (event.key === 'Enter' && showCursor && !glitching) {
				completeBoot();
			} else if (event.key === 'Escape' && canSkip && !glitching) {
				skipBoot();
			}
		}

		if (isLaunching && launchCursor && event.key === 'Enter') {
			finishLaunch();
		}
	}

	function skipBoot() {
		skipping = true;
		completeBoot();
	}

	function completeBoot() {
		if (glitching) return;
		glitching = true;

		setTimeout(() => {
			sessionStorage.setItem('cobolclaw_landing_boot', 'true');
			showBoot = false;
			bootComplete = true;
			glitching = false;
			startLandingAnimation();
		}, 200);
	}

	function startLandingAnimation() {
		const interval = setInterval(() => {
			if (currentIndex < bootSequence.length) {
				terminalOutput = [...terminalOutput, bootSequence[currentIndex]];
				currentIndex++;
			} else {
				clearInterval(interval);
			}
		}, 300);
	}

	function copyAddress() {
		navigator.clipboard.writeText(CONTRACT_ADDRESS);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}

	async function handleLaunch() {
		if (isLaunching) return;

		isLaunching = true;
		launchLines = [];
		launchCursor = false;

		// Run launch boot sequence
		await typewriterLines(
			launchBootLines,
			(lineIndex, text) => {
				launchLines[lineIndex] = text;
				launchLines = [...launchLines];
			},
			15
		);

		launchCursor = true;

		// Auto-proceed after a short delay
		setTimeout(() => {
			finishLaunch();
		}, 1500);
	}

	function finishLaunch() {
		glitching = true;
		setTimeout(() => {
			goto('/terminal');
		}, 200);
	}
</script>

<svelte:head>
	<title>COBOLCLAW - Hunt Memecoins Like It's 1979</title>
	<meta
		name="description"
		content="Trade blockchain memecoins through a retro terminal. Because sometimes the old ways are better."
	/>
</svelte:head>

<svelte:window on:keydown={handleKeyPress} />

<!-- Initial Boot Sequence -->
{#if showBoot && !bootComplete}
	<div class="boot-sequence min-h-screen bg-black text-crt-green p-8 flex flex-col justify-center">
		<div class="boot-container max-w-4xl mx-auto">
			<pre class="boot-text font-mono text-sm leading-relaxed">
{#each displayedLines as line}
{line}
{/each}{#if showCursor}<span class="animate-blink">█</span>{/if}
			</pre>
		</div>

		{#if canSkip && !showCursor}
			<button
				type="button"
				on:click={skipBoot}
				class="skip-button fixed bottom-8 right-8 text-crt-green/50 text-xs hover:text-crt-green transition-colors"
			>
				[ESC] SKIP
			</button>
		{/if}
	</div>

<!-- Launch Boot Sequence -->
{:else if isLaunching}
	<div class="boot-sequence min-h-screen bg-black text-crt-green p-8 flex flex-col justify-center">
		<div class="boot-container max-w-4xl mx-auto">
			<pre class="boot-text font-mono text-sm leading-relaxed">
{#each launchLines as line}
{line}
{/each}{#if launchCursor}<span class="animate-blink">█</span>{/if}
			</pre>
		</div>
	</div>

<!-- Main Landing Page -->
{:else}
	<div class="min-h-screen bg-black text-crt-green font-mono">
		<!-- Fixed Scanline Effect -->
		<div class="scanline"></div>
		<div class="crt-overlay"></div>

		<!-- Nav with Centered Menu -->
		<nav class="relative z-50 border-b border-crt-green/20 bg-black/90 backdrop-blur">
			<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
				<!-- Logo -->
				<div class="flex items-center gap-3">
					<img src="/logo.png" alt="COBOLCLAW" class="w-8 h-8 opacity-80" />
					<span class="text-lg font-bold tracking-wider">COBOLCLAW</span>
				</div>

				<!-- Centered Menu -->
				<div class="hidden md:flex items-center gap-8">
					<a href="/features" class="text-sm text-crt-green/70 hover:text-crt-green transition-colors">
						Features
					</a>
					<a href="/how-it-works" class="text-sm text-crt-green/70 hover:text-crt-green transition-colors">
						How It Works
					</a>
					<a href="/security" class="text-sm text-crt-green/70 hover:text-crt-green transition-colors">
						Security
					</a>
					<a href="/docs" class="text-sm text-crt-green/70 hover:text-crt-green transition-colors">
						Docs
					</a>
					<a href="/faq" class="text-sm text-crt-green/70 hover:text-crt-green transition-colors">
						FAQ
					</a>
				</div>

				<!-- Launch Button -->
				<button
					on:click={handleLaunch}
					class="px-6 py-2 bg-crt-green text-black font-bold hover:bg-crt-green/90 transition-all hover:shadow-[0_0_20px_rgba(51,255,51,0.6)]"
				>
					LAUNCH
				</button>
			</div>
		</nav>

		<!-- Hero -->
		<section class="relative min-h-[90vh] flex items-center justify-center px-6 py-20">
			<div class="max-w-5xl mx-auto text-center">
				<!-- Main Headline -->
				<div class="mb-8">
					<h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
						Hunt Memecoins<br />
						<span class="text-crt-green/60">Like It's 1979</span>
					</h1>
					<p class="text-xl md:text-2xl text-crt-green/80 max-w-2xl mx-auto leading-relaxed">
						No flashy charts. No complicated UI. Just you, a terminal, and the blockchain.
						<span class="block mt-2 text-crt-green/60">The way trading should be.</span>
					</p>
				</div>

				<!-- Terminal Demo -->
				<div class="border-2 border-crt-green/40 bg-black/90 p-6 mb-8 max-w-3xl mx-auto text-left shadow-[0_0_40px_rgba(51,255,51,0.15)]">
					<div class="flex items-center gap-2 mb-4 pb-3 border-b border-crt-green/20">
						<div class="w-3 h-3 rounded-full bg-red-500"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div class="w-3 h-3 rounded-full bg-crt-green"></div>
						<span class="ml-3 text-xs opacity-60">IBM 3279 TERMINAL EMULATOR</span>
					</div>
					<div class="text-sm space-y-1 min-h-[120px]">
						{#each terminalOutput as line}
							<div class="animate-fade-in">{line}</div>
						{/each}
					</div>
				</div>

				<!-- CTA -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<button
						on:click={handleLaunch}
						class="group px-10 py-4 bg-crt-green text-black text-xl font-bold hover:bg-crt-green/90 transition-all border-2 border-crt-green hover:shadow-[0_0_30px_rgba(51,255,51,0.7)] relative overflow-hidden"
					>
						<span class="relative z-10">&gt; START HUNTING_</span>
						<div class="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
					</button>
					<a
						href="#what-is-this"
						class="px-10 py-4 border-2 border-crt-green/40 text-crt-green hover:border-crt-green hover:bg-crt-green/5 transition-all text-xl font-bold"
					>
						What is this?
					</a>
				</div>

				<p class="mt-6 text-sm text-crt-green/50">
					Connect Phantom - Scan Raydium - Trade on Jupiter - No BS
				</p>
			</div>
		</section>

		<!-- CA Section -->
		<section id="ca" class="py-16 px-6 bg-black border-y-2 border-crt-green/50">
			<div class="max-w-4xl mx-auto">
				<div class="text-center mb-8">
					<div class="inline-block px-4 py-1 border border-crt-amber/50 text-crt-amber text-xs mb-4 animate-pulse">
						TOKEN LAUNCH PENDING
					</div>
					<p class="text-crt-green/60">Official COBOLCLAW Token</p>
				</div>

				<!-- CA Display Box -->
				<div class="border-2 border-crt-green/60 bg-black p-8 max-w-3xl mx-auto relative overflow-hidden">
					<!-- Animated border glow -->
					<div class="absolute inset-0 border-2 border-crt-green/20 animate-pulse"></div>

					<div class="relative z-10">
						<div class="text-center mb-6">
							<span class="text-xs text-crt-green/50 tracking-widest">CONTRACT ADDRESS (CA)</span>
						</div>

						<div class="flex items-center justify-center gap-4 flex-wrap">
							<div class="font-mono text-lg md:text-2xl text-crt-green tracking-wider ca-placeholder">
								<span class="animate-blink">[</span>
								<span class="text-crt-amber">COMING SOON</span>
								<span class="animate-blink">]</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Social Links -->
				<div class="mt-8 flex justify-center">
					<a
						href="https://x.com/CobolClaw"
						target="_blank"
						class="flex items-center gap-2 px-6 py-3 border border-crt-green/30 hover:border-crt-green hover:bg-crt-green/5 transition-all text-sm"
					>
						<span>FOLLOW ON X</span>
					</a>
				</div>

				<p class="text-center text-crt-green/40 text-xs mt-6">
					Join our community for launch announcements and updates
				</p>
			</div>
		</section>

		<!-- What Is This Section -->
		<section id="what-is-this" class="py-20 px-6 border-y border-crt-green/20">
			<div class="max-w-4xl mx-auto">
				<h2 class="text-3xl md:text-5xl font-bold mb-8">
					Remember when computers<br />were simple?
				</h2>
				<div class="space-y-6 text-lg text-crt-green/80 leading-relaxed">
					<p>
						No endless scrolling. No 47 browser tabs. No notifications begging for attention.
					</p>
					<p>
						<strong class="text-crt-green">Just a black screen, green text, and work getting done.</strong>
					</p>
					<p>
						COBOLCLAW brings that back. It's a terminal for trading blockchain memecoins.
						Type commands. Get results. Make trades. That's it.
					</p>
					<p class="text-crt-green/60 text-base">
						(Built with modern tech, styled like 1970s IBM mainframes. Best of both worlds.)
					</p>
				</div>
			</div>
		</section>

		<!-- Why Use This -->
		<section class="py-20 px-6">
			<div class="max-w-6xl mx-auto">
				<h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
					Why trade through a terminal?
				</h2>

				<div class="grid md:grid-cols-2 gap-8">
					<!-- Benefit 1 -->
					<div class="border border-crt-green/30 p-8 hover:border-crt-green/60 transition-all group">
						<h3 class="text-2xl font-bold mb-4 group-hover:text-crt-green/90">Speed Matters</h3>
						<p class="text-crt-green/70 leading-relaxed">
							No clicking through 5 different menus. Type <code class="text-crt-green">SCAN</code> and see new tokens instantly.
							Type <code class="text-crt-green">CLAW $TOKEN 0.1</code> and you're buying. 3 seconds vs 30 seconds.
							When a memecoin pumps, every second counts.
						</p>
					</div>

					<!-- Benefit 2 -->
					<div class="border border-crt-green/30 p-8 hover:border-crt-green/60 transition-all group">
						<h3 class="text-2xl font-bold mb-4 group-hover:text-crt-green/90">Real Data Only</h3>
						<p class="text-crt-green/70 leading-relaxed">
							Everything comes straight from the blockchain. Raydium pools for tokens. On-chain analysis for audits.
							Jupiter for swaps. No middleman. No fake data. What you see is what the blockchain sees.
						</p>
					</div>

					<!-- Benefit 3 -->
					<div class="border border-crt-green/30 p-8 hover:border-crt-green/60 transition-all group">
						<h3 class="text-2xl font-bold mb-4 group-hover:text-crt-green/90">Your Keys, Your Crypto</h3>
						<p class="text-crt-green/70 leading-relaxed">
							COBOLCLAW never touches your wallet. It connects to Phantom (like every other app).
							Every trade needs YOUR approval. We can't access your funds even if we wanted to.
							Non-custodial, as it should be.
						</p>
					</div>

					<!-- Benefit 4 -->
					<div class="border border-crt-green/30 p-8 hover:border-crt-green/60 transition-all group">
						<h3 class="text-2xl font-bold mb-4 group-hover:text-crt-green/90">Built-In Protection</h3>
						<p class="text-crt-green/70 leading-relaxed">
							Max 0.5 SOL per trade. Double confirmation required. Slippage warnings. Price impact alerts.
							<code class="text-crt-green">AUDIT</code> command checks for rug pulls before you buy.
							Won't stop you from making bad trades, but makes it harder to mess up badly.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- How It Actually Works -->
		<section class="py-20 px-6 bg-crt-green/5 border-y border-crt-green/20">
			<div class="max-w-4xl mx-auto">
				<h2 class="text-3xl md:text-4xl font-bold mb-12">How it actually works</h2>

				<div class="space-y-8">
					<div class="flex gap-6">
						<div class="text-4xl font-bold text-crt-green/40 w-12 flex-shrink-0">1.</div>
						<div>
							<h3 class="text-xl font-bold mb-2">Install Phantom wallet</h3>
							<p class="text-crt-green/70">Browser extension. Takes 2 minutes. You probably already have it.</p>
						</div>
					</div>

					<div class="flex gap-6">
						<div class="text-4xl font-bold text-crt-green/40 w-12 flex-shrink-0">2.</div>
						<div>
							<h3 class="text-xl font-bold mb-2">Connect your wallet</h3>
							<p class="text-crt-green/70">Type <code class="text-crt-green">CONNECT</code> in the terminal. Approve in Phantom. Done.</p>
						</div>
					</div>

					<div class="flex gap-6">
						<div class="text-4xl font-bold text-crt-green/40 w-12 flex-shrink-0">3.</div>
						<div>
							<h3 class="text-xl font-bold mb-2">Scan for tokens</h3>
							<p class="text-crt-green/70">Type <code class="text-crt-green">SCAN</code>. See new tokens from Raydium pools with price, volume, holders, age.</p>
						</div>
					</div>

					<div class="flex gap-6">
						<div class="text-4xl font-bold text-crt-green/40 w-12 flex-shrink-0">4.</div>
						<div>
							<h3 class="text-xl font-bold mb-2">Check if it's a scam</h3>
							<p class="text-crt-green/70">Type <code class="text-crt-green">AUDIT $TOKEN</code>. See holder distribution, deployer history, authority checks, risk score.</p>
						</div>
					</div>

					<div class="flex gap-6">
						<div class="text-4xl font-bold text-crt-green/40 w-12 flex-shrink-0">5.</div>
						<div>
							<h3 class="text-xl font-bold mb-2">Buy or sell</h3>
							<p class="text-crt-green/70"><code class="text-crt-green">CLAW $TOKEN 0.1</code> to buy. <code class="text-crt-green">DUMP $TOKEN 50</code> to sell half. Confirm in terminal, approve in Phantom.</p>
						</div>
					</div>

					<div class="flex gap-6">
						<div class="text-4xl font-bold text-crt-green/40 w-12 flex-shrink-0">6.</div>
						<div>
							<h3 class="text-xl font-bold mb-2">Track your portfolio</h3>
							<p class="text-crt-green/70">Type <code class="text-crt-green">BAG</code> to see all your holdings and their current value.</p>
						</div>
					</div>
				</div>

				<div class="mt-12 text-center">
					<a
						href="/how-it-works"
						class="inline-block px-8 py-3 border-2 border-crt-green/40 hover:border-crt-green hover:bg-crt-green/5 transition-all font-bold"
					>
						See detailed guide
					</a>
				</div>
			</div>
		</section>

		<!-- Real Warning Section -->
		<section class="py-20 px-6 border-y-2 border-red-500/30 bg-red-500/5">
			<div class="max-w-3xl mx-auto">
				<div class="text-center mb-8">
					<h2 class="text-3xl font-bold text-red-400 mb-4">WARNING: This is not a game</h2>
				</div>

				<div class="space-y-4 text-lg text-crt-green/80">
					<p>
						COBOLCLAW executes <strong class="text-crt-green">real blockchain transactions</strong> with <strong class="text-crt-green">real money</strong>.
					</p>
					<p>
						When you buy a token, you spend actual SOL. When you sell, you get actual SOL back (or lose it if the token rugs).
						<strong class="text-red-400">All trades are final.</strong>
					</p>
					<p>
						Memecoins are extremely risky. Most go to zero. Some are outright scams. The AUDIT command helps, but it can't predict the future.
					</p>
					<p class="text-crt-green/60 text-base">
						Only trade with money you're okay losing. Seriously. Don't be that person who mortgages their house for $ELONDOG.
					</p>
				</div>

				<div class="mt-8 text-center">
					<a
						href="/security"
						class="inline-block px-8 py-3 border-2 border-red-400/50 text-red-400 hover:border-red-400 hover:bg-red-400/5 transition-all font-bold"
					>
						Read safety guide
					</a>
				</div>
			</div>
		</section>

		<!-- Live Commands Preview -->
		<section class="py-20 px-6">
			<div class="max-w-5xl mx-auto">
				<h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">
					See it in action
				</h2>
				<p class="text-center text-crt-green/60 mb-12 text-lg">
					This is what trading looks like in COBOLCLAW
				</p>

				<div class="border-2 border-crt-green/40 bg-black p-6 font-mono">
					<pre class="text-sm overflow-x-auto whitespace-pre">
<span class="text-crt-green">&gt; SCAN HOT</span>

SCANNING RAYDIUM POOLS...
FILTERING HOT TOKENS...

<span class="text-crt-green/40">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
 TOKEN      MCAP      VOL(5M)   HOLDERS   AGE    STATUS
<span class="text-crt-green/40">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
 <span class="text-crt-amber">$PEPE</span>      1.2M      45K       3.2K      2m     <span class="text-red-400">HOT</span>
 <span class="text-crt-amber">$WOJAK</span>     890K      32K       2.8K      4m     <span class="text-red-400">HOT</span>
 <span class="text-crt-amber">$DOGE2</span>     650K      28K       2.1K      3m     <span class="text-red-400">HOT</span>

<span class="text-crt-green">&gt; AUDIT $PEPE</span>

ANALYZING $PEPE...
CHECKING HOLDER DISTRIBUTION...
REVIEWING DEPLOYER HISTORY...

<span class="text-yellow-400">RISK SCORE: 6/10 (MEDIUM RISK)</span>

TOP 10 HOLDERS: 42.3%
DEV WALLET: 8.2% <span class="text-yellow-400">WARNING</span>
MINT AUTHORITY: <span class="text-crt-green">REVOKED</span>
FREEZE AUTHORITY: <span class="text-crt-green">REVOKED</span>
DEPLOYER VERDICT: <span class="text-yellow-400">NEW WALLET</span>
TOTAL HOLDERS: 3,247

<span class="text-crt-green">&gt; CLAW $PEPE 0.1</span>

FETCHING QUOTE FROM JUPITER...
ESTIMATED TOKENS: ~847,592 $PEPE
PRICE IMPACT: 0.8%
SLIPPAGE: 1.0%

CONFIRM PURCHASE? (Y/N) <span class="animate-blink">█</span>
</pre>
				</div>

				<div class="mt-8 text-center">
					<button
						on:click={handleLaunch}
						class="px-10 py-4 bg-crt-green text-black text-xl font-bold hover:bg-crt-green/90 transition-all hover:shadow-[0_0_30px_rgba(51,255,51,0.7)]"
					>
						Try it yourself
					</button>
				</div>
			</div>
		</section>

		<!-- Tech Stack - Minimal -->
		<section class="py-16 px-6 border-t border-crt-green/20">
			<div class="max-w-4xl mx-auto">
				<p class="text-center text-crt-green/60 mb-6 text-sm">POWERED BY</p>
				<div class="flex flex-wrap justify-center gap-6 items-center text-crt-green/50 text-sm font-mono">
					<span>Phantom</span>
					<span class="text-crt-green/30">|</span>
					<span>Jupiter</span>
					<span class="text-crt-green/30">|</span>
					<span>Raydium</span>
					<span class="text-crt-green/30">|</span>
					<span>Helius</span>
					<span class="text-crt-green/30">|</span>
					<span>Solana</span>
				</div>
			</div>
		</section>

		<!-- Final CTA -->
		<section class="py-24 px-6 border-t-2 border-crt-green/20">
			<div class="max-w-3xl mx-auto text-center">
				<h2 class="text-4xl md:text-5xl font-bold mb-6">
					Ready to hunt?
				</h2>
				<p class="text-xl text-crt-green/70 mb-10">
					No signup. No email. Just connect Phantom and start trading.
				</p>
				<button
					on:click={handleLaunch}
					class="px-12 py-5 bg-crt-green text-black text-2xl font-bold hover:bg-crt-green/90 transition-all border-2 border-crt-green hover:shadow-[0_0_40px_rgba(51,255,51,0.8)] animate-pulse-slow"
				>
					&gt; LAUNCH TERMINAL_
				</button>
			</div>
		</section>

		<!-- Minimal Footer -->
		<footer class="border-t border-crt-green/20 py-12 px-6">
			<div class="max-w-6xl mx-auto">
				<div class="grid md:grid-cols-4 gap-8 mb-8 text-sm">
					<div>
						<div class="font-bold mb-3 text-crt-green/40">LEARN</div>
						<div class="space-y-2 text-crt-green/60">
							<a href="/features" class="block hover:text-crt-green">Features</a>
							<a href="/how-it-works" class="block hover:text-crt-green">How It Works</a>
							<a href="/docs" class="block hover:text-crt-green">Documentation</a>
						</div>
					</div>
					<div>
						<div class="font-bold mb-3 text-crt-green/40">SAFETY</div>
						<div class="space-y-2 text-crt-green/60">
							<a href="/security" class="block hover:text-crt-green">Security Guide</a>
							<a href="/faq" class="block hover:text-crt-green">FAQ</a>
						</div>
					</div>
					<div>
						<div class="font-bold mb-3 text-crt-green/40">CONNECT</div>
						<div class="space-y-2 text-crt-green/60">
							<a href="https://x.com/CobolClaw" target="_blank" class="block hover:text-crt-green">X (Twitter)</a>
						</div>
					</div>
					<div>
						<div class="font-bold mb-3 text-crt-green/40">START</div>
						<div class="space-y-2 text-crt-green/60">
							<button on:click={handleLaunch} class="block hover:text-crt-green text-left">Launch Terminal</button>
						</div>
					</div>
				</div>

				<div class="text-center pt-8 border-t border-crt-green/20 text-xs text-crt-green/40">
					<p class="mb-2">2025 COBOLCLAW. Vintage vibes, modern tech.</p>
					<p>Not financial advice. Trade at your own risk. Seriously.</p>
				</div>
			</div>
		</footer>
	</div>
{/if}

<GlitchTransition active={glitching} />

<style>
	/* Boot sequence styles */
	.boot-sequence {
		font-family: 'Share Tech Mono', 'IBM Plex Mono', monospace;
		text-shadow: 0 0 8px var(--crt-green-glow);
	}

	.boot-text {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.skip-button {
		cursor: pointer;
		user-select: none;
	}

	/* Scanline effect */
	.scanline {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(to bottom, transparent, rgba(51, 255, 51, 0.4), transparent);
		animation: scanline 8s linear infinite;
		pointer-events: none;
		z-index: 9999;
	}

	@keyframes scanline {
		from { transform: translateY(0); }
		to { transform: translateY(100vh); }
	}

	/* CRT overlay */
	.crt-overlay {
		position: fixed;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.1),
			rgba(0, 0, 0, 0.1) 1px,
			transparent 1px,
			transparent 2px
		);
		pointer-events: none;
		z-index: 9998;
		opacity: 0.3;
	}

	/* Animations */
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateX(-4px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	.animate-blink {
		animation: blink 1s infinite;
	}

	@keyframes pulse-slow {
		0%, 100% {
			box-shadow: 0 0 20px rgba(51, 255, 51, 0.3);
		}
		50% {
			box-shadow: 0 0 40px rgba(51, 255, 51, 0.6);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 3s ease-in-out infinite;
	}

	/* Code style */
	code {
		padding: 2px 6px;
		background: rgba(51, 255, 51, 0.1);
		border: 1px solid rgba(51, 255, 51, 0.2);
		border-radius: 2px;
	}
</style>
