import type { DayType } from '../../../../generated/prisma/client.js';
import { prisma } from './index.js';

export function getReviewForSession(sessionId: string) {
	return prisma.postTradeReview.findUnique({
		where: { sessionId }
	});
}

export function getReviews(filters?: { dayType?: DayType }) {
	return prisma.postTradeReview.findMany({
		where: filters?.dayType ? { dayType: filters.dayType } : undefined,
		include: { session: true },
		orderBy: { session: { date: 'desc' } }
	});
}

export function upsertReview(
	sessionId: string,
	data: {
		dayType: DayType;
		macroAligned: boolean;
		tradesFollowedBias: boolean;
		effectiveSignals?: string;
		mistakes?: string;
	}
) {
	return prisma.postTradeReview.upsert({
		where: { sessionId },
		create: { sessionId, ...data },
		update: data
	});
}
