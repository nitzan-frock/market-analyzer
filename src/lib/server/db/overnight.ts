import type { Prisma } from '../../../../generated/prisma/client.js';
import { prisma } from './index.js';

export function getOvernightStructure(sessionId: string) {
	return prisma.overnightStructure.findUnique({
		where: { sessionId }
	});
}

export function upsertOvernightStructure(
	sessionId: string,
	data: Omit<Prisma.OvernightStructureCreateInput, 'session'>
) {
	const { ...fields } = data;
	return prisma.overnightStructure.upsert({
		where: { sessionId },
		create: { sessionId, ...fields },
		update: fields
	});
}
