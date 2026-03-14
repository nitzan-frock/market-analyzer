import { fail } from '@sveltejs/kit';
import { upsertAllIndicators } from '$lib/server/db/macro';
import { calculateRiskScore, ALL_INDICATORS } from '$lib/macro';
import { prisma } from '$lib/server/db/index';
import type { MacroIndicatorType } from '../../../generated/prisma/client.js';
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

		await upsertAllIndicators(sessionId, dbIndicators);

		await prisma.dailySession.update({
			where: { id: sessionId },
			data: { riskScore: riskResult.score }
		});

		return { success: true };
	}
};
