import { fail } from '@sveltejs/kit';
import { postTradeReviewService } from '$lib/server/services/postTradeReview.service';
import type { DayType } from '../../../../generated/prisma/client';
import type { Actions } from './$types';

const DAY_TYPE_MAP: Record<string, DayType> = {
	TREND_UP: 'TREND_UP',
	TREND_DOWN: 'TREND_DOWN',
	RANGE: 'RANGE',
	GRIND: 'GRIND'
};

export const actions: Actions = {
	saveReview: async ({ request }) => {
		const formData = await request.formData();
		const sessionId = formData.get('sessionId') as string;
		const dayTypeRaw = formData.get('dayType') as string;
		const macroAligned = formData.get('macroAligned') === 'true';
		const tradesFollowedBias = formData.get('tradesFollowedBias') === 'true';
		const effectiveSignals = (formData.get('effectiveSignals') as string)?.trim() || undefined;
		const mistakes = (formData.get('mistakes') as string)?.trim() || undefined;

		if (!sessionId) {
			return fail(400, { error: 'Missing session ID' });
		}

		const dayType = DAY_TYPE_MAP[dayTypeRaw];
		if (!dayType) {
			return fail(400, { error: 'Invalid day type' });
		}

		await postTradeReviewService.upsert(sessionId, {
			dayType,
			macroAligned,
			tradesFollowedBias,
			effectiveSignals,
			mistakes
		});

		return { success: true };
	}
};
