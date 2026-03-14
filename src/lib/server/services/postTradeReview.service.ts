import prisma from '$lib/prisma';
import type { DayType, PrismaClient } from '../../../../generated/prisma/client';

class PostTradeReviewService {
	constructor(private prisma: PrismaClient) {}

	getBySessionId(sessionId: string) {
		return this.prisma.postTradeReview.findUnique({
			where: { sessionId }
		});
	}

	getMany(filters?: { dayType?: DayType }) {
		return this.prisma.postTradeReview.findMany({
			where: filters?.dayType ? { dayType: filters.dayType } : undefined,
			include: { session: true },
			orderBy: { session: { date: 'desc' } }
		});
	}

	upsert(
		sessionId: string,
		data: {
			dayType: DayType;
			macroAligned: boolean;
			tradesFollowedBias: boolean;
			effectiveSignals?: string;
			mistakes?: string;
		}
	) {
		return this.prisma.postTradeReview.upsert({
			where: { sessionId },
			create: { sessionId, ...data },
			update: data
		});
	}
}

export const postTradeReviewService = new PostTradeReviewService(prisma);
