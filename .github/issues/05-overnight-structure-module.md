# Ticket 5: Overnight Market Structure Module

## Summary

Build the overnight/pre-market structure panel for futures data and key levels.

## Goal

Display and allow entry of pre-market futures data (ES/NQ trends, VWAP, overnight range, key levels, news/reports).

## Technical Requirements

### Backend
- [ ] API endpoint `POST /api/session/[id]/overnight` to save overnight data

### Frontend
- [ ] Overnight Structure panel component with fields for:
  - ES overnight trend (select: UP / DOWN / FLAT)
  - NQ overnight trend (select: UP / DOWN / FLAT)
  - Pre-market VWAP (numeric input)
  - Overnight High / PMH (numeric input)
  - Overnight Low / PML (numeric input)
  - Key support/resistance levels (dynamic list of price levels)
  - Major overnight news (textarea)
  - Scheduled economic reports (textarea)
- [ ] Overnight range visual indicator (high-low bar)

## Output Fields

```
Overnight Trend
PMH (Pre-Market High)
PML (Pre-Market Low)
Key Levels
Pre-Market VWAP
```

## Dependencies

Depends on: #2 (Database Schema), #3 (Dashboard Layout Shell)

## Labels

`feature`, `backend`, `frontend`
