import { fail } from '@sveltejs/kit';
import { macroIndicatorService } from '$lib/server/services/macroIndicator.service';
import { overnightStructureService } from '$lib/server/services/overnightStructure.service';
import { pullKeyLevels } from '$lib/server/services/keyLevels.service';
import { sessionService } from '$lib/server/services/session.service';
import { calculateRiskScore, ALL_INDICATORS } from '$lib/macro';
import type { MacroIndicatorType } from '../../../generated/prisma/client';
import type { Actions } from './$types';

function parseKeyLevels(s: string): number[] {
	return s
		.split(/[\s,]+/)
		.map((v) => parseFloat(v.trim()))
		.filter((n) => !isNaN(n));
}

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
	},

	saveOvernight: async ({ request }) => {
		const formData = await request.formData();
		const sessionId = formData.get('sessionId') as string;

		if (!sessionId) {
			return fail(400, { error: 'Missing session ID' });
		}

		const esTrend = (formData.get('esTrend') as string)?.trim();
		const nqTrend = (formData.get('nqTrend') as string)?.trim();

		if (!esTrend || !nqTrend) {
			return fail(400, { error: 'ES and NQ trend are required' });
		}

		const preMarketVwapRaw = formData.get('preMarketVwap') as string;
		const overnightHighRaw = formData.get('overnightHigh') as string;
		const overnightLowRaw = formData.get('overnightLow') as string;
		const keyLevelsRaw = (formData.get('keyLevels') as string) ?? '';
		const majorNews = (formData.get('majorNews') as string)?.trim() || undefined;
		const scheduledReports = (formData.get('scheduledReports') as string)?.trim() || undefined;

		const parseOptFloat = (s: string): number | undefined => {
			const n = parseFloat(s);
			return s && !isNaN(n) ? n : undefined;
		};

		const keyLevels = parseKeyLevels(keyLevelsRaw);
		const keyLevelsJson = keyLevels.length > 0 ? keyLevels : undefined;

		await overnightStructureService.upsert(sessionId, {
			esTrend,
			nqTrend,
			preMarketVwap: parseOptFloat(preMarketVwapRaw),
			overnightHigh: parseOptFloat(overnightHighRaw),
			overnightLow: parseOptFloat(overnightLowRaw),
			keyLevels: keyLevelsJson,
			majorNews,
			scheduledReports
		});

		return { success: true };
	},

	refreshKeyLevels: async ({ request }) => {
		const formData = await request.formData();
		const sessionId = formData.get('sessionId') as string;
		const dateStr = (formData.get('date') as string)?.trim();

		if (!sessionId || !dateStr) {
			return fail(400, { error: 'Missing session ID or date' });
		}
		await pullKeyLevels(sessionId, dateStr);
		return { success: true };
	}
};
