<script lang="ts">
	import DashboardPanel from '$lib/components/DashboardPanel.svelte';
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-bold">Trade Log</h1>

	<DashboardPanel title="Trade Qualification">
		<p class="text-sm text-base-content/50">
			Pre-trade checklist and qualification scoring will appear here.
		</p>
	</DashboardPanel>

	<DashboardPanel title="Today's Trades">
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr>
						<th>Time</th>
						<th>Direction</th>
						<th>Entry</th>
						<th>Exit</th>
						<th>Stop</th>
						<th>Aligned</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colspan="7" class="text-center text-base-content/30 italic">No trades yet</td>
					</tr>
				</tbody>
			</table>
		</div>
	</DashboardPanel>

	<DashboardPanel title="Risk Management">
		<div class="flex gap-6 text-sm">
			<div>
				<span class="text-base-content/50">Trades today:</span>
				<span class="font-semibold">0 / 2</span>
			</div>
			<div>
				<span class="text-base-content/50">Daily P&L:</span>
				<span class="font-semibold">$0.00</span>
			</div>
		</div>
	</DashboardPanel>
</div>
