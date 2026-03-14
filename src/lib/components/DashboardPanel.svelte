<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		children
	}: {
		title: string;
		children: Snippet;
	} = $props();
</script>

<div class="card bg-base-200 shadow-md">
	<div class="card-body p-4">
		<h2 class="card-title text-sm font-semibold uppercase tracking-wider text-base-content/50">
			{title}
		</h2>
		<div class="mt-2">
			{@render children()}
		</div>
	</div>
</div>
