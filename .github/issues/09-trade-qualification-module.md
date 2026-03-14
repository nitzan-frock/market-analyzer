# Ticket 9: Trade Qualification Module

## Summary

Implement a pre-trade qualification checklist that gates trade entry decisions.

## Goal

Present the 5-point qualification checklist from the spec and warn the trader when conditions are insufficient.

## Technical Requirements

- [ ] Trade Qualification panel (modal or sidebar section)
- [ ] Checklist items (interactive toggles):
  1. Is trade aligned with macro bias?
  2. Is there clear structure?
  3. Is volume expanding?
  4. Is stop placement logical?
  5. Is trade near key level?
- [ ] Auto-populate item 1 based on selected trade direction vs. daily bias
- [ ] Qualification score = count of passing conditions (0–5)
- [ ] Visual result:
  - **"Trade Qualified"** (green) if >= 4 pass
  - **"Trade Not Qualified"** (red) if < 4 (spec: avoid if 2+ fail)
- [ ] Qualification result saved with Trade record

## Business Logic

```
qualificationScore = count(checklist items where checked === true)

if qualificationScore >= 4 → QUALIFIED
if qualificationScore < 4  → NOT QUALIFIED (avoid trade)
```

## Dependencies

Depends on: #6 (Daily Bias Engine), #8 (Intraday Confirmation Signals)

## Labels

`feature`, `frontend`
