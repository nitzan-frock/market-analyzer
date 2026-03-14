import prisma from '$lib/prisma';
import type { Bias, PrismaClient } from '../../../../generated/prisma/client';

const fullInclude = {
	macroIndicators: true,
	overnightStructure: true,
	intradaySignals: { orderBy: { timestamp: 'asc' as const } },
	trades: { orderBy: { timestamp: 'asc' as const } },
	postTradeReview: true
} as const;

class SessionService {
	constructor(private prisma: PrismaClient) {}

	getAll() {
		return this.prisma.dailySession.findMany({
			orderBy: { date: 'desc' }
		});
	}

	getByDate(date: Date) {
		return this.prisma.dailySession.findUnique({
			where: { date },
			include: fullInclude
		});
	}

	getById(id: string) {
		return this.prisma.dailySession.findUnique({
			where: { id },
			include: fullInclude
		});
	}

	create(date: Date) {
		return this.prisma.dailySession.create({
			data: { date }
		});
	}

	getOrCreate(date: Date) {
		return this.prisma.dailySession.upsert({
			where: { date },
			create: { date },
			update: {}
		});
	}

	updateRiskScore(id: string, riskScore: number) {
		return this.prisma.dailySession.update({
			where: { id },
			data: { riskScore }
		});
	}

	updateBias(id: string, data: { riskScore: number; dailyBias: Bias; confidenceLevel: string }) {
		return this.prisma.dailySession.update({
			where: { id },
			data
		});
	}
}

export const sessionService = new SessionService(prisma);
