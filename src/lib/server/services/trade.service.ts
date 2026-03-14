import prisma from '$lib/prisma';
import type { PrismaClient, TradeDirection } from '../../../../generated/prisma/client';

class TradeService {
	constructor(private prisma: PrismaClient) {}

	getBySessionId(sessionId: string) {
		return this.prisma.trade.findMany({
			where: { sessionId },
			orderBy: { timestamp: 'asc' }
		});
	}

	create(
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
		return this.prisma.trade.create({
			data: { sessionId, ...data }
		});
	}

	update(id: string, data: { exitPrice?: number; notes?: string }) {
		return this.prisma.trade.update({
			where: { id },
			data
		});
	}

	delete(id: string) {
		return this.prisma.trade.delete({
			where: { id }
		});
	}
}

export const tradeService = new TradeService(prisma);
