# Ticket 12: Add DaisyUI Component Library

## Summary

Integrate DaisyUI as the component library on top of Tailwind CSS to provide pre-built, themeable UI components for the dashboard.

## Goal

Accelerate UI development by leveraging DaisyUI's component classes (buttons, cards, modals, forms, badges, alerts, etc.) instead of building everything from raw Tailwind utilities. DaisyUI also provides a theming system that will give the dashboard a consistent, polished look with minimal effort.

## Technical Requirements

- [ ] Install `daisyui` as a dependency
- [ ] Import DaisyUI in `src/app.css` via `@plugin`
- [ ] Configure a dark theme appropriate for a trading dashboard
- [ ] Update the existing landing page to use DaisyUI component classes
- [ ] Verify DaisyUI components render correctly with the dev server

## Dependencies

Depends on: #1 (Project Foundation -- Tailwind CSS must be set up)

## Labels

`enhancement`, `frontend`, `ui`
