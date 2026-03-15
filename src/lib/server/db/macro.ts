import prisma, { type client, type Prisma} from '$lib/prisma';

export function getIndicatorsForSession(sessionId: string) {
	return prisma.macroIndicator.findMany({
		where: { sessionId }
	});
}

export function upsertIndicator(
	sessionId: string,
	indicator: client.MacroIndicatorType,
	data: Pick<Prisma.MacroIndicatorUncheckedCreateInput, 'value' | 'previousValue' | 'isRiskOff'>
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
		indicator: client.MacroIndicatorType;
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
