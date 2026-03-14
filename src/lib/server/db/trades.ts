import type { TradeDirection } from '../../../../generated/prisma/client.js';
import { prisma } from './index.js';

export function getTradesForSession(sessionId: string) {
	return prisma.trade.findMany({
		where: { sessionId },
		orderBy: { timestamp: 'asc' }
	});
}

export function createTrade(
	sessionId: string,
	data: {
		direction: TradeDirection;
		entryPrice: number;
		stopPrice: number;
		isAlignedWithBias: boolean;
		qualificationScore: number;
		notes?: string;
	}
) {
	return prisma.trade.create({
		data: { sessionId, ...data }
	});
}

export function updateTrade(id: string, data: { exitPrice?: number; notes?: string }) {
	return prisma.trade.update({
		where: { id },
		data
	});
}

export function deleteTrade(id: string) {
	return prisma.trade.delete({
		where: { id }
	});
}
