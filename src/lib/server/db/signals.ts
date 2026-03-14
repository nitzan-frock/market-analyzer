import type { SignalType } from '../../../../generated/prisma/client.js';
import { prisma } from './index.js';

export function getSignalsForSession(sessionId: string) {
	return prisma.intradaySignal.findMany({
		where: { sessionId },
		orderBy: { timestamp: 'asc' }
	});
}

export function createSignal(
	sessionId: string,
	data: { signalType: SignalType; description?: string }
) {
	return prisma.intradaySignal.create({
		data: { sessionId, ...data }
	});
}

export function deleteSignal(id: string) {
	return prisma.intradaySignal.delete({
		where: { id }
	});
}
