<script lang="ts">
	import { enhance } from '$app/forms';
	import type { IntradaySignal } from '../../../generated/prisma/client';

	const SIGNAL_OPTIONS = [
		'VWAP_INTERACTION',
		'LIQUIDITY_SWEEP',
		'VOLUME_EXPANSION',
		'BREAK_OF_STRUCTURE',
		'ORB'
	] as const;

	const SIGNAL_LABELS: Record<(typeof SIGNAL_OPTIONS)[number], string> = {
		VWAP_INTERACTION: 'VWAP Interaction',
		LIQUIDITY_SWEEP: 'Liquidity Sweep',
		VOLUME_EXPANSION: 'Volume Expansion',
		BREAK_OF_STRUCTURE: 'Break of Structure',
		ORB: 'Opening Range Breakout'
	};

	let {
		sessionId,
		signals
	}: {
		sessionId: string;
		signals: IntradaySignal[];
	} = $props();

	let showAddForm = $state(false);
	let newSignalType = $state<(typeof SIGNAL_OPTIONS)[number]>(SIGNAL_OPTIONS[0]);
	let newDescription = $state('');

	function formatTime(date: Date): string {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: false
		});
	}
</script>

<div class="card bg-base-200 shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between">
			<h2 class="card-title text-sm font-semibold uppercase tracking-wider text-base-content/50">
				Execution Layer
			</h2>
			<button
				type="button"
				class="btn btn-ghost btn-xs"
				onclick={() => (showAddForm = !showAddForm)}
			>
				{showAddForm ? 'Cancel' : '+ Add Signal'}
			</button>
		</div>

		<div class="mt-3 space-y-3">
			{#if showAddForm}
				<form
					method="POST"
					action="?/addSignal"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							showAddForm = false;
							newDescription = '';
						};
					}}
					class="flex flex-wrap items-end gap-2"
				>
					<input type="hidden" name="sessionId" value={sessionId} />

					<div class="form-control flex-1 min-w-40">
						<label for="add-signal-type" class="label py-0">
							<span class="label-text text-xs">Signal Type</span>
						</label>
						<select
							id="add-signal-type"
							name="signalType"
							class="select select-xs select-bordered w-full"
							bind:value={newSignalType}
							required
						>
							{#each SIGNAL_OPTIONS as opt}
								<option value={opt}>{SIGNAL_LABELS[opt]}</option>
							{/each}
						</select>
					</div>
					<div class="form-control flex-[2] min-w-48">
						<label for="add-signal-desc" class="label py-0">
							<span class="label-text text-xs">Description (optional)</span>
						</label>
						<input
							id="add-signal-desc"
							type="text"
							name="description"
							class="input input-xs input-bordered w-full"
							placeholder="e.g. Price rejected at VWAP"
							bind:value={newDescription}
						/>
					</div>
					<button type="submit" class="btn btn-primary btn-xs">Add</button>
				</form>
			{/if}

			{#if signals.length > 0}
				<ul class="space-y-2">
					{#each signals as signal (signal.id)}
						<li class="flex items-start justify-between gap-2 rounded-lg bg-base-300/50 px-3 py-2">
							<div class="min-w-0 flex-1">
								<span class="badge badge-sm badge-outline"
								>{SIGNAL_LABELS[signal.signalType as (typeof SIGNAL_OPTIONS)[number]] ??
									signal.signalType}</span
							>
								<span class="text-xs text-base-content/50 ml-2">{formatTime(signal.timestamp)}</span>
								{#if signal.description}
									<p class="mt-1 text-sm text-base-content/80">{signal.description}</p>
								{/if}
							</div>
							<form
								method="POST"
								action="?/deleteSignal"
								use:enhance
								class="shrink-0"
							>
								<input type="hidden" name="signalId" value={signal.id} />
								<button type="submit" class="btn btn-ghost btn-xs text-error" title="Delete signal">
									✕
								</button>
							</form>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/40 italic">
					{showAddForm ? 'Add your first signal above.' : 'No signals logged yet. Click "+ Add Signal" to log confirmation signals during the session.'}
				</p>
			{/if}
		</div>
	</div>
</div>
