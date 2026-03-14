# Ticket 7: Execution Guidance Module

## Summary

Display context-aware trade setup recommendations based on daily bias.

## Goal

Show the trader which setups to prefer and which to avoid, dynamically switching based on the current day's bias classification.

## Technical Requirements

- [ ] Execution Guidance panel in the Execution Layer
- [ ] Content dynamically rendered based on bias from #6
- [ ] Visual distinction between "preferred" (green) and "avoid" (red) setups
- [ ] Static guidance content stored as config/constants (not in DB)

## Guidance Content by Bias

### Bullish Bias
**Preferred setups:**
- Pullbacks to VWAP
- Opening range breakout to upside
- Higher low continuation patterns

**Trades to avoid:**
- Counter-trend shorts

### Bearish Bias
**Preferred setups:**
- Rally into resistance
- VWAP rejection
- Lower high continuation
- Breakdown continuation

**Trades to avoid:**
- Counter-trend longs

### Neutral Bias
**Expected behavior:**
- Range trading
- Liquidity sweeps
- False breakouts

**Recommended adjustments:**
- Smaller position size
- Faster exits
- Reduced trade frequency

## Dependencies

Depends on: #6 (Daily Bias Engine)

## Labels

`feature`, `frontend`
