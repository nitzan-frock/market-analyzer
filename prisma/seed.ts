import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
	const sessionDate = new Date('2026-03-13');

	const session = await prisma.dailySession.upsert({
		where: { date: sessionDate },
		update: {},
		create: {
			date: sessionDate,
			riskScore: 4,
			dailyBias: 'BEARISH',
			confidenceLevel: 'HIGH'
		}
	});

	console.log(`Created session: ${session.id} (${session.date.toISOString().split('T')[0]})`);

	const indicators = [
		{ indicator: 'TREASURY_10Y' as const, value: 4.52, previousValue: 4.45, isRiskOff: true },
		{ indicator: 'VIX' as const, value: 22.3, previousValue: 19.8, isRiskOff: true },
		{ indicator: 'DXY' as const, value: 104.8, previousValue: 104.2, isRiskOff: true },
		{ indicator: 'OIL' as const, value: 78.5, previousValue: 77.1, isRiskOff: true },
		{ indicator: 'CREDIT_SPREADS' as const, value: 1.45, previousValue: 1.52, isRiskOff: false }
	];

	for (const ind of indicators) {
		await prisma.macroIndicator.upsert({
			where: {
				sessionId_indicator: { sessionId: session.id, indicator: ind.indicator }
			},
			create: { sessionId: session.id, ...ind },
			update: { value: ind.value, previousValue: ind.previousValue, isRiskOff: ind.isRiskOff }
		});
	}

	console.log(`Upserted ${indicators.length} macro indicators`);

	await prisma.overnightStructure.upsert({
		where: { sessionId: session.id },
		update: {},
		create: {
			sessionId: session.id,
			esTrend: 'DOWN',
			nqTrend: 'DOWN',
			preMarketVwap: 438.25,
			overnightHigh: 441.5,
			overnightLow: 436.8,
			keyLevels: [436.0, 438.25, 440.0, 441.5, 445.0],
			majorNews: 'Fed minutes released — hawkish tone on rate path',
			scheduledReports: 'Initial Jobless Claims 8:30 AM ET'
		}
	});

	console.log('Upserted overnight structure');

	const signals = [
		{
			signalType: 'VWAP_INTERACTION' as const,
			description: 'Price rejected at VWAP on first test'
		},
		{
			signalType: 'VOLUME_EXPANSION' as const,
			description: 'Sell volume spiked 2x average on breakdown'
		},
		{
			signalType: 'BREAK_OF_STRUCTURE' as const,
			description: 'Lower low confirmed below overnight low'
		}
	];

	for (const sig of signals) {
		await prisma.intradaySignal.create({
			data: { sessionId: session.id, ...sig }
		});
	}

	console.log(`Created ${signals.length} intraday signals`);

	await prisma.trade.create({
		data: {
			sessionId: session.id,
			direction: 'SHORT',
			entryPrice: 438.1,
			exitPrice: 436.25,
			stopPrice: 439.0,
			isAlignedWithBias: true,
			qualificationScore: 5,
			notes: 'VWAP rejection + volume expansion + break of structure. Clean A+ setup.'
		}
	});

	console.log('Created sample trade');

	await prisma.postTradeReview.upsert({
		where: { sessionId: session.id },
		update: {},
		create: {
			sessionId: session.id,
			dayType: 'TREND_DOWN',
			macroAligned: true,
			tradesFollowedBias: true,
			effectiveSignals:
				'VWAP rejection was the strongest signal. Volume expansion confirmed momentum.',
			mistakes: 'None — followed the plan. Could have held longer for full measured move.'
		}
	});

	console.log('Upserted post-trade review');
	console.log('\nSeed complete.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
