<script lang="ts">
	import Scanlines from './Scanlines.svelte';
	import { settings } from '$lib/stores/settings';

	// Optional curvature effect
	let enableCurvature = false;

	// Subscribe to settings to check if CRT effects are enabled
	$: crtEnabled = $settings.crtEffects;
</script>

<div
	class="crt-container relative min-h-screen w-full overflow-x-hidden"
	class:crt-curvature={enableCurvature && crtEnabled}
	data-theme={$settings.theme}
>
	{#if crtEnabled}
		<Scanlines />
	{/if}

	<div class="crt-content relative z-10 min-h-screen">
		<slot />
	</div>
</div>

<style>
	.crt-container {
		background-color: var(--bg-black);
		color: var(--crt-green);
	}

	/* Ensure content is properly layered */
	.crt-content {
		position: relative;
	}
</style>
