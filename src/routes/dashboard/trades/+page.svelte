<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardPanel from '$lib/components/DashboardPanel.svelte';

	const QUALIFICATION_CHECKLIST = [
		'Aligned with bias?',
		'Clear structure?',
		'Volume expanding?',
		'Logical stop?',
		'Near key level?'
	];

	let { data } = $props();

	let showAddForm = $state(false);
	let editingExitId = $state<string | null>(null);

	const trades = $derived(data.session.trades ?? []);
	const tradeCount = $derived(trades.length);
	const maxTrades = 2;

	function formatTime(date: Date): string {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: false
		});
	}

	function formatPrice(n: number): string {
		return n.toFixed(2);
	}
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-bold">Trade Log</h1>

	<DashboardPanel title="Trade Qualification">
		<div class="space-y-2">
			<p class="text-sm text-base-content/60">
				Before entering a trade, evaluate: aligned with bias? clear structure? volume expanding? logical stop? near key level?
			</p>
			<ul class="list-disc list-inside text-sm text-base-content/50 space-y-1">
				{#each QUALIFICATION_CHECKLIST as item}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</DashboardPanel>

	<DashboardPanel title="Today's Trades">
		<div class="flex justify-between items-center mb-3">
			<span class="text-sm text-base-content/50">EOD recording — log trades after the session</span>
			<button
				type="button"
				class="btn btn-outline btn-sm"
				onclick={() => (showAddForm = !showAddForm)}
				disabled={tradeCount >= maxTrades}
			>
				{showAddForm ? 'Cancel' : '+ Add Trade'}
			</button>
		</div>

		{#if showAddForm}
			<form
				method="POST"
				action="?/createTrade"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showAddForm = false;
					};
				}}
				class="card bg-base-300/50 p-4 mb-4 space-y-3"
			>
				<input type="hidden" name="sessionId" value={data.session.id} />

				<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
					<div class="form-control">
						<label for="add-direction" class="label py-0"><span class="label-text text-xs">Direction</span></label>
						<select id="add-direction" name="direction" class="select select-bordered select-sm w-full">
							<option value="LONG">Long</option>
							<option value="SHORT">Short</option>
						</select>
					</div>
					<div class="form-control">
						<label for="add-entry" class="label py-0"><span class="label-text text-xs">Entry</span></label>
						<input id="add-entry" type="number" step="any" name="entryPrice" class="input input-bordered input-sm w-full" required />
					</div>
					<div class="form-control">
						<label for="add-stop" class="label py-0"><span class="label-text text-xs">Stop</span></label>
						<input id="add-stop" type="number" step="any" name="stopPrice" class="input input-bordered input-sm w-full" required />
					</div>
					<div class="form-control">
						<label for="add-score" class="label py-0"><span class="label-text text-xs">Qual Score (0-5)</span></label>
						<input id="add-score" type="number" min="0" max="5" name="qualificationScore" class="input input-bordered input-sm w-full" value="3" required />
					</div>
				</div>

				<div class="flex flex-wrap gap-4 items-center">
					<label class="label cursor-pointer gap-2">
						<input type="checkbox" name="isAlignedWithBias" value="true" class="checkbox checkbox-sm" />
						<span class="label-text text-sm">Aligned with bias</span>
					</label>
				</div>

				<div class="form-control">
					<label for="add-notes" class="label py-0"><span class="label-text text-xs">Notes</span></label>
					<input id="add-notes" type="text" name="notes" class="input input-bordered input-sm w-full" placeholder="Optional notes" />
				</div>

				<div class="flex gap-2">
					<button type="submit" class="btn btn-primary btn-sm">Add Trade</button>
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => (showAddForm = false)}>Cancel</button>
				</div>
			</form>
		{/if}

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
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#if trades.length === 0}
						<tr>
							<td colspan="8" class="text-center text-base-content/30 italic py-8">No trades yet</td>
						</tr>
					{:else}
						{#each trades as trade (trade.id)}
							<tr>
								<td class="font-mono text-sm">{formatTime(trade.timestamp)}</td>
								<td>
									<span class="badge badge-sm {trade.direction === 'LONG' ? 'badge-success' : 'badge-error'}">
										{trade.direction}
									</span>
								</td>
								<td class="font-mono">{formatPrice(trade.entryPrice)}</td>
								<td class="font-mono">
									{#if editingExitId === trade.id}
										<form
											method="POST"
											action="?/updateTrade"
											use:enhance={() => {
												return async ({ update }) => {
													await update();
													editingExitId = null;
												};
											}}
											class="inline-flex gap-1"
										>
											<input type="hidden" name="tradeId" value={trade.id} />
											<input
												type="number"
												step="any"
												name="exitPrice"
												class="input input-xs input-bordered w-20 font-mono"
												placeholder="Exit"
											/>
											<button type="submit" class="btn btn-ghost btn-xs">Save</button>
											<button type="button" class="btn btn-ghost btn-xs" onclick={() => (editingExitId = null)}>Cancel</button>
										</form>
									{:else if trade.exitPrice != null}
										{formatPrice(trade.exitPrice)}
									{:else}
										<button type="button" class="link link-hover text-xs" onclick={() => (editingExitId = trade.id)}>
											Add exit
										</button>
									{/if}
								</td>
								<td class="font-mono">{formatPrice(trade.stopPrice)}</td>
								<td>
									{#if trade.isAlignedWithBias}
										<span class="badge badge-success badge-xs">Yes</span>
									{:else}
										<span class="badge badge-ghost badge-xs">No</span>
									{/if}
								</td>
								<td>{trade.qualificationScore}/5</td>
								<td>
									<form method="POST" action="?/deleteTrade" class="inline" use:enhance>
										<input type="hidden" name="tradeId" value={trade.id} />
										<button type="submit" class="btn btn-ghost btn-xs text-error">Delete</button>
									</form>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</DashboardPanel>

	<DashboardPanel title="Risk Management">
		<div class="flex gap-6 text-sm">
			<div>
				<span class="text-base-content/50">Trades today:</span>
				<span class="font-semibold">{tradeCount} / {maxTrades}</span>
			</div>
			<div>
				<span class="text-base-content/50">Daily P&L:</span>
				<span class="font-semibold">
					$0.00
				</span>
			</div>
		</div>
	</DashboardPanel>
</div>
