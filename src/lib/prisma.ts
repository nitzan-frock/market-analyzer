import * as client from '../../generated/prisma/client';
import type { Prisma } from '../../generated/prisma/client';
import { DATABASE_URL } from '$env/static/private';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
	connectionString: DATABASE_URL
});

const prisma = new client.PrismaClient({
	adapter
});

export default prisma;
export type { client, Prisma };