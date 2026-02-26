<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let progress: number = 0; // 0-100
	export let animated: boolean = false;

	let displayProgress = 0;
	let animationInterval: NodeJS.Timeout;

	onMount(() => {
		if (animated) {
			// Animate from 0 to progress
			const duration = 2000; // 2 seconds
			const steps = 20;
			const increment = progress / steps;
			const intervalTime = duration / steps;

			let step = 0;
			animationInterval = setInterval(() => {
				step++;
				displayProgress = Math.min(progress, step * increment);

				if (step >= steps) {
					clearInterval(animationInterval);
				}
			}, intervalTime);
		} else {
			displayProgress = progress;
		}
	});

	onDestroy(() => {
		if (animationInterval) clearInterval(animationInterval);
	});

	$: filled = Math.round((displayProgress / 100) * 20);
	$: empty = 20 - filled;
	$: bar = '█'.repeat(filled) + '░'.repeat(empty);
</script>

<span class="progress-bar font-mono text-crt-green">
	{bar} {displayProgress.toFixed(0)}%
</span>

<style>
	.progress-bar {
		font-family: 'IBM Plex Mono', monospace;
		letter-spacing: 0;
		white-space: nowrap;
		text-shadow: 0 0 8px var(--crt-green-glow);
	}
</style>
