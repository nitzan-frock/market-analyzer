<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	let selectedDate = $state(new Date().toISOString().split('T')[0]);

	const navItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: '◫' },
		{ href: '/dashboard/trades', label: 'Trades', icon: '⇄' },
		{ href: '/dashboard/review', label: 'Review', icon: '✎' }
	];

	function isActive(href: string): boolean {
		if (href === '/dashboard') return page.url.pathname === '/dashboard';
		return page.url.pathname.startsWith(href);
	}
</script>

<div class="flex h-screen">
	<aside class="w-56 shrink-0 border-r border-base-300 bg-base-200 flex flex-col">
		<div class="p-4 border-b border-base-300">
			<a href="/" class="text-lg font-bold tracking-tight">QQQ Dashboard</a>
		</div>

		<nav class="flex-1 p-2">
			<ul class="menu menu-sm gap-1">
				{#each navItems as item}
					<li>
						<a href={item.href} class={isActive(item.href) ? 'active' : ''}>
							<span class="text-base">{item.icon}</span>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="p-4 border-t border-base-300">
			<label class="label text-xs font-medium text-base-content/50" for="session-date">
				Session Date
			</label>
			<input
				id="session-date"
				type="date"
				class="input input-sm input-bordered w-full"
				bind:value={selectedDate}
			/>
		</div>
	</aside>

	<main class="flex-1 overflow-y-auto p-6">
		{@render children()}
	</main>
</div>
