<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { children, data } = $props();

	let selectedDate = $derived(data.selectedDate);

	type Route = '/dashboard' | '/dashboard/trades' | '/dashboard/review';

	const navItems: { href: Route; label: string; icon: string }[] = [
		{ href: '/dashboard', label: 'Dashboard', icon: '◫' },
		{ href: '/dashboard/trades', label: 'Trades', icon: '⇄' },
		{ href: '/dashboard/review', label: 'Review', icon: '✎' }
	];

	function isActive(href: Route): boolean {
		const resolved = resolve(href);
		if (href === '/dashboard') return page.url.pathname === resolved;
		return page.url.pathname.startsWith(resolved);
	}

	function onDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		selectedDate = target.value;
		const url = new URL(page.url);
		url.searchParams.set('date', selectedDate);
		goto(resolve(`${url.pathname}?${url.searchParams}` as Route), { invalidateAll: true });
	}
</script>

<div class="flex h-screen">
	<aside class="w-56 shrink-0 border-r border-base-300 bg-base-200 flex flex-col">
		<div class="p-4 border-b border-base-300">
			<a href={resolve('/')} class="text-lg font-bold tracking-tight">Trading Context</a>
		</div>

		<nav class="flex-1 p-2">
			<ul class="menu menu-sm gap-1">
				{#each navItems as item (item.href)}
					<li>
						<a href={resolve(item.href)} class={isActive(item.href) ? 'active' : ''}>
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
				value={selectedDate}
				onchange={onDateChange}
			/>
		</div>
	</aside>

	<main class="flex-1 overflow-y-auto p-6">
		{@render children()}
	</main>
</div>
