import prisma from '$lib/prisma';
import { fetchKeyLevels } from '$lib/server/polygon';
import { hasPolygonApiKey } from '$lib/server/config';
import { overnightStructureService } from './overnightStructure.service';

/**
 * Pull key levels (previous day, overnight, premarket body high/low) from Polygon
 * and persist into OvernightStructure. Only updates the six numeric fields;
 * does not overwrite esTrend, nqTrend, keyLevels, majorNews, scheduledReports.
 * If POLYGON_API_KEY is unset, no-op.
 */
export async function pullKeyLevels(sessionId: string, dateStr: string): Promise<void> {
	if (!hasPolygonApiKey()) return;

	const levels = await fetchKeyLevels(dateStr);
	if (!levels) return;

	const data = {
		previousDayHigh: levels.previousDay.high ?? undefined,
		previousDayLow: levels.previousDay.low ?? undefined,
		overnightHigh: levels.overnight.high ?? undefined,
		overnightLow: levels.overnight.low ?? undefined,
		premarketHigh: levels.premarket.high ?? undefined,
		premarketLow: levels.premarket.low ?? undefined
	};

	const existing = await overnightStructureService.getBySessionId(sessionId);
	if (existing) {
		await prisma.overnightStructure.update({
			where: { sessionId },
			data
		});
	} else {
		await overnightStructureService.upsert(sessionId, {
			esTrend: '—',
			nqTrend: '—',
			...data
		});
	}
}
