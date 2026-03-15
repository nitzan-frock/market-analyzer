import type { Bias, MacroIndicatorType } from '../../generated/prisma/client';

export interface RiskScoreResult {
	score: number;
	signals: { indicator: MacroIndicatorType; isRiskOff: boolean }[];
	interpretation: 'RISK_ON' | 'NEUTRAL' | 'RISK_OFF';
}

export function calculateRiskScore(
	indicators: { indicator: MacroIndicatorType; value: number; previousValue: number }[]
): RiskScoreResult {
	const signals = indicators.map((ind) => ({
		indicator: ind.indicator,
		isRiskOff: ind.value > ind.previousValue
	}));

	const score = signals.filter((s) => s.isRiskOff).length;

	let interpretation: RiskScoreResult['interpretation'];
	if (score <= 1) {
		interpretation = 'RISK_ON';
	} else if (score >= 4) {
		interpretation = 'RISK_OFF';
	} else {
		interpretation = 'NEUTRAL';
	}

	return { score, signals, interpretation };
}

export function interpretationColor(interpretation: RiskScoreResult['interpretation']): string {
	switch (interpretation) {
		case 'RISK_ON':
			return 'badge-success';
		case 'NEUTRAL':
			return 'badge-warning';
		case 'RISK_OFF':
			return 'badge-error';
	}
}

export const INDICATOR_LABELS: Record<MacroIndicatorType, string> = {
	TREASURY_10Y: '10Y Treasury',
	VIX: 'VIX',
	DXY: 'DXY (Dollar)',
	OIL: 'Oil',
	CREDIT_SPREADS: 'Credit Spreads'
};

export const ALL_INDICATORS: MacroIndicatorType[] = [
	'TREASURY_10Y',
	'VIX',
	'DXY',
	'OIL',
	'CREDIT_SPREADS'
];

// ── Daily Bias Engine (spec 6.3) ───────────────────────────────────────

const STRONG_TRENDS = ['UP'] as const;
const WEAK_TRENDS = ['DOWN', 'FLAT', 'MIXED'] as const;

function isStrongTrend(trend: string): boolean {
	return STRONG_TRENDS.includes(trend?.trim().toUpperCase() as (typeof STRONG_TRENDS)[number]);
}

function isWeakTrend(trend: string): boolean {
	return WEAK_TRENDS.includes(trend?.trim().toUpperCase() as (typeof WEAK_TRENDS)[number]);
}

export interface DailyBiasResult {
	bias: Bias;
	confidenceLevel: 'High' | 'Medium' | 'Low';
}

/**
 * Combines macro risk score with overnight futures trend to produce daily bias.
 * Risk Score >= 4 + weak futures → Bearish
 * Risk Score <= 1 + strong futures → Bullish
 * Otherwise → Neutral
 */
export function calculateDailyBias(
	riskScore: number,
	esTrend: string,
	nqTrend: string
): DailyBiasResult | null {
	const esStrong = isStrongTrend(esTrend);
	const nqStrong = isStrongTrend(nqTrend);
	const esWeak = isWeakTrend(esTrend);
	const nqWeak = isWeakTrend(nqTrend);
	const futuresStrong = esStrong && nqStrong;
	const futuresWeak = esWeak || nqWeak;

	let bias: Bias;
	let confidenceLevel: DailyBiasResult['confidenceLevel'];

	if (riskScore >= 4 && futuresWeak) {
		bias = 'BEARISH';
		confidenceLevel = esWeak && nqWeak ? 'High' : 'Medium';
	} else if (riskScore <= 1 && futuresStrong) {
		bias = 'BULLISH';
		confidenceLevel = 'High';
	} else if (riskScore <= 1 && !futuresStrong) {
		bias = 'BULLISH';
		confidenceLevel = 'Low';
	} else if (riskScore >= 4 && !futuresWeak) {
		bias = 'BEARISH';
		confidenceLevel = 'Low';
	} else {
		bias = 'NEUTRAL';
		confidenceLevel = riskScore === 2 || riskScore === 3 ? 'Medium' : 'Low';
	}

	return { bias, confidenceLevel };
}
