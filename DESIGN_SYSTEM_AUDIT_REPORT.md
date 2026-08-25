# DIGIT Design System Compliance Audit — HCM Console

**Date:** 26 Aug 2026 · **Auditor:** Claude Code (with naveen-egov) · **PR:** [egovernments/DIGIT-Frontend#4333](https://github.com/egovernments/DIGIT-Frontend/pull/4333)
**Reference:** https://design.digit.org (Color palette v6.0.0) + `--digitv2-*` component-library tokens

## Scope & Method

Every screen was audited by scanning the **computed** `color` / `background-color` / `border-color` of all visible elements (at multiple scroll positions and interaction states) against the valid token set:

- Design-site palette (design.digit.org → Foundation → Color, v6.0.0)
- All `--digitv2-*` CSS custom properties shipped by `digit-ui-components-css`
- Three library Tag semantic colors kept deliberately for accessibility: `#FFF7D6`, `#5C450A`, `#9E5F00` (the docs-palette warning pair `#EA8D00`/`#FFF9F0` yields ~2.2:1 contrast and would fail WCAG AA)

**Screens covered (all pass with zero non-token colors):**

| Area | Coverage |
|---|---|
| App configuration editor (`new-app-configuration-redesign`) | All 13 flows × every page tab, in 3 states each: rendered view, Page Properties panel scrolled to bottom, field-properties open (Elements + Logic tabs / form-field drawer) |
| Module selection (`new-app-modules`) | Full page incl. below-fold disabled "Upcoming" buttons |
| Campaign setup checklist (`view-details`) | Full page, all scroll positions |
| Setup-campaign wizard (`setup-campaign`) | Steps 1–6 (type, name, date, detail summary, boundary selection incl. open dropdown, boundary summary) |

## Fixes applied (PR #4333, 7 commits)

### Accessibility
- **App-config title bar** `#929292` → Primary 2 `#0B4B66`. The white "AppConfig Version" text on the old grey was ~3.5:1 — **failed WCAG AA**; now ~9:1.
- **Employee topbar** tenant/language selectors rendered as plain text (no caret) — added the dropdown caret affordance (core only passes `showArrow` to the profile dropdown).

### Token corrections (app code)
- Mistyped divider tokens `#d6d5d5` / `#d6d4d5` → `#D6D5D4` (12+ occurrences — two different transpositions of the real token).
- Off-palette selection/hover tints `#E6EDF0` / `#EFF8FF` → info bg `#DEEFFF` (flows panel, sidebar, form-element cards, campaign chip in campaign.scss + payment.scss).
- "Fully configurable" tag `#1C00BD` / `#EBECFE` → info `#0057BD` / `#DEEFFF`; template tag `#FFFCC0` → library warning bg `#FFF7D6`.
- Text `#333` → text-primary `#363636` (preview headings, hover tooltip); phone-bezel camera `#333` → `#363636`.
- Drag-handle dots `#d9d9d9`, hardcoded icon fills `#B1B4B6`, disabled-text theme variable `#B1B4B6` → disabled token `#C5C5C5`.
- Inline `#e0e0e0` borders in campaign-manager JS (TableTemplate, NewLayoutRenderer, AppFeatures, AppPreview, ProgressBar, CommodityManagement screens) → divider `#D6D5D4`.
- Logic rule-summary joiner tag `#FFFDE7` / `#9E5F00` and MultiSelectDropdown local warning → accessible warning pair `#FFF7D6` / `#5C450A`.

### Overrides for library-shipped off-token values (scoped CSS)
- Input borders `#E0E0E0` → input-border token `#505A5F` (editor + preview scopes; `!important` needed vs library rule).
- Switch off-track `#BFBFBF` → `#C5C5C5` (checked state unaffected — painted by a separate element).
- Disabled header labels / disabled input text / disabled dropdown `#9E9E9E` → `#C5C5C5`.
- Disabled Buttons (all variants): the library Button applies **inline** `#9E9E9E` when disabled; stylesheet `!important` override → `#C5C5C5`.
- react-data-table default `#CCCCCC` borders (preview tables) → `#D6D5D4`.
- Popup footer buttons in the mobile preview: viewport media queries don't fire inside the scaled `.zoom-content` frame — mobile layout (full-width, equal flex buttons) scoped to the preview.

## Items intentionally not changed
- **Library Tag warning colors** (`#FFF7D6`/`#5C450A`, stroke `#9E5F00`) — accessible (~7:1 / ~4.6:1); the docs pair would fail AA.
- **Custom tabs & flows side-nav** in the editor — bespoke implementations instead of the documented Tabs atom / Side Nav molecule; a structural refactor, needs a design/eng decision.

## Upstream recommendations (DIGIT-UI-LIBRARIES)
1. TopBar: pass `showArrow` to ChangeCity/ChangeLanguage dropdowns (matches Header molecule spec).
2. Button: use a token for the disabled state instead of inline `#9E9E9E`.
3. Input/Switch/Header-label disabled colors: replace hardcoded `#E0E0E0`/`#BFBFBF`/`#9E9E9E` with `--digitv2` tokens.
4. Popup footer: media queries → container queries so scaled previews render the mobile layout.
5. Reconcile the docs palette with library reality: document the accessible warning text colors (`#5C450A`, `#9E5F00`), the disabled token discrepancy (`#B1B4B6` in lib vs `#C5C5C5` in docs), and consider a "Primary 2 bg" tint token.

## Changed files (15)
`packages/css`: appConfiguration.scss, index.scss, campaign.scss, payment.scss, theme-variables.css
`campaign-manager`: FullConfigWrapper.js, SidePanelApp.js, MobileBezelFrame.js, AppPreview.js, ProgressBar.js, TableTemplate.js, NewLayoutRenderer.js, AppFeatures.js, MultiSelectDropdown.js, CommodityManagement (BulkStockUpload/CommodityDashboard/StockComponent)
