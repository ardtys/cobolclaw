<script lang="ts">
	// Blinking block cursor component
	// Used in terminal input to show cursor position
	export let visible: boolean = true;
</script>

{#if visible}
	<span class="cursor-block" aria-hidden="true">█</span>
{/if}

<style>
	/* Cursor styles are defined in app.css */
</style>
