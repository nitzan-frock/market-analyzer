# Ticket 6: Daily Bias Engine

## Summary

Implement the core bias calculation logic combining macro risk score and overnight structure.

## Goal

Automatically compute and display daily bias (Bullish / Bearish / Neutral) with confidence level based on the spec's rules.

## Technical Requirements

### Backend

- [ ] Bias calculation service in `$lib/server/bias.ts`
  - Inputs: risk score (from #4), overnight trend strength (from #5)
  - Logic per spec (see below)
  - Confidence derived from signal alignment strength
- [ ] API endpoint `GET /api/session/[id]/bias` returning computed bias + confidence
- [ ] Auto-recalculates when macro or overnight data changes

### Frontend

- [ ] Prominent bias display at top of Decision Layer panel
  - Large bias label (color-coded: green/red/yellow)
  - Confidence badge (High / Medium / Low)

## Bias Logic

```
If Risk Score >= 4 AND futures trend is weak → Bearish Bias
If Risk Score <= 1 AND futures trend is strong → Bullish Bias
If Risk Score = 2 or 3 → Neutral / Range Expectation
```

## Interface

```typescript
interface BiasResult {
	bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
	confidence: 'HIGH' | 'MEDIUM' | 'LOW';
	riskScore: number;
	overnightTrend: string;
}
```

## Dependencies

Depends on: #4 (Macro Context Module), #5 (Overnight Structure Module)

## Labels

`feature`, `backend`, `frontend`, `core-logic`
