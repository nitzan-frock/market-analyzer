import prisma from '$lib/prisma';
import type { Prisma, PrismaClient } from '../../../../generated/prisma/client';

class OvernightStructureService {
	constructor(private prisma: PrismaClient) {}

	getBySessionId(sessionId: string) {
		return this.prisma.overnightStructure.findUnique({
			where: { sessionId }
		});
	}

	upsert(
		sessionId: string,
		data: Omit<Prisma.OvernightStructureUncheckedCreateInput, 'sessionId'>
	) {
		return this.prisma.overnightStructure.upsert({
			where: { sessionId },
			create: { sessionId, ...data },
			update: data
		});
	}
}

export const overnightStructureService = new OvernightStructureService(prisma);
