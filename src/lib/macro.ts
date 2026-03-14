import type { MacroIndicatorType } from '../../generated/prisma/client';

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
