# Ticket 8: Intraday Confirmation Signals

## Summary

Build an interactive signal tracking panel for real-time price behavior confirmations.

## Goal

Allow the trader to log and view intraday confirmation signals that validate or invalidate the daily bias.

## Technical Requirements

### Backend

- [ ] API endpoint `POST /api/session/[id]/signals` to log signals
- [ ] API endpoint `GET /api/session/[id]/signals` to retrieve signals

### Frontend

- [ ] Signal log panel with:
  - Quick-add buttons for each signal type (VWAP interaction, liquidity sweep, volume expansion, break of structure, ORB)
  - Timestamp auto-populated on creation
  - Optional description/notes per signal
  - Signal chain visualization showing how confirmations build
- [ ] Signal timeline/list view ordered by time
- [ ] Signal count summary (e.g., "3 of 5 confirmations active")

## Signal Types

```
VWAP_INTERACTION
LIQUIDITY_SWEEP
VOLUME_EXPANSION
BREAK_OF_STRUCTURE
ORB (Opening Range Breakout)
```

## Example Signal Chain

```
Bearish Bias
+ Rally into resistance
+ Rejection candle
+ Increasing sell volume
= Short Entry
```

## Dependencies

Depends on: #6 (Daily Bias Engine)

## Labels

`feature`, `backend`, `frontend`
