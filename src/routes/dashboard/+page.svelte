<script lang="ts">
	import DashboardPanel from '$lib/components/DashboardPanel.svelte';
	import MacroPanel from '$lib/components/MacroPanel.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
	<MacroPanel sessionId={data.session.id} indicators={data.session.macroIndicators} />

	<DashboardPanel title="Market Structure Layer">
		<div class="space-y-2">
			<p class="text-sm text-base-content/50">
				Futures trend, Overnight high/low, VWAP, Opening range
			</p>
			<div class="flex gap-4 text-sm">
				<span>PMH: <span class="text-base-content/40">--</span></span>
				<span>PML: <span class="text-base-content/40">--</span></span>
				<span>VWAP: <span class="text-base-content/40">--</span></span>
			</div>
		</div>
	</DashboardPanel>

	<DashboardPanel title="Execution Layer">
		<div class="space-y-2">
			<p class="text-sm text-base-content/50">
				Liquidity sweeps, Momentum expansion, Volume spikes, Break of structure
			</p>
			<p class="text-xs text-base-content/30 italic">Signals will appear here during the session</p>
		</div>
	</DashboardPanel>

	<DashboardPanel title="Decision Layer">
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium">Daily Bias</span>
				{#if data.session.dailyBias}
					<div class="badge badge-lg">{data.session.dailyBias}</div>
				{:else}
					<div class="badge badge-lg badge-ghost">Not Set</div>
				{/if}
			</div>
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium">Confidence</span>
				{#if data.session.confidenceLevel}
					<div class="badge badge-sm">{data.session.confidenceLevel}</div>
				{:else}
					<div class="badge badge-sm badge-ghost">--</div>
				{/if}
			</div>
			<p class="text-xs text-base-content/30 italic">
				Macro context + Market structure = Trade setup
			</p>
		</div>
	</DashboardPanel>
</div>
