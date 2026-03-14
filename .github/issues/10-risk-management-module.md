# Ticket 10: Risk Management Module

## Summary

Build a risk management panel tracking position limits, daily P&L, and stop placement rules.

## Goal

Enforce the spec's risk rules -- max 2 A-quality trades/day, defined risk per trade, daily loss threshold.

## Technical Requirements

### Backend
- [ ] Risk management configuration (stored in DB or env):
  - Max trades per day (default: 2)
  - Max risk per trade (configurable dollar/percentage amount)
  - Max daily loss threshold

### Frontend
- [ ] Risk Management panel showing:
  - Trades taken today: X / 2
  - Daily P&L running total
  - Remaining daily risk budget
  - Warning/lockout when daily loss threshold hit
- [ ] Stop placement rules reference card:
  - Beyond liquidity level
  - Beyond structural high/low
  - Outside noise range
- [ ] Visual alerts:
  - Yellow warning at 1 trade remaining
  - Red alert at max trades reached

## Position Limits (from spec)

- Maximum 2 A-quality trades per day
- Defined risk per trade
- Maximum daily loss threshold

## Stop Placement Rules (from spec)

Stops must be placed:
- Beyond liquidity level
- Beyond structural high/low
- Outside of noise range

## Dependencies

Depends on: #2 (Database Schema), #3 (Dashboard Layout Shell)

## Labels

`feature`, `backend`, `frontend`
