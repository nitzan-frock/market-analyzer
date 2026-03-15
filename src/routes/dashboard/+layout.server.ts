import { sessionService } from '$lib/server/services/session.service';
import { pullKeyLevels } from '$lib/server/services/keyLevels.service';
import { hasPolygonApiKey } from '$lib/server/config';
import { calculateDailyBias } from '$lib/macro';
import type { LayoutServerLoad } from './$types';

/** Current calendar date in US Eastern (matches key-levels session windows). */
function getTodayET(): string {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/New_York',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(new Date());
	const year = parts.find((p) => p.type === 'year')?.value ?? '';
	const month = parts.find((p) => p.type === 'month')?.value ?? '';
	const day = parts.find((p) => p.type === 'day')?.value ?? '';
	return `${year}-${month}-${day}`;
}

export const load: LayoutServerLoad = async ({ url }) => {
	const dateParam = url.searchParams.get('date');
	const dateStr = dateParam ?? getTodayET();

	const date = new Date(dateStr + 'T00:00:00');

	await sessionService.getOrCreate(date);
	let session = await sessionService.getByDate(date);

	if (session && hasPolygonApiKey()) {
		await pullKeyLevels(session.id, dateStr);
		session = await sessionService.getByDate(date);
	}

	// Compute daily bias when we have both risk score and overnight structure
	if (session && session.riskScore != null && session.overnightStructure) {
		const biasResult = calculateDailyBias(
			session.riskScore,
			session.overnightStructure.esTrend,
			session.overnightStructure.nqTrend
		);
		if (biasResult) {
			await sessionService.updateBias(session.id, {
				riskScore: session.riskScore,
				dailyBias: biasResult.bias,
				confidenceLevel: biasResult.confidenceLevel
			});
			session = await sessionService.getByDate(date);
		}
	}

	return {
		session: session!,
		selectedDate: dateStr
	};
};
