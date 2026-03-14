# Ticket 11: Post-Trade Review Module

## Summary

Build the end-of-day review form and review history view.

## Goal

Allow the trader to record structured session reviews per the spec's required fields and browse past reviews.

## Technical Requirements

### Backend

- [ ] API endpoints for CRUD on PostTradeReview

### Frontend

- [ ] Review form page at `/dashboard/review` with:
  - Day type selector (Trend Up, Trend Down, Range, Grind)
  - "Did macro signals align with price?" (yes/no toggle)
  - "Did trades follow bias?" (yes/no toggle)
  - "What signals were effective?" (textarea)
  - "What mistakes occurred?" (textarea)
- [ ] Review history list page with filtering by date and day type
- [ ] Auto-link review to the current DailySession
- [ ] Summary statistics view (e.g., % of days macro aligned, common mistakes)

## Review Fields (from spec)

```
Day Type: Trend Up | Trend Down | Range | Grind

Did macro signals align with price?
Did trades follow bias?
What signals were effective?
What mistakes occurred?
```

## Dependencies

Depends on: #2 (Database Schema), #3 (Dashboard Layout Shell)

## Labels

`feature`, `backend`, `frontend`
