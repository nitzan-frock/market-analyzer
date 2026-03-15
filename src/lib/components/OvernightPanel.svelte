<script lang="ts">
	import { enhance } from '$app/forms';
	import type { OvernightStructure } from '../../../generated/prisma/client';

	const TREND_OPTIONS = ['UP', 'DOWN', 'FLAT', 'MIXED'] as const;

	let {
		sessionId,
		selectedDate,
		overnight
	}: {
		sessionId: string;
		selectedDate: string;
		overnight: OvernightStructure | null;
	} = $props();

	let editing = $state(false);

	const formValues = $state({
		esTrend: '',
		nqTrend: '',
		preMarketVwap: '',
		overnightHigh: '',
		overnightLow: '',
		keyLevels: '',
		majorNews: '',
		scheduledReports: ''
	});

	$effect(() => {
		if (editing) {
			formValues.esTrend = overnight?.esTrend ?? '';
			formValues.nqTrend = overnight?.nqTrend ?? '';
			formValues.preMarketVwap = overnight?.preMarketVwap?.toString() ?? '';
			formValues.overnightHigh = overnight?.overnightHigh?.toString() ?? '';
			formValues.overnightLow = overnight?.overnightLow?.toString() ?? '';
			formValues.keyLevels = Array.isArray(overnight?.keyLevels)
				? (overnight!.keyLevels as number[]).join(', ')
				: '';
			formValues.majorNews = overnight?.majorNews ?? '';
			formValues.scheduledReports = overnight?.scheduledReports ?? '';
		}
	});

	function parseKeyLevels(s: string): number[] {
		return s
			.split(/[\s,]+/)
			.map((v) => parseFloat(v.trim()))
			.filter((n) => !isNaN(n));
	}
</script>

