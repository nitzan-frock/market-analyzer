import { fail } from '@sveltejs/kit';
import { tradeService } from '$lib/server/services/trade.service';
import type { TradeDirection } from '../../../../generated/prisma/client';
import type { Actions } from './$types';

export const actions: Actions = {
	createTrade: async ({ request }) => {
		const formData = await request.formData();
		const sessionId = formData.get('sessionId') as string;
		const direction = formData.get('direction') as TradeDirection;
		const entryPrice = parseFloat(formData.get('entryPrice') as string);
		const stopPrice = parseFloat(formData.get('stopPrice') as string);
		const isAlignedWithBias = formData.get('isAlignedWithBias') === 'true';
		const qualificationScore = parseInt(formData.get('qualificationScore') as string, 10);
		const notes = (formData.get('notes') as string)?.trim() || undefined;

		if (!sessionId || !direction || isNaN(entryPrice) || isNaN(stopPrice) || isNaN(qualificationScore)) {
			return fail(400, { error: 'Missing or invalid required fields' });
		}

		const validDirections: TradeDirection[] = ['LONG', 'SHORT'];
		if (!validDirections.includes(direction)) {
			return fail(400, { error: 'Invalid direction' });
		}

		if (qualificationScore < 0 || qualificationScore > 5) {
			return fail(400, { error: 'Qualification score must be 0-5' });
		}

		await tradeService.create(sessionId, {
			direction,
			entryPrice,
			stopPrice,
			isAlignedWithBias,
			qualificationScore,
			notes
		});

		return { success: true };
	},

	updateTrade: async ({ request }) => {
		const formData = await request.formData();
		const tradeId = formData.get('tradeId') as string;
		const exitPriceRaw = formData.get('exitPrice') as string;
		const notes = (formData.get('notes') as string)?.trim() || undefined;

		if (!tradeId) {
			return fail(400, { error: 'Missing trade ID' });
		}

		const exitPrice = exitPriceRaw ? parseFloat(exitPriceRaw) : undefined;
		const data: { exitPrice?: number; notes?: string } = {};
		if (exitPrice !== undefined && !isNaN(exitPrice)) {
			data.exitPrice = exitPrice;
		}
		if (notes !== undefined) {
			data.notes = notes;
		}

		if (Object.keys(data).length === 0) {
			return fail(400, { error: 'No updates provided' });
		}

		await tradeService.update(tradeId, data);

		return { success: true };
	},

	deleteTrade: async ({ request }) => {
		const formData = await request.formData();
		const tradeId = formData.get('tradeId') as string;

		if (!tradeId) {
			return fail(400, { error: 'Missing trade ID' });
		}

		await tradeService.delete(tradeId);

		return { success: true };
	}
};
