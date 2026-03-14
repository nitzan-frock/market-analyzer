import type { MacroIndicatorType } from '../../../../generated/prisma/client';
import { prisma } from './index';

export function getIndicatorsForSession(sessionId: string) {
	return prisma.macroIndicator.findMany({
		where: { sessionId }
	});
}

export function upsertIndicator(
	sessionId: string,
	indicator: MacroIndicatorType,
	data: { value: number; previousValue: number; isRiskOff: boolean }
) {
	return prisma.macroIndicator.upsert({
		where: { sessionId_indicator: { sessionId, indicator } },
		create: { sessionId, indicator, ...data },
		update: data
	});
}

export function upsertAllIndicators(
	sessionId: string,
	indicators: {
		indicator: MacroIndicatorType;
		value: number;
		previousValue: number;
		isRiskOff: boolean;
	}[]
) {
	return prisma.$transaction(
		indicators.map((ind) =>
			prisma.macroIndicator.upsert({
				where: { sessionId_indicator: { sessionId, indicator: ind.indicator } },
				create: { sessionId, ...ind },
				update: { value: ind.value, previousValue: ind.previousValue, isRiskOff: ind.isRiskOff }
			})
		)
	);
}
