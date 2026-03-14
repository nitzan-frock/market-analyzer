import prisma from '$lib/prisma';
import type {
	MacroIndicatorType,
	Prisma,
	PrismaClient
} from '../../../../generated/prisma/client';

class MacroIndicatorService {
	constructor(private prisma: PrismaClient) {}

	getIndicatorsForSession(sessionId: string) {
		return this.prisma.macroIndicator.findMany({
			where: { sessionId }
		});
	}

	upsertIndicator(
		sessionId: string,
		indicator: MacroIndicatorType,
		data: Pick<Prisma.MacroIndicatorUncheckedCreateInput, 'value' | 'previousValue' | 'isRiskOff'>
	) {
		return this.prisma.macroIndicator.upsert({
			where: { sessionId_indicator: { sessionId, indicator } },
			create: { sessionId, indicator, ...data },
			update: data
		});
	}

	upsertAll(
		sessionId: string,
		indicators: {
			indicator: MacroIndicatorType;
			value: number;
			previousValue: number;
			isRiskOff: boolean;
		}[]
	) {
		return this.prisma.$transaction(
			indicators.map((ind) =>
				this.prisma.macroIndicator.upsert({
					where: { sessionId_indicator: { sessionId, indicator: ind.indicator } },
					create: { sessionId, ...ind },
					update: {
						value: ind.value,
						previousValue: ind.previousValue,
						isRiskOff: ind.isRiskOff
					}
				})
			)
		);
	}
}

export const macroIndicatorService = new MacroIndicatorService(prisma);
