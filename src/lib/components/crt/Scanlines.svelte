<script lang="ts">
	// Scanline overlay component
	// This creates the CRT scanline effect that appears over the entire screen
</script>

<div class="scanlines pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true"></div>

<style>
	/* The scanlines are actually handled by body::after in app.css */
	/* This component serves as a marker and can be enhanced with additional effects */
</style>
