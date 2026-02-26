<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import CRTScreen from '$lib/components/crt/CRTScreen.svelte';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<CRTScreen>
		<slot />
	</CRTScreen>
{:else}
	<div class="flex items-center justify-center min-h-screen bg-bg-black text-crt-green">
		<div class="animate-pulse">LOADING MAINFRAME...</div>
	</div>
{/if}
