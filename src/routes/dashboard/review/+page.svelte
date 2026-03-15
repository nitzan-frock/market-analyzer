<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardPanel from '$lib/components/DashboardPanel.svelte';
	import type { DayType, PostTradeReview } from '../../../../generated/prisma/client';

	const DAY_TYPE_OPTIONS: { value: DayType; label: string }[] = [
		{ value: 'TREND_UP', label: 'Trend Up' },
		{ value: 'TREND_DOWN', label: 'Trend Down' },
		{ value: 'RANGE', label: 'Range' },
		{ value: 'GRIND', label: 'Grind' }
	];

	let { data } = $props();

	const review = $derived<PostTradeReview | null>(data.session.postTradeReview ?? null);
	const pastReviews = $derived([]); // Could fetch from postTradeReviewService.getMany() in page load
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-bold">Post-Trade Review</h1>

	<DashboardPanel title="Session Review">
		<form
			method="POST"
			action="?/saveReview"
			use:enhance
			class="space-y-4"
		>
			<input type="hidden" name="sessionId" value={data.session.id} />

			<div class="form-control w-full max-w-xs">
				<label class="label" for="day-type">
					<span class="label-text">Day Type</span>
				</label>
				<select id="day-type" name="dayType" class="select select-bordered select-sm w-full" required>
					<option value="" disabled selected={!review?.dayType}>Select day type</option>
					{#each DAY_TYPE_OPTIONS as opt}
						<option value={opt.value} selected={review?.dayType === opt.value}>
							{opt.label}
						</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-6 flex-wrap">
				<label class="label cursor-pointer gap-2">
					<input
						type="checkbox"
						name="macroAligned"
						value="true"
						class="toggle toggle-sm toggle-primary"
						checked={review?.macroAligned ?? false}
					/>
					<span class="label-text text-sm">Macro aligned with price?</span>
				</label>
				<label class="label cursor-pointer gap-2">
					<input
						type="checkbox"
						name="tradesFollowedBias"
						value="true"
						class="toggle toggle-sm toggle-primary"
						checked={review?.tradesFollowedBias ?? false}
					/>
					<span class="label-text text-sm">Trades followed bias?</span>
				</label>
			</div>

			<div class="form-control">
				<label class="label" for="effective-signals">
					<span class="label-text">What signals were effective?</span>
				</label>
				<textarea
					id="effective-signals"
					name="effectiveSignals"
					class="textarea textarea-bordered h-20"
					placeholder="Describe which signals worked well today..."
				>{review?.effectiveSignals ?? ''}</textarea>
			</div>

			<div class="form-control">
				<label class="label" for="mistakes">
					<span class="label-text">What mistakes occurred?</span>
				</label>
				<textarea
					id="mistakes"
					name="mistakes"
					class="textarea textarea-bordered h-20"
					placeholder="Note any mistakes or areas for improvement..."
				>{review?.mistakes ?? ''}</textarea>
			</div>

			<button type="submit" class="btn btn-primary btn-sm">Save Review</button>
		</form>
	</DashboardPanel>

	<DashboardPanel title="Review History">
		<p class="text-sm text-base-content/50 italic">Past reviews can be accessed by changing the session date in the sidebar.</p>
	</DashboardPanel>
</div>
