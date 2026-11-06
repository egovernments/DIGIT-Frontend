# Campaign Manager — HCM v2.2 Technical Documentation

**Module:** `@egovernments/digit-ui-module-campaign-manager`
**Release:** HCM v2.2
**Stack:** React 19, Webpack 5
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Overview

The Campaign Manager module handles the complete campaign lifecycle — creating a campaign, selecting boundaries, configuring the mobile app, managing delivery cycles, and setting up attendance registers.

In HCM v2.2 the headline change is **Group Vaccination**: a single campaign round can be delivered through more than one **delivery strategy** — `HOUSEHOLDSTRATEGY` (the door-to-door round) and `OUTSIDEHOUSEHOLD` (which covers the Transit Post and Communal Living Facility session flows) — each with its own app configuration, delivery rules and resources.

Alongside it, App Configuration gains new field types, panel controls and preview behaviour; POLIO campaign cloning carries delivery rules forward; and an accessibility pass covers the campaign and App Configuration screens.

**This release adds no new API endpoints and no new deployable variant.** Group Vaccination is carried entirely on the existing campaign payload.

---

## What's New in v2.2

### 1. Group Vaccination — Delivery Strategies

**Ticket:** HCMPRE-4413
**PRs:** [#4524](https://github.com/egovernments/DIGIT-Frontend/pull/4524), [#4668](https://github.com/egovernments/DIGIT-Frontend/pull/4668)

A campaign type opts into delivery strategies by declaring `deliveryMethods` on its `HCM-PROJECT-TYPES.projectTypes` record. **No campaign type is hardcoded in the module** — a type declaring none keeps the existing cycle screens untouched.

#### The Delivery Setup step

`pages/employee/deliverySetup/index.js` replaces `CycleConfiguration` for campaigns that use strategies. It renders only when both conditions hold:

```js
const applies = usesDeliveryMethods(projectTypeRecord, roundType);
// => getDeliveryMethods(record).length > 0 && roundType !== "MULTI_ROUND"
```

When `applies` is false, the component returns `<CycleConfiguration />` unchanged, so the existing flow is untouched.

The step captures one delivery date range plus the ticked strategies, and publishes upward in the shape `CycleConfiguration` already uses:

```js
onSelect("cycleConfigure", {
  cycleConfgureDate: { cycle: 1, deliveries: selected.length || 1, IsDisable: true, observationStrategy },
  cycleData: fromDate && toDate ? [{ key: 1, fromDate, toDate }] : [],
  deliveryMethods: selected,
  deliveryConfig,
});
```

Keeping the published shape identical means downstream steps — delivery rules, summary, save — need no branch for strategy campaigns.

The saved selection is put through `normaliseSelection` as it is hydrated, so a code the campaign type no longer offers is dropped before it can reach `cycleConfigure`. This has to happen inside the hydration effect rather than in the effect that follows it: that effect reads `selected` from the render it was queued in, so it cannot see what hydration is setting, and its own dependencies do not change when hydration runs. `applies` already requires the type to declare methods, so the list is never normalised against an empty one.

#### Where strategies are stored

| Location | Shape | Written by |
|---|---|---|
| `additionalDetails.cycleData.deliveryMethods` | `["HOUSEHOLDSTRATEGY", "OUTSIDEHOUSEHOLD"]` | Every campaign save, via `carryDeliveryMethods` |
| `deliveryRules[].cycles[].deliveries[].deliveryMethod` | `"OUTSIDEHOUSEHOLD"` | Delivery rules, per delivery |
| `additionalDetails.roundType` | `"SINGLE_ROUND"` / `"MULTI_ROUND"` | `transformCreateData` / `transformUpdateCreateData` |

> **Strategies are written on every save, not only on the delivery step.** project-factory stores whatever `additionalDetails` it receives, so a partial save from an unrelated step previously erased them. Every save path now routes through `carryDeliveryMethods` before writing.

> **They are also cleared when the campaign stops using them.** The campaign type can be changed from step 1 after a draft is saved, and nothing clears `cycleData` on that change. `SetupCampaign`'s `carryDeliveryMethodsForSave` therefore withholds *both* fallbacks — the draft's own saved codes as well as the type's defaults — when `usesDeliveryMethods` is false for the type now selected. Leaving the field off the save is what clears it.

#### `utils/deliveryMethods.js` — the single resolver

All strategy logic lives in one module so no screen re-derives it.

| Export | Purpose |
|---|---|
| `getDeliveryMethods(projectTypeRecord)` | The type's declared methods, sorted by `order`. Returns `[]` when none. |
| `isSingleRound(roundType)` | `roundType !== "MULTI_ROUND"`. **An absent round type counts as single** — matches what `CycleSelection` falls back to. |
| `usesDeliveryMethods(record, roundType)` | Whether the strategy screens apply at all. The gate every screen should use. |
| `getRoundType(campaignData, sessionFormData)` | Round type for the campaign being edited — persisted value first, then the wizard's own round-type step. |
| `getSelectedMethodCodes(cycleConfigure)` | Codes the user has ticked, read off the cycle-configure session value. |
| `getDefaultMethodCodes(methods)` | Codes marked `isDefault: true` in MDMS. Applied only when nothing is saved yet. |
| `normaliseSelection(selectedCodes, methods)` | Reorders to the type's declared order and drops anything no longer offered. |
| `resolveDeliveryMethodCodes({ cycleConfigure, savedCycleData, methods })` | Resolution order: session → saved campaign → MDMS defaults. Returns `undefined` when all three are empty. |
| `carryDeliveryMethods(cycleData, savedCycleData, methods)` | `cycleData` with `deliveryMethods` filled in. **Use this wherever `additionalDetails.cycleData` is written.** |
| `getCampaignDeliveryMethods(campaignData)` | Strategies on a saved campaign — cycle data first, falling back to the codes stamped on each delivery. |
| `projectUsesDeliveryMethods(project)` | Same question for screens that work from the project rather than the campaign (e.g. `DateAndCycleUpdate`). |

#### Round type is part of the gate

Strategies apply to a **single round only**: one cycle carrying one delivery date range. A multi-round campaign goes through the cycle screens and never sees the Delivery Setup step.

Three places must agree on this, or a campaign can be gated on a step it cannot reach:

| Location | What it decides |
|---|---|
| `deliverySetup/index.js` | Whether the strategy step renders at all |
| `CampaignDetails.js` → `deliveryStrategyPending` | Whether the Mobile App card is locked pending strategy configuration |
| `SetupCampaign.js` → `defaultDeliveryMethodsForSave` | Whether MDMS defaults are written to this campaign's `cycleData` |

All three now call `usesDeliveryMethods` / `isSingleRound`. `CampaignDetails` additionally releases the gate once `status === "created"`, since no step remains on that screen that could satisfy it.

#### Date storage format — a gotcha

Delivery dates are **not** stored as the picker's `YYYY-MM-DD`. `toStoredDate` shifts them so the ISO text reads as the day that was picked:

```js
localDate.setHours(0, 0, 0, 0);
return new Date(localDate.getTime() + DATE_STORAGE_OFFSET_IN_MS).toISOString(); // +19800000 (IST)
```

This matches what `DateSelection` does for campaign dates and `CycleConfiguration` for cycle dates, so all three agree and the epoch conversion at save time reads the right day.

> **Comparing a delivery date against a campaign date requires normalising both through the same helpers.** Campaign dates are held as the picker's raw `YYYY-MM-DD`; delivery and cycle dates are held shifted. A direct comparison is wrong.

> **Known limitation:** the offset is the hardcoded IST value, and `new Date("YYYY-MM-DD")` parses as UTC midnight. The round trip is exact only for local offsets between UTC+0 and UTC+5:30 — which covers every current deployment target (India +5:30, Uganda +3, Mozambique +2, Nigeria +1, UTC). Outside that band dates store one day early. Latent, not live.

**New files:**
- `pages/employee/deliverySetup/index.js` — the step
- `components/CreateCampaignComponents/DeliveryMethodSelection.js` — the strategy picker (`{ methods, selected, onChange, disabled }`)
- `utils/deliveryMethods.js` — the resolver

**New app configs:** `HOUSEHOLDSTRATEGY.POLIO`, `OUTSIDEHOUSEHOLD.POLIO` (the latter holds both the Transit Post and CLF flows).

---

### 2. App Configuration — Field Types

| Change | Ticket |
|---|---|
| Multi-select dropdown field type | HCMPRE-4587 |
| Dedicated icon for the multi-select type | HCMPRE-4598 |
| Reworked options handling for dropdown / radio / multi-select | HCMPRE-4599 |
| Date-of-birth composite — date *or* age — in the preview | — |

The DOB composite renders through a new `components/DobTemplate.js`, letting a single field accept either an exact date or an age.

---

### 3. App Configuration — Panel and Drawer

- **Popup configuration separated from button configuration** (HCMPRE-4613) — the two are configured independently.
- **Button labels configurable independently of the action** (HCMPRE-4593), via `helpers/footerButtonType.js` (`withFooterButtonTypes`, `withoutFooterButtonTypes`).
- **Panel properties hideable per field name**, not only per field type — `helpers/panelItemVisibility.js` (`isPanelItemEnabledForField`).
- **Group fields get an enable/disable toggle.** A switched-off group's validation no longer blocks save — `helpers/groupValidation.js` (`evaluateGroupExpression`).
- **GPS popup timer** (minutes/seconds, configurable minimum). Every limit and message comes from `FieldPropertiesPanelConfig`; none are hardcoded.
- **Number inputs no longer silently clamp a typed value.** `helpers/numberLimits.js` (`isOutsideLimits`) drives the configured error and help text, and blocks save so the user sees why the value was rejected.
- **Info card for age conditions** (HCMPRE-4553).

---

### 4. App Configuration — Preview

#### Opt-in value preview for `textTemplate`

**PR:** [#4631](https://github.com/egovernments/DIGIT-Frontend/pull/4631)

Setting `isFieldValue: false` on a `textTemplate` node previews the **label that a value will replace**, underlined to mark it as dynamic — rather than rendering the key itself.

#### `groupAsSingleElement`

A container node can opt in with `"groupAsSingleElement": true` and is then treated as one element throughout the panel:

| Function | Behaviour with the flag |
|---|---|
| `extractTemplateFields` | Lists the node and stops — its parts do not become rows of their own |
| `isFieldEditable` | Lets the node through. `card`/`row`/`column` are `editable: false` in the field-type master, so without this the group row would be dropped and its parts are already gone |
| `hideField` | Pushes the switch down the whole subtree |
| `updateParentVisibility` | Derives a parent from its children — without the subtree marking, a container whose children were still visible switched straight back on and the toggle did nothing |

The app reads this config too, so marking descendants keeps a consumer that only looks at leaves correct.

**Effect:** Transit Post Overview went from 13 rows to 3. A count and the label explaining it can no longer be hidden separately.

> Opt-in throughout — a config without the flag behaves exactly as before.

#### Other preview changes

- **Resource card built from the resources actually configured** on the campaign. A campaign that uses no delivery strategies stamps no `deliveryMethod` on its deliveries, so the card reads those deliveries rather than falling back to placeholder options.
- **Menu card alignment and icon position** read from the config's `styling` block.

#### Label text sanitising

`helpers/labelText.js` exports `withoutEmojis` and `toSentenceCase` for the wording a user types into the panel.

> The emoji regex matches the zero-width joiner (U+200D) **only between two pictographs**, never on its own. The joiner is an ordinary letter in Malayalam chillu and Sinhala/Bengali conjuncts, so stripping every occurrence would silently corrupt valid wording. The zero-width non-joiner (U+200C) is not matched at all.

---

### 5. Campaign Cloning with Delivery Strategies

A copy of a campaign that uses delivery strategies carries the **delivery rules** of its source. Campaigns without strategies are unchanged and re-enter them in the wizard.

The condition is `getCampaignDeliveryMethods(sourceCampaign).length > 0` — the campaign is asked, not its type. What makes the rules worth copying is that they are strategy-shaped (conditions, products, one tab per strategy), which is a property of the campaign. In practice this is POLIO today, since it is the only type declaring `deliveryMethods`.

| Behaviour | Keyed on |
|---|---|
| Success popup on the created campaign | `campaignCloned` in router state, read once into state by the campaign page |
| Info card listing the two remaining steps | `getCampaignDeliveryMethods(campaignData).length > 0`, `additionalDetails.cloneFrom`, **and** the campaign still being a draft |
| Create Campaign held disabled | Copied cycle dates falling outside the new campaign's dates |

> The info card and the copy itself ask the same question (`isStrategyCopyDraft` in `CampaignDetails.js`), so the checklist cannot appear for a copy that was never given any rules to correct.

The previous behaviour confirmed the copy with a toast on the listing the user left a second later, then let them press Create Campaign and fail with an invalid-dates toast having created nothing. The 1-second `setTimeout` around the redirect is gone, so the copy opens straight away.

`HCM_CLONE_SUCCESS_DESCRIPTION` takes the campaign name as `{{campaignName}}`.

---

### 6. Accessibility

**PRs:** [#4514](https://github.com/egovernments/DIGIT-Frontend/pull/4514), [#4530](https://github.com/egovernments/DIGIT-Frontend/pull/4530) and follow-ups

- `main` landmark and page heading added on six campaign pages
- App Configuration labels, roles and keyboard reachability — clickable `<div>` controls now carry `role="button"`, `tabIndex={0}` and Enter/Space handling via the shared `activateOnKey` helper in `src/utils/index.js`
- `srOnlyStyle` (same module) gives a screen reader a heading or name where the design has no room to show one
- Loader screen and heading hierarchy corrections

`ACCESSIBILITY-REPORT.md` at the `web/` root records the audit.

---

## Changes to Existing Features

### Delivery strategies written on every save

project-factory stores whatever `additionalDetails` it receives, so a save from a step that knew nothing about strategies erased them. All three draft-save paths in `SetupCampaign.js` now resolve through a single `defaultDeliveryMethodsForSave` helper, so the guard cannot be applied to one path and missed on another.

---

### Round type now governs which delivery screens appear

Previously `usesDeliveryStrategies` in `CampaignDetails.js` asked only whether the campaign *type* declared strategies. A multi-round campaign of a strategy-declaring type was therefore gated on a step that never renders — locking the Mobile App card with nothing on screen able to unlock it. The gate now asks the same question the step asks.

---

### Boundary selection — code comparison instead of count

`SelectingBoundaryComponent.js` compared the number of selected boundaries to decide whether a selection had changed. Swapping one boundary for another leaves the count identical, so the change was missed: the old entry was kept, the new one lost, and the children of the removed boundary stayed behind.

The comparison is now by code (`isSameSelection`), and it guards **both** the level rebuild and the update shortcut that follows it. The shortcut maps over the existing selection, so it can update entries but never add or drop one — correct only when the selection has genuinely not changed.

---

## Bug Fixes

| Ticket / PR | Fix |
|---|---|
| HCMPRE-4704 | Keep the boundary level list when the lowest level is unknown |
| HCMPRE-4695 | Keep a swapped boundary selection — compare codes rather than counts, at both the level rebuild and the update shortcut |
| HCMPRE-4692 | Update-dates fix |
| HCMPRE-4686 | Do not cache an empty app-flow config search |
| HCMPRE-4600 | Multi-select option localisation; guard on label when adding a field |
| HCMPRE-4590 | workbench-ui version |
| HCMPRE-4541 | Microplan sheet errors read `errorMessage`, not `errorCode` |
| HCMPRE-4526 | Mobile number prefix |
| HCMPRE-4520 | Rollup of 4508, 4520, 4531, 4415 ([#4533](https://github.com/egovernments/DIGIT-Frontend/pull/4533)) |
| — | Delivery strategy gating corrected for multi-round campaigns (`CampaignDetails.js`, `SetupCampaign.js`) |
| — | Delivery end date validated against the start date — the picker's `min` is bypassed by typing into the text input, since `DatePicker` passes `e.target.value` through unchecked |
| — | Resource card products restored for campaigns using no delivery strategies — those deliveries carry no `deliveryMethod`, so the strategy filter dropped them all |
| — | Emoji stripping no longer removes the zero-width joiner used by Indic scripts |
| — | Option delete icon made keyboard operable, with a screen-reader label naming the option it removes |
| [#4685](https://github.com/egovernments/DIGIT-Frontend/pull/4685) | POLIO download template |
| — | Payments boundary selection written to session storage during render — moved into `useEffect`, and the `children` array stripped before storing |
| — | HRMS deactivate popup passed `alignFieldPairVerically` (misspelled), so vertical alignment never applied |
| — | `rainmaker-hcm-dss` removed from the localisation call |

---

## Configuration Required Before Deploying

### 1. MDMS masters

| Master | Required for |
|---|---|
| `HCM-ADMIN-CONSOLE.FormConfigTemplate` → `HOUSEHOLDSTRATEGY.POLIO` | House To House strategy app config |
| `HCM-ADMIN-CONSOLE.FormConfigTemplate` → `OUTSIDEHOUSEHOLD.POLIO` | Transit Post and CLF flows |
| `HCM-ADMIN-CONSOLE.FieldPropertiesPanelConfig` | Panel properties, number limits, GPS timer bounds and messages |
| `HCM-ADMIN-CONSOLE.FieldTypeMappingConfig` | Field types, including the new multi-select dropdown |

### 2. `deliveryMethods` on the POLIO project type

Added to the `data` block of the `HCM-PROJECT-TYPES.projectTypes` record whose `uniqueIdentifier` is `POLIO`:

```jsonc
{
  "code": "POLIO",
  "roundTypes": ["SINGLE_ROUND"],
  "deliveryMethods": [
    {
      "code": "HOUSEHOLDSTRATEGY",
      "order": 1,
      "isDefault": true,
      "i18nKey": "CAMPAIGN_DELIVERY_METHOD_HOUSEHOLD",
      "descriptionI18nKey": "CAMPAIGN_DELIVERY_METHOD_HOUSEHOLD_DESC"
    },
    {
      "code": "OUTSIDEHOUSEHOLD",
      "order": 2,
      "isDefault": true,
      "i18nKey": "CAMPAIGN_DELIVERY_METHOD_OUTSIDEHOUSEHOLD",
      "descriptionI18nKey": "CAMPAIGN_DELIVERY_METHOD_OUTSIDEHOUSEHOLD_DESC"
    }
  ]
}
```

| Field | Required | Effect |
|---|---|---|
| `code` | Yes | The strategy code. Stamped onto each delivery as `deliveryMethod`, and used to pick the matching `FormConfigTemplate` |
| `order` | Yes | Display order on the Delivery Setup step, the tab order on Delivery Rules, and the order strategies are persisted in — the selection is handed back in **declared order, not click order**, so tabs stay stable |
| `i18nKey` | Recommended | The checkbox label. **Falls back to the raw `code` when absent**, so a missing key shows `HOUSEHOLDSTRATEGY` on screen |
| `descriptionI18nKey` | Optional | Description line under the label. Omitted entirely when absent |
| `isDefault` | Optional | Pre-ticks the method for a campaign with nothing saved yet. Never overrides a user choice or a saved selection |

> **Transit Post and CLF are not separate `deliveryMethods`.** There are two strategy codes — `HOUSEHOLDSTRATEGY` and `OUTSIDEHOUSEHOLD`. Transit Post and Communal Living Facility are two *flows inside* the `OUTSIDEHOUSEHOLD.POLIO` app config (`transitSessionOverview` and `clfSessionOverview`), not strategies of their own.

Labels resolve through each entry's own `i18nKey` rather than a key built from the code, so **a strategy added in MDMS renders correctly without a frontend release** — no strategy code or copy is held in the module.

### 3. `roundTypes` on **every** project type record

`CycleSelection.js` reads `roundTypes` off the selected campaign type to decide which round options to offer:

| `roundTypes` value | Options shown | Radios | Auto-selected |
|---|---|---|---|
| `["SINGLE_ROUND"]` | Single round only | Disabled | `HCM_SINGLE_ROUND` |
| `["MULTI_ROUND"]` | Multi round only | Disabled | `HCM_MULTI_ROUND` |
| `["SINGLE_ROUND", "MULTI_ROUND"]` | Both | **Enabled** | Per `defaultRoundType`, else single round |
| **absent / empty** | **Both** | **Disabled** | `HCM_SINGLE_ROUND` |

The radios are disabled whenever fewer than two options are allowed (`roundTypes.length < 2`), which is correct for a type that genuinely offers one round type.

> **Issue [#4706](https://github.com/egovernments/DIGIT-Frontend/issues/4706):** a record carrying **no** `roundTypes` renders *both* radios and disables them. The step is not blocked — `HCM_SINGLE_ROUND` is auto-selected and published, so the user can proceed — but the screen shows two dead controls and gives no indication why. Add `roundTypes` to every project type record, not only POLIO.

`defaultRoundType` only takes effect when `roundTypes` holds two entries and includes `MULTI_ROUND`. Where it is absent, the module falls back to a hardcoded list of known multi-round types (`MULTI_ROUND_BY_DEFAULT_PROJECT_TYPES = ["MR-DN"]` in `CycleSelection.js`) — declaring `defaultRoundType` in MDMS is preferred, since the hardcoded list requires a release to change.

> `roundTypes` is what the UI reads. The record's own `type` field (e.g. `"multiround"`) is **not** consulted for this decision, so a record may legitimately carry `"type": "multiround"` alongside `"roundTypes": ["SINGLE_ROUND"]` — as the live POLIO record does.

> `useCustomMDMS` resolves the tenant with `Digit.ULBService.getCurrentTenantId()`, which overrides a state id passed by the caller — so the records must exist under the tenant the user is logged into.

### 4. Localisation keys

| Key / prefix | Used for |
|---|---|
| `GV_*` | Group Vaccination labels, metrics and validation messages |
| `CAMPAIGN_DELIVERY_METHOD_*` | Strategy names and descriptions — **one pair per `deliveryMethods` entry**, matching its `i18nKey` and `descriptionI18nKey` |
| `HCM_DELIVERY_SETUP_HEADING`, `HCM_DELIVERY_SETUP_DESC` | Delivery Setup step heading and description |
| `HCM_DELIVERY_DATES_HEADING`, `HCM_DELIVERY_DATES_DESC`, `HCM_DELIVERY_DATES_LABEL` | Delivery date range card |
| `HCM_CLONE_*` | POLIO clone popup and remaining-steps info card |
| `APP_CONFIG_DELETE_OPTION` | Screen-reader label on the option delete icon |

> A missing `i18nKey` message is not a hard failure — `DeliveryMethodSelection` falls back to the raw strategy code. A missing `descriptionI18nKey` message renders the key itself, so either supply it or omit the field from MDMS.

> Where a side-panel label is configured separately from the device value, **both** keys need messages. A `column` node carries `label` (read by `NewDraggableField` for the panel) while its child `textTemplate` carries `value` (read by `TextTemplate` for the preview and the device) — these are different properties on different elements and can hold different keys.

---

## Roles and Permissions

Unchanged from v2.1.

| Role | What they can do |
|---|---|
| All authenticated employees | View campaign list and campaign details |
| System administrator | Retry a failed campaign creation |
| Campaign-scoped users | Create or update campaigns within their assigned boundary scope |

Role-based access for campaign actions is configured via MDMS — not hardcoded.

---

## New API Endpoints (v2.2)

**None.** Group Vaccination rides entirely on the existing campaign payload.

| Endpoint | Method | Purpose |
|---|---|---|
| `/project-factory/v1/project-type/search` | POST | Search campaigns; read saved delivery strategies |
| `/project-factory/v1/project-type/create` | POST | Create campaign |
| `/project-factory/v1/project-type/update` | POST | Update campaign; write delivery strategies |
| `/boundary-service/boundary-relationships/_search` | GET | Fetch boundary relationships |

---

## Localisation

All translation keys are centralised in `src/utils/i18nKeyConstants.js` under the `I18N_KEYS` constant.

| Namespace | Used for |
|---|---|
| `I18N_KEYS.COMMON` | Shared labels across campaign screens |
| `I18N_KEYS.CAMPAIGN_CREATE` | Campaign creation wizard labels |
| `I18N_KEYS.APP_CONFIGURATION` | App Configuration screen labels |
| `I18N_KEYS.COMMODITY_MANAGEMENT` | Commodity Management screen labels |

New keys in v2.2 cover Group Vaccination (`GV_*`), POLIO cloning (`HCM_CLONE_*`), and App Configuration accessibility labels.

---

## Summary of New Components, Helpers and Utilities

| File | Location | What it does |
|---|---|---|
| `index.js` (Delivery Setup) | `src/pages/employee/deliverySetup/` | The delivery strategy step. Falls through to `CycleConfiguration` when strategies do not apply |
| `DeliveryMethodSelection.js` | `src/components/CreateCampaignComponents/` | Strategy picker — `{ methods, selected, onChange, disabled }` |
| `deliveryMethods.js` | `src/utils/` | Single resolver for delivery strategies and round type |
| `DobTemplate.js` | `src/pages/employee/NewAppConfiguration/components/` | Date-of-birth composite (date or age) in the preview |
| `numberLimits.js` | `src/pages/employee/NewAppConfiguration/helpers/` | `isOutsideLimits` — number input bounds |
| `groupValidation.js` | `src/pages/employee/NewAppConfiguration/helpers/` | `evaluateGroupExpression` — group enable/disable validation |
| `panelItemVisibility.js` | `src/pages/employee/NewAppConfiguration/helpers/` | `isPanelItemEnabledForField` — per-field-name panel property visibility |
| `labelText.js` | `src/pages/employee/NewAppConfiguration/helpers/` | `withoutEmojis`, `toSentenceCase` — label text sanitising |
| `footerButtonType.js` | `src/pages/employee/NewAppConfiguration/helpers/` | `withFooterButtonTypes`, `withoutFooterButtonTypes` |
| `activateOnKey`, `srOnlyStyle` | `src/utils/index.js` | Keyboard activation for `role="button"` divs; visually hidden accessible text |

---