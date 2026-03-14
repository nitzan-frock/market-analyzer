# Ticket 3: Dashboard Layout Shell

## Summary

Build the four-layer dashboard UI skeleton with navigation and responsive layout.

## Goal

Create the visual framework matching the spec's layered architecture (Macro → Market Structure → Execution → Decision) so modules can be plugged in.

## Technical Requirements

- [ ] Root layout (`+layout.svelte`) with app chrome (header, nav, main content area)
- [ ] Dashboard home page (`/dashboard`) with four distinct panel sections:
  - Macro Layer panel
  - Market Structure Layer panel
  - Execution Layer panel
  - Decision Layer panel
- [ ] Each panel is a placeholder component that will be replaced by real module content
- [ ] Responsive grid layout (2-column on desktop, stacked on mobile)
- [ ] Date selector for navigating between trading sessions
- [ ] Sidebar or top nav for secondary pages (trade log, review history)

## Routes

| Route               | Purpose                       |
| ------------------- | ----------------------------- |
| `/`                 | Landing/redirect to dashboard |
| `/dashboard`        | Main dashboard view           |
| `/dashboard/review` | Post-trade review (Ticket 11) |
| `/dashboard/trades` | Trade log (Tickets 9/10)      |

## Dependencies

Depends on: #1 (Project Foundation)

## Labels

`frontend`, `ui`
