<script lang="ts">
	import { enhance } from '$app/forms';
	import type { MacroIndicator } from '../../../generated/prisma/client.js';
	import {
		calculateRiskScore,
		interpretationColor,
		INDICATOR_LABELS,
		ALL_INDICATORS,
		type RiskScoreResult
	} from '$lib/macro';

	let {
		sessionId,
		indicators
	}: {
		sessionId: string;
		indicators: MacroIndicator[];
	} = $props();

	let editing = $state(false);

	const indicatorMap = $derived(new Map(indicators.map((ind) => [ind.indicator, ind])));

	const formValues = $state(
		Object.fromEntries(
			ALL_INDICATORS.flatMap((ind) => {
				const existing = indicators.find((i) => i.indicator === ind);
				return [
					[`${ind}_value`, existing?.value?.toString() ?? ''],
					[`${ind}_prev`, existing?.previousValue?.toString() ?? '']
				];
			})
		)
	);

	const riskResult: RiskScoreResult | null = $derived.by(() => {
		if (indicators.length === 0) return null;
		return calculateRiskScore(
			indicators.map((ind) => ({
				indicator: ind.indicator,
				value: ind.value,
				previousValue: ind.previousValue
			}))
		);
	});

	function directionArrow(value: number, prev: number): string {
		if (value > prev) return '↑';
		if (value < prev) return '↓';
		return '→';
	}

	function directionClass(value: number, prev: number): string {
		if (value > prev) return 'text-error';
		if (value < prev) return 'text-success';
		return 'text-base-content/50';
	}
</script>

<div class="card bg-base-200 shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between">
			<h2 class="card-title text-sm font-semibold uppercase tracking-wider text-base-content/50">
				Macro Layer
			</h2>
			<div class="flex items-center gap-2">
				{#if riskResult}
					<div class="badge {interpretationColor(riskResult.interpretation)} badge-sm font-mono">
						Risk: {riskResult.score}/5
					</div>
					<div
						class="badge {interpretationColor(riskResult.interpretation)} badge-outline badge-sm"
					>
						{riskResult.interpretation.replace('_', '-')}
					</div>
				{:else}
					<div class="badge badge-ghost badge-sm">Risk Score: --</div>
				{/if}
			</div>
		</div>

		<div class="mt-3">
			{#if !editing}
				{#if indicators.length > 0}
					<div class="overflow-x-auto">
						<table class="table table-xs">
							<thead>
								<tr class="text-base-content/40">
									<th>Indicator</th>
									<th class="text-right">Prev</th>
									<th class="text-right">Current</th>
									<th class="text-center">Δ</th>
									<th class="text-center">Risk-Off</th>
								</tr>
							</thead>
							<tbody>
								{#each ALL_INDICATORS as ind}
									{@const data = indicatorMap.get(ind)}
									{#if data}
										<tr>
											<td class="font-medium">{INDICATOR_LABELS[ind]}</td>
											<td class="text-right font-mono text-base-content/60">
												{data.previousValue.toFixed(2)}
											</td>
											<td class="text-right font-mono">
												{data.value.toFixed(2)}
											</td>
											<td
												class="text-center text-lg {directionClass(data.value, data.previousValue)}"
											>
												{directionArrow(data.value, data.previousValue)}
											</td>
											<td class="text-center">
												{#if data.isRiskOff}
													<span class="badge badge-error badge-xs">⚠</span>
												{:else}
													<span class="badge badge-success badge-xs">✓</span>
												{/if}
											</td>
										</tr>
									{/if}
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="text-sm text-base-content/40 italic">No macro data entered for this session</p>
				{/if}

				<button class="btn btn-outline btn-sm mt-3" onclick={() => (editing = true)}>
					{indicators.length > 0 ? 'Edit Indicators' : 'Enter Indicators'}
				</button>
			{:else}
				<form
					method="POST"
					action="?/saveMacro"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							editing = false;
						};
					}}
				>
					<input type="hidden" name="sessionId" value={sessionId} />

					<div class="overflow-x-auto">
						<table class="table table-xs">
							<thead>
								<tr class="text-base-content/40">
									<th>Indicator</th>
									<th class="text-right">Previous</th>
									<th class="text-right">Current</th>
								</tr>
							</thead>
							<tbody>
								{#each ALL_INDICATORS as ind}
									<tr>
										<td class="font-medium">{INDICATOR_LABELS[ind]}</td>
										<td>
											<input
												type="number"
												step="any"
												name="{ind}_prev"
												class="input input-xs input-bordered w-24 text-right font-mono"
												placeholder="0.00"
												bind:value={formValues[`${ind}_prev`]}
											/>
										</td>
										<td>
											<input
												type="number"
												step="any"
												name="{ind}_value"
												class="input input-xs input-bordered w-24 text-right font-mono"
												placeholder="0.00"
												bind:value={formValues[`${ind}_value`]}
											/>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="flex gap-2 mt-3">
						<button type="submit" class="btn btn-primary btn-sm">Save</button>
						<button type="button" class="btn btn-ghost btn-sm" onclick={() => (editing = false)}>
							Cancel
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
