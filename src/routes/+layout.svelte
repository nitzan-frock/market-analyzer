<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Trading Context Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-base-100 text-base-content">
	{@render children()}
</div>
