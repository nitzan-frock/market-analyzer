# Ticket 4: Macro Context Module

## Summary

Build the macro indicator display panel with risk score calculation and bias interpretation.

## Goal

Allow the trader to input or view 5 macro indicators and see an auto-calculated risk score (0–5) with risk-on/neutral/risk-off interpretation.

## Indicators

| Indicator | Description |
|---|---|
| 10Y Treasury Yield | Measures interest rate pressure on equity valuations |
| VIX | Measures expected volatility in equity markets |
| DXY (Dollar Index) | Proxy for global liquidity conditions |
| Oil Prices | Proxy for inflation expectations |
| Credit Spreads | Measure of corporate credit risk |

## Technical Requirements

### Backend
- [ ] API endpoint `POST /api/session/[id]/macro` to save macro indicator values
- [ ] Risk score calculation logic per spec (sum of risk-off binary signals)

### Frontend
- [ ] Macro panel component showing all 5 indicators in a table/card layout
  - Each indicator shows: name, current value, previous value, direction arrow, risk-off badge
- [ ] Risk Score gauge/badge (0–5) with color coding (green = risk-on, yellow = neutral, red = risk-off)
- [ ] Bias interpretation label derived from risk score
- [ ] Form for manual indicator entry (value + previous value per indicator)
- [ ] Auto-calculate `isRiskOff` when current > previous (rising = risk-off for all 5 indicators)

## Business Logic

```
Risk Score = count of indicators where isRiskOff === true
```

| Risk Score | Interpretation |
|---|---|
| 0–1 | Risk-On |
| 2–3 | Neutral |
| 4–5 | Risk-Off |

## Dependencies

Depends on: #2 (Database Schema), #3 (Dashboard Layout Shell)

## Labels

`feature`, `backend`, `frontend`
