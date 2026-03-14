# Ticket 2: Database Schema and Data Layer

## Summary

Define Prisma schema for all core data models used across dashboard modules.

## Goal

Create a complete, normalized database schema that supports macro indicators, overnight structure, daily sessions, trades, and post-trade reviews.

## Data Models

### DailySession
Top-level entity for a trading day.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `date` | DateTime | Unique, one session per day |
| `riskScore` | Int? | 0–5, nullable until macro data entered |
| `dailyBias` | Bias? | Enum: BULLISH, BEARISH, NEUTRAL |
| `confidenceLevel` | String? | HIGH, MEDIUM, LOW |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

### MacroIndicator
Snapshot of a macro indicator for a session.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `sessionId` | String | FK → DailySession |
| `indicator` | MacroIndicatorType | Enum |
| `value` | Float | Current value |
| `previousValue` | Float | Previous session value |
| `isRiskOff` | Boolean | true if rising (risk-off signal) |
| `timestamp` | DateTime | When recorded |

### OvernightStructure
Pre-market structure data.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `sessionId` | String | FK → DailySession (unique, 1:1) |
| `esTrend` | String | UP, DOWN, FLAT |
| `nqTrend` | String | UP, DOWN, FLAT |
| `preMarketVwap` | Float? | |
| `overnightHigh` | Float? | PMH |
| `overnightLow` | Float? | PML |
| `keyLevels` | Json? | Array of price levels |
| `majorNews` | String? | Text |
| `scheduledReports` | String? | Text |

### IntradaySignal
Confirmation signals observed during the session.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `sessionId` | String | FK → DailySession |
| `signalType` | SignalType | Enum |
| `description` | String? | Optional notes |
| `timestamp` | DateTime | When observed |

### Trade
Individual trade log entry.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `sessionId` | String | FK → DailySession |
| `direction` | TradeDirection | Enum: LONG, SHORT |
| `entryPrice` | Float | |
| `exitPrice` | Float? | Nullable until trade closed |
| `stopPrice` | Float | |
| `isAlignedWithBias` | Boolean | |
| `qualificationScore` | Int | 0–5 |
| `notes` | String? | |
| `timestamp` | DateTime | |

### PostTradeReview
End-of-day review.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `sessionId` | String | FK → DailySession (unique, 1:1) |
| `dayType` | DayType | Enum: TREND_UP, TREND_DOWN, RANGE, GRIND |
| `macroAligned` | Boolean | |
| `tradesFollowedBias` | Boolean | |
| `effectiveSignals` | String? | Text |
| `mistakes` | String? | Text |

## Enums

```
Bias: BULLISH, BEARISH, NEUTRAL
DayType: TREND_UP, TREND_DOWN, RANGE, GRIND
MacroIndicatorType: TREASURY_10Y, VIX, DXY, OIL, CREDIT_SPREADS
SignalType: VWAP_INTERACTION, LIQUIDITY_SWEEP, VOLUME_EXPANSION, BREAK_OF_STRUCTURE, ORB
TradeDirection: LONG, SHORT
```

## TypeScript Interfaces

```typescript
interface RiskScoreResult {
  score: number; // 0-5
  signals: { indicator: MacroIndicatorType; isRiskOff: boolean }[];
  interpretation: 'RISK_ON' | 'NEUTRAL' | 'RISK_OFF';
}
```

## Technical Requirements

- [ ] Prisma schema file with all models, enums, and relations
- [ ] Initial migration generated and applied
- [ ] Prisma Client generated
- [ ] Seed script with sample data for one trading day
- [ ] Reusable data-access functions in `$lib/server/db/` (CRUD helpers)

## Dependencies

Depends on: #1 (Project Foundation)

## Labels

`database`, `backend`
