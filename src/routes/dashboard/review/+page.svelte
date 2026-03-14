<script lang="ts">
	import DashboardPanel from '$lib/components/DashboardPanel.svelte';
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-bold">Post-Trade Review</h1>

	<DashboardPanel title="Session Review">
		<div class="space-y-4">
			<div class="form-control w-full max-w-xs">
				<label class="label" for="day-type">
					<span class="label-text">Day Type</span>
				</label>
				<select id="day-type" class="select select-bordered select-sm w-full">
					<option disabled selected>Select day type</option>
					<option>Trend Up</option>
					<option>Trend Down</option>
					<option>Range</option>
					<option>Grind</option>
				</select>
			</div>

			<div class="flex gap-6">
				<label class="label cursor-pointer gap-2">
					<span class="label-text text-sm">Macro aligned with price?</span>
					<input type="checkbox" class="toggle toggle-sm toggle-primary" />
				</label>
				<label class="label cursor-pointer gap-2">
					<span class="label-text text-sm">Trades followed bias?</span>
					<input type="checkbox" class="toggle toggle-sm toggle-primary" />
				</label>
			</div>

			<div class="form-control">
				<label class="label" for="effective-signals">
					<span class="label-text">What signals were effective?</span>
				</label>
				<textarea
					id="effective-signals"
					class="textarea textarea-bordered h-20"
					placeholder="Describe which signals worked well today..."
				></textarea>
			</div>

			<div class="form-control">
				<label class="label" for="mistakes">
					<span class="label-text">What mistakes occurred?</span>
				</label>
				<textarea
					id="mistakes"
					class="textarea textarea-bordered h-20"
					placeholder="Note any mistakes or areas for improvement..."
				></textarea>
			</div>

			<button class="btn btn-primary btn-sm" disabled>Save Review</button>
		</div>
	</DashboardPanel>

	<DashboardPanel title="Review History">
		<p class="text-sm text-base-content/50 italic">Past reviews will appear here.</p>
	</DashboardPanel>
</div>
