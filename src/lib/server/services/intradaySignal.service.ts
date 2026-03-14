import prisma from '$lib/prisma';
import type { PrismaClient, SignalType } from '../../../../generated/prisma/client';

class IntradaySignalService {
	constructor(private prisma: PrismaClient) {}

	getBySessionId(sessionId: string) {
		return this.prisma.intradaySignal.findMany({
			where: { sessionId },
			orderBy: { timestamp: 'asc' }
		});
	}

	create(sessionId: string, data: { signalType: SignalType; description?: string }) {
		return this.prisma.intradaySignal.create({
			data: { sessionId, ...data }
		});
	}

	delete(id: string) {
		return this.prisma.intradaySignal.delete({
			where: { id }
		});
	}
}

export const intradaySignalService = new IntradaySignalService(prisma);