<div class="card bg-base-200 shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between">
			<h2 class="card-title text-sm font-semibold uppercase tracking-wider text-base-content/50">
				Market Structure
			</h2>
			{#if overnight}
				<div class="badge badge-outline badge-sm">
					{overnight.esTrend} / {overnight.nqTrend}
				</div>
			{/if}
		</div>

		<div class="mt-3">
			{#if !editing}
				{#if overnight}
					<div class="space-y-2 text-sm">
						<div class="flex gap-4">
							<span>ES: <span class="font-mono font-medium">{overnight.esTrend}</span></span>
							<span>NQ: <span class="font-mono font-medium">{overnight.nqTrend}</span></span>
						</div>
						<div class="text-base-content/50 text-xs uppercase tracking-wider mt-1">Key levels (body H/L)</div>
						<div class="flex flex-wrap gap-x-4 gap-y-1 text-base-content/70">
							<span>Prev day: <span class="font-mono">{overnight.previousDayHigh?.toFixed(2) ?? '--'}</span> / <span class="font-mono">{overnight.previousDayLow?.toFixed(2) ?? '--'}</span></span>
							<span>Overnight (PMH/PML): <span class="font-mono">{overnight.overnightHigh?.toFixed(2) ?? '--'}</span> / <span class="font-mono">{overnight.overnightLow?.toFixed(2) ?? '--'}</span></span>
							<span>Premarket: <span class="font-mono">{overnight.premarketHigh?.toFixed(2) ?? '--'}</span> / <span class="font-mono">{overnight.premarketLow?.toFixed(2) ?? '--'}</span></span>
						</div>
						<div class="flex gap-4 text-base-content/70">
							<span>VWAP: <span class="font-mono">{overnight.preMarketVwap?.toFixed(2) ?? '--'}</span></span>
						</div>
						{#if Array.isArray(overnight.keyLevels) && (overnight.keyLevels as number[]).length > 0}
							<div>
								<span class="text-base-content/50">Key Levels: </span>
								<span class="font-mono">{(overnight.keyLevels as number[]).join(', ')}</span>
							</div>
						{/if}
						{#if overnight.majorNews}
							<div>
								<span class="text-base-content/50">News: </span>
								<span>{overnight.majorNews}</span>
							</div>
						{/if}
						{#if overnight.scheduledReports}
							<div>
								<span class="text-base-content/50">Reports: </span>
								<span>{overnight.scheduledReports}</span>
							</div>
						{/if}
					</div>
				{:else}
					<p class="text-sm text-base-content/40 italic">No overnight structure entered for this session</p>
				{/if}

				<div class="flex flex-wrap gap-2 mt-3">
					<button class="btn btn-outline btn-sm" onclick={() => (editing = true)}>
						{overnight ? 'Edit Structure' : 'Enter Structure'}
					</button>
					<form method="POST" action="?/refreshKeyLevels" use:enhance>
						<input type="hidden" name="sessionId" value={sessionId} />
						<input type="hidden" name="date" value={selectedDate} />
						<button type="submit" class="btn btn-ghost btn-sm">
							Refresh key levels
						</button>
					</form>
				</div>
			{:else}
				<form
					method="POST"
					action="?/saveOvernight"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							editing = false;
						};
					}}
				>
					<input type="hidden" name="sessionId" value={sessionId} />

					<div class="space-y-3">
						<div class="flex gap-4">
							<div class="form-control flex-1">
								<label for="esTrend" class="label py-0">
									<span class="label-text text-xs">ES Trend</span>
								</label>
								<select
									id="esTrend"
									name="esTrend"
									class="select select-xs select-bordered w-full"
									bind:value={formValues.esTrend}
									required
								>
									<option value="">Select</option>
									{#each TREND_OPTIONS as opt}
										<option value={opt}>{opt}</option>
									{/each}
								</select>
							</div>
							<div class="form-control flex-1">
								<label for="nqTrend" class="label py-0">
									<span class="label-text text-xs">NQ Trend</span>
								</label>
								<select
									id="nqTrend"
									name="nqTrend"
									class="select select-xs select-bordered w-full"
									bind:value={formValues.nqTrend}
									required
								>
									<option value="">Select</option>
									{#each TREND_OPTIONS as opt}
										<option value={opt}>{opt}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="flex gap-2">
							<div class="form-control flex-1">
								<label for="preMarketVwap" class="label py-0">
									<span class="label-text text-xs">Pre-Market VWAP</span>
								</label>
								<input
									id="preMarketVwap"
									type="number"
									step="any"
									name="preMarketVwap"
									class="input input-xs input-bordered w-full font-mono"
									placeholder="0.00"
									bind:value={formValues.preMarketVwap}
								/>
							</div>
							<div class="form-control flex-1">
								<label for="overnightHigh" class="label py-0">
									<span class="label-text text-xs">Overnight High</span>
								</label>
								<input
									id="overnightHigh"
									type="number"
									step="any"
									name="overnightHigh"
									class="input input-xs input-bordered w-full font-mono"
									placeholder="0.00"
									bind:value={formValues.overnightHigh}
								/>
							</div>
							<div class="form-control flex-1">
								<label for="overnightLow" class="label py-0">
									<span class="label-text text-xs">Overnight Low</span>
								</label>
								<input
									id="overnightLow"
									type="number"
									step="any"
									name="overnightLow"
									class="input input-xs input-bordered w-full font-mono"
									placeholder="0.00"
									bind:value={formValues.overnightLow}
								/>
							</div>
						</div>

						<div class="form-control">
							<label for="keyLevels" class="label py-0">
								<span class="label-text text-xs">Key Levels (comma-separated)</span>
							</label>
							<input
								id="keyLevels"
								type="text"
								name="keyLevels"
								class="input input-xs input-bordered w-full font-mono"
								placeholder="436.0, 438.25, 440.0"
								bind:value={formValues.keyLevels}
							/>
						</div>

						<div class="form-control">
							<label for="majorNews" class="label py-0">
								<span class="label-text text-xs">Major News</span>
							</label>
							<input
								id="majorNews"
								type="text"
								name="majorNews"
								class="input input-xs input-bordered w-full"
								placeholder="Overnight catalysts..."
								bind:value={formValues.majorNews}
							/>
						</div>

						<div class="form-control">
							<label for="scheduledReports" class="label py-0">
								<span class="label-text text-xs">Scheduled Reports</span>
							</label>
							<input
								id="scheduledReports"
								type="text"
								name="scheduledReports"
								class="input input-xs input-bordered w-full"
								placeholder="Economic reports, times..."
								bind:value={formValues.scheduledReports}
							/>
						</div>

						<div class="flex gap-2 mt-3">
							<button type="submit" class="btn btn-primary btn-sm">Save</button>
							<button type="button" class="btn btn-ghost btn-sm" onclick={() => (editing = false)}>
								Cancel
							</button>
						</div>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
