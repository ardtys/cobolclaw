<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { typewriterLines } from '$lib/utils/typewriter';
	import GlitchTransition from '$lib/components/crt/GlitchTransition.svelte';

	let displayedLines: string[] = [];
	let showCursor = false;
	let canSkip = false;
	let skipping = false;
	let glitching = false;

	// Boot sequence lines with delays (in milliseconds)
	const bootLines = [
		{ delay: 0, text: '██████████████████████████████████████████████' },
		{ delay: 300, text: 'COBOLCLAW MAINFRAME SYSTEMS v1.0.0' },
		{ delay: 200, text: '(C) 2025 COBOLCLAW LABORATORIES' },
		{ delay: 300, text: '██████████████████████████████████████████████' },
		{ delay: 400, text: '' },
		{ delay: 300, text: 'PERFORMING SYSTEM DIAGNOSTICS...' },
		{ delay: 300, text: '> MEMORY CHECK............ 64K OK' },
		{ delay: 300, text: '> DISK ARRAY.............. ONLINE' },
		{ delay: 300, text: '> NETWORK MODULE.......... BLOCKCHAIN RPC CONNECTED' },
		{ delay: 300, text: `> CHAIN SYNC.............. BLOCK #${Math.floor(Math.random() * 1000000) + 285000000}` },
		{ delay: 300, text: '> CLAW ENGINE............. ARMED' },
		{ delay: 300, text: '' },
		{ delay: 200, text: 'ALL SYSTEMS NOMINAL.' },
		{ delay: 300, text: '' },
		{ delay: 200, text: 'INITIALIZING TERMINAL INTERFACE...' },
		{ delay: 300, text: '> LOADING TOKEN FEED.......... DONE' },
		{ delay: 300, text: '> LOADING WALLET MODULE.......... STANDBY' },
		{ delay: 200, text: '' },
		{ delay: 200, text: '============================================' },
		{ delay: 200, text: 'WARNING: PAST PERFORMANCE DOES NOT GUARANTEE' },
		{ delay: 200, text: 'FUTURE RESULTS. DYOR. NFA. CLAW AT OWN RISK.' },
		{ delay: 200, text: '============================================' },
		{ delay: 400, text: '' }
	];

	onMount(async () => {
		canSkip = true;

		// Run typewriter animation
		await typewriterLines(
			bootLines,
			(lineIndex, text) => {
				if (skipping) return;
				displayedLines[lineIndex] = text;
				displayedLines = [...displayedLines]; // Trigger reactivity
			},
			30
		);

		// Show the final prompt with cursor
		if (!skipping) {
			displayedLines = [...displayedLines, 'PRESS [ENTER] TO ACCESS TERMINAL'];
			showCursor = true;
		}
	});

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && showCursor && !glitching) {
			completeBootSequence();
		} else if (event.key === 'Escape' && canSkip && !glitching) {
			skipBootSequence();
		}
	}

	function skipBootSequence() {
		skipping = true;
		completeBootSequence();
	}

	function completeBootSequence() {
		if (glitching) return;

		glitching = true;

		// Trigger glitch effect
		setTimeout(() => {
			// Set boot flag
			if (typeof sessionStorage !== 'undefined') {
				sessionStorage.setItem('cobolclaw_boot_seen', 'true');
			}

			// Navigate to terminal
			goto('/terminal');
		}, 200);
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="boot-sequence min-h-screen bg-bg-black text-crt-green p-8 flex flex-col justify-center">
	<div class="boot-container max-w-4xl mx-auto font-display">
		<pre class="boot-text text-terminal-cmd leading-relaxed">
{#each displayedLines as line}
{line}
{/each}{#if showCursor}<span class="cursor-block">█</span>{/if}
		</pre>
	</div>

	<!-- Skip button -->
	{#if canSkip && !showCursor}
		<button
			type="button"
			on:click={skipBootSequence}
			class="skip-button fixed bottom-8 right-8 text-crt-green-dim text-xs hover:text-crt-green transition-colors"
		>
			[ESC] SKIP
		</button>
	{/if}
</div>

<GlitchTransition active={glitching} />

<style>
	.boot-sequence {
		font-family: 'Share Tech Mono', 'IBM Plex Mono', monospace;
		text-shadow: 0 0 8px var(--crt-green-glow);
	}

	.boot-text {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.skip-button {
		text-shadow: 0 0 6px var(--crt-green-glow);
		cursor: pointer;
		user-select: none;
	}

	.skip-button:hover {
		text-shadow: 0 0 12px var(--crt-green-glow);
	}

	@media (max-width: 768px) {
		.boot-text {
			font-size: 11px;
		}

		.boot-sequence {
			padding: 1rem;
		}
	}
</style>
