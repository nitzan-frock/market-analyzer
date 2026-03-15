<script lang="ts">
	import DashboardPanel from '$lib/components/DashboardPanel.svelte';
	import MacroPanel from '$lib/components/MacroPanel.svelte';
	import OvernightPanel from '$lib/components/OvernightPanel.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
	<MacroPanel sessionId={data.session.id} indicators={data.session.macroIndicators} />

	<OvernightPanel
		sessionId={data.session.id}
		selectedDate={data.selectedDate}
		overnight={data.session.overnightStructure}
	/>

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
