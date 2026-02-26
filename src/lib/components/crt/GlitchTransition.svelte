<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let duration: number = 200;
	export let active: boolean = false;

	let glitching = false;

	export function trigger() {
		glitching = true;
		setTimeout(() => {
			glitching = false;
		}, duration);
	}

	$: if (active) {
		trigger();
	}
</script>

{#if glitching}
	<div
		class="glitch-overlay fixed inset-0 z-[9997] pointer-events-none"
		transition:fade={{ duration: duration, easing: quintOut }}
	>
		<div class="glitch-effect absolute inset-0 bg-bg-black opacity-50"></div>
	</div>
{/if}

<style>
	.glitch-overlay {
		mix-blend-mode: screen;
	}
</style>
