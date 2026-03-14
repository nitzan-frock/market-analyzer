import { fail } from '@sveltejs/kit';
import { macroIndicatorService } from '$lib/server/services/macroIndicator.service';
import { sessionService } from '$lib/server/services/session.service';
import { calculateRiskScore, ALL_INDICATORS } from '$lib/macro';
import type { MacroIndicatorType } from '../../../generated/prisma/client';
import type { Actions } from './$types';

export const actions: Actions = {
	saveMacro: async ({ request }) => {
		const formData = await request.formData();
		const sessionId = formData.get('sessionId') as string;

		if (!sessionId) {
			return fail(400, { error: 'Missing session ID' });
		}

		const indicators = ALL_INDICATORS.map((indicator: MacroIndicatorType) => {
			const value = parseFloat(formData.get(`${indicator}_value`) as string);
			const previousValue = parseFloat(formData.get(`${indicator}_prev`) as string);
			return { indicator, value, previousValue };
		}).filter((ind) => !isNaN(ind.value) && !isNaN(ind.previousValue));

		if (indicators.length === 0) {
			return fail(400, { error: 'No valid indicator data provided' });
		}

		const riskResult = calculateRiskScore(indicators);

		const dbIndicators = indicators.map((ind) => ({
			...ind,
			isRiskOff: riskResult.signals.find((s) => s.indicator === ind.indicator)!.isRiskOff
		}));

		await macroIndicatorService.upsertAll(sessionId, dbIndicators);

		await sessionService.updateRiskScore(sessionId, riskResult.score);

		return { success: true };
	}
};
