import type { Bias } from '../../../../generated/prisma/client.js';
import { prisma } from './index.js';

export function getSessions() {
	return prisma.dailySession.findMany({
		orderBy: { date: 'desc' }
	});
}

export function getSessionByDate(date: Date) {
	return prisma.dailySession.findUnique({
		where: { date },
		include: {
			macroIndicators: true,
			overnightStructure: true,
			intradaySignals: { orderBy: { timestamp: 'asc' } },
			trades: { orderBy: { timestamp: 'asc' } },
			postTradeReview: true
		}
	});
}

export function getSessionById(id: string) {
	return prisma.dailySession.findUnique({
		where: { id },
		include: {
			macroIndicators: true,
			overnightStructure: true,
			intradaySignals: { orderBy: { timestamp: 'asc' } },
			trades: { orderBy: { timestamp: 'asc' } },
			postTradeReview: true
		}
	});
}

export function createSession(date: Date) {
	return prisma.dailySession.create({
		data: { date }
	});
}

export function getOrCreateSession(date: Date) {
	return prisma.dailySession.upsert({
		where: { date },
		create: { date },
		update: {}
	});
}

export function updateSessionBias(
	id: string,
	data: { riskScore: number; dailyBias: Bias; confidenceLevel: string }
) {
	return prisma.dailySession.update({
		where: { id },
		data
	});
}
