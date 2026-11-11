# Campaign Manager

**Release:** HCM v2.2
**Previous release:** [HCM v2.1](../v2.1/RELEASE-NOTES.md)
**Module:** `@egovernments/digit-ui-module-campaign-manager`

> For the all-module view of this release, see the [HCM v2.2 release notes](../../../../../../../docs/releases/v2.2/RELEASE-NOTES.md).

---

## Overview

Campaign Manager provides the full campaign lifecycle — creating a campaign, configuring the mobile app, uploading boundary data, managing cycles and delivery rules, and setting up attendance registers.

In HCM v2.2 it gains **Group Vaccination**: the ability to deliver one campaign round through several delivery strategies, each with its own app configuration, delivery rules and resources.

---

## What is this release about?

This is a **feature release** for Campaign Manager — the only module with substantial change in HCM v2.2.

1. **Group Vaccination** — one campaign round delivered through multiple delivery strategies
2. **App Configuration** — new field types, panel and drawer capabilities, and preview improvements
3. **POLIO campaign cloning** — delivery rules carried forward to the copy
4. **Accessibility pass** across campaign and App Configuration screens

There is **no platform migration and no new deployable variant** in this release. The API surface is unchanged — no new endpoints.

---

## ⚠️ Action Required Before Upgrading

All of it is data configuration. There are no infrastructure changes.

### 1. Configure MDMS masters

| MDMS master | Required for | Notes |
|---|---|---|
| `HCM-ADMIN-CONSOLE.FormConfigTemplate` → `HOUSEHOLDSTRATEGY.POLIO` | Group Vaccination | App config for the House To House strategy |
| `HCM-ADMIN-CONSOLE.FormConfigTemplate` → `OUTSIDEHOUSEHOLD.POLIO` | Group Vaccination | App config for Transit Post and CLF flows |
| `HCM-ADMIN-CONSOLE.FieldPropertiesPanelConfig` | App Configuration panel | Drives panel properties, number limits, GPS timer bounds and their messages |
| `HCM-ADMIN-CONSOLE.FieldTypeMappingConfig` | App Configuration field types | Includes the new multi-select dropdown type |

---

### 2. Add `deliveryMethods` to the POLIO project type

A campaign type opts into delivery strategies by declaring `deliveryMethods` on its `HCM-PROJECT-TYPES.projectTypes` record. **No campaign type is hardcoded in the module** — a type that declares none keeps the existing cycle screens unchanged.

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

| Field | Effect |
|---|---|
| `code` | The strategy code — stamped on each delivery and used to pick the matching app config |
| `order` | Display order on Delivery Setup, tab order on Delivery Rules, and the order strategies are saved in |
| `i18nKey` | The checkbox label. **Falls back to the raw code when absent**, so a missing key shows `HOUSEHOLDSTRATEGY` on screen |
| `descriptionI18nKey` | Optional description under the label; omitted when absent |
| `isDefault` | Pre-ticks the method for a campaign with nothing saved yet. Never overrides a user choice |

> **Transit Post and CLF are not separate delivery methods.** There are two strategy codes — `HOUSEHOLDSTRATEGY` and `OUTSIDEHOUSEHOLD`. Transit Post and Communal Living Facility are two sets of *flows inside* the `OUTSIDEHOUSEHOLD.POLIO` app config (`transitSessionSetup`, `transitSessionOverview`, … and `clfSessionSetup`, `clfSessionOverview`, …), entered through a shared `selectVaccinationLocation` flow — not strategies of their own.

Because labels come from each entry's own `i18nKey`, a strategy added in MDMS renders correctly without a frontend release.

---

### 3. Add `roundTypes` to project type records

Delivery strategies apply to a **single round only**: one cycle carrying one delivery date range. A multi-round campaign is sent through the cycle screens instead and never sees the Delivery Setup step.

| `roundTypes` value | Options shown | Radios | Auto-selected |
|---|---|---|---|
| `["SINGLE_ROUND"]` | Single round only | Disabled | Single round |
| `["MULTI_ROUND"]` | Multi round only | Disabled | Multi round |
| `["SINGLE_ROUND", "MULTI_ROUND"]` | Both | **Enabled** | Per `defaultRoundType`, else single round |
| **absent / empty** | **Both** | **Disabled** | Single round |

Any type declaring `deliveryMethods` should declare `roundTypes: ["SINGLE_ROUND"]`.

> **Issue #4706:** a record carrying **no** `roundTypes` renders *both* round options and disables them. The step is not blocked — single round is auto-selected and the user can proceed — but the screen shows two dead controls with no indication why. Add `roundTypes` to every project type record, not only the POLIO one.

`defaultRoundType` takes effect only when `roundTypes` holds two entries and includes `MULTI_ROUND`. Where it is absent, the module falls back to a hardcoded list of known multi-round types (`["MR-DN"]`), which needs a release to change — so declaring `defaultRoundType` in MDMS is preferred.

The module also guards on round type independently, so a multi-round campaign is never gated on a step it cannot reach — but the MDMS declaration is the primary control and should be set correctly.

---

### 4. Add localisation keys

| Key / prefix | Used for |
|---|---|
| `GV_*` | All Group Vaccination labels, metrics and validation messages |
| `CAMPAIGN_DELIVERY_METHOD_*` | Strategy names and descriptions on the Delivery Setup step — **one pair per `deliveryMethods` entry**, matching its `i18nKey` and `descriptionI18nKey` |
| `HCM_DELIVERY_SETUP_HEADING`, `HCM_DELIVERY_SETUP_DESC` | Delivery Setup step heading and description |
| `HCM_DELIVERY_DATES_HEADING`, `HCM_DELIVERY_DATES_DESC`, `HCM_DELIVERY_DATES_LABEL` | Delivery date range card |
| `HCM_CLONE_*` | POLIO clone success popup and the remaining-steps info card |
| `HCM_CLONE_SUCCESS_DESCRIPTION` | Takes the campaign name as `{{campaignName}}` |
| `APP_CONFIG_DELETE_OPTION` | Screen-reader label on the option delete icon in the App Configuration drawer |

> A missing `i18nKey` message is not a hard failure — the checkbox falls back to the raw strategy code (`HOUSEHOLDSTRATEGY`), which is visible to the user. A missing `descriptionI18nKey` message renders the key itself, so either supply it or omit the field from MDMS.

> Where a side-panel label is configured separately from the value shown on the device, both keys need messages — for example `GV_METRIC_VACCINATED_TODAY` and `GV_METRIC_VACCINATED_TODAY_PANEL`.

---

## What's New

### Group Vaccination — Transit Post and CLF `HCMPRE-4413` (#4524)

A POLIO campaign can deliver a single round through several **delivery strategies** rather than one house-to-house round:

| Strategy code | Where vaccination happens | App config |
|---|---|---|
| `HOUSEHOLDSTRATEGY` | The existing door-to-door round | `HOUSEHOLDSTRATEGY.POLIO` |
| `OUTSIDEHOUSEHOLD` | Anywhere outside the household — covers both the **Transit Post** and **Communal Living Facility** session flows | `OUTSIDEHOUSEHOLD.POLIO` |

**How it works:**

- A new **Delivery Setup** step (`pages/employee/deliverySetup/`) lets the user pick the delivery date range and tick the strategies the campaign will use.
- Delivery Rules then shows **one tab per selected strategy**, each with its own conditions and resources.
- A campaign type opts in by declaring `deliveryMethods` on its project type record. A type declaring none keeps the existing cycle screens — nothing is hardcoded in the module.
- `utils/deliveryMethods.js` is the single resolver for the chosen strategies, reading in order: the wizard session → the saved campaign (`additionalDetails.cycleData.deliveryMethods`) → the `deliveryMethod` stamped on each saved delivery.
- Strategies are written on **every** campaign save (#4668). project-factory stores whatever `additionalDetails` it receives, so a partial save from an unrelated step previously erased them.
- `deliveryMethod` is carried into the delivery-config templates, and the summary screen lists the configured strategies.

**Flow:**
```text
Campaign type → Round type (single) → Campaign dates
  → Delivery Setup  (delivery date range + strategies)
  → Delivery Rules  (one tab per strategy: conditions + resources)
  → Boundary / Upload → Summary → Create
```

New app configs: `HOUSEHOLDSTRATEGY.POLIO`, `OUTSIDEHOUSEHOLD.POLIO`.

See also the [Group Vaccination HLD and LLD](../../designDocs/).

---

### App Configuration — field types

| Change | Ticket |
|---|---|
| Multi-select dropdown field type | `HCMPRE-4587` |
| Dedicated icon for the multi-select type | `HCMPRE-4598` |
| Reworked options handling for dropdown / radio / multi-select | `HCMPRE-4599` |
| Date-of-birth composite — date *or* age — in the preview (`DobTemplate.js`) | — |

---

### App Configuration — panel and drawer

- **Popup configuration separated from button configuration** `HCMPRE-4613` — the two are now configured independently.
- **Button labels configurable independently of the action** `HCMPRE-4593`.
- **Panel properties hideable per field name**, not only per field type.
- **Group fields get an enable/disable toggle.** A switched-off group's validation no longer blocks save.
- **GPS popup timer** (minutes/seconds, with a configurable minimum). Limits and messages come entirely from `FieldPropertiesPanelConfig` — none are hardcoded.
- **Number inputs no longer silently clamp a typed value.** They show the configured error and help text and block save, so the user sees why the value was rejected.
- **Info card for age conditions** `HCMPRE-4553`.

---

### App Configuration — preview

- **Opt-in value preview for `textTemplate`** (#4631). Setting `isFieldValue: false` previews the label that a value will replace, underlined to mark it as dynamic.
- **`groupAsSingleElement`** treats a container as one element, so a count and the label explaining it can no longer be hidden separately. Transit Post Overview went from 13 rows to 3.
- **Resource card built from the resources actually configured** on the campaign, rather than placeholder options.
- **Menu card alignment and icon position** read from the config's `styling` block.

New helpers: `numberLimits.js`, `groupValidation.js`, `panelItemVisibility.js`, `labelText.js`, `footerButtonType.js`.

---

### Campaign cloning — POLIO

- A copy of a campaign that uses delivery strategies now carries its **delivery rules** forward. Campaigns without strategies are unchanged and re-enter them in the wizard. In practice this means POLIO, which is the only campaign type declaring `deliveryMethods` today — but the behaviour follows the strategies the campaign carries, not its type.
- The copy is confirmed by a **popup on the campaign it created**, not a toast on the listing the user leaves a second later. The 1-second redirect delay is gone, so the copy opens straight away.
- An **info card above the summary** lists the two steps left — edit the delivery strategy, then update the microplan. It is keyed on `additionalDetails.cloneFrom`, on the strategies the campaign carries and on it still being a draft, so it appears only for a copy that was actually given delivery rules, and disappears once the campaign is created.
- **Create Campaign is held disabled** while copied cycle dates fall outside the new campaign's dates. Previously it submitted and only raised a toast, creating nothing.

---

## What Changed in Existing Features

### Delivery strategies written on every save

project-factory stores whatever `additionalDetails` it receives. A save from a step that knew nothing about strategies previously erased them. Every save path now resolves the strategies through `carryDeliveryMethods` before writing, so a step that does not know about them cannot drop them.

---

### Round type now governs which delivery screens appear

Delivery strategies apply to a single round only. The Delivery Setup step, the campaign details gating, and the draft save path all now agree on this, so a multi-round campaign keeps the cycle screens, is never gated on a step it cannot reach, and never has strategies written to its `cycleData`.

---

### Accessibility pass

WCAG fixes across the console (#4514, #4530 and follow-ups):

- `main` landmark and page heading on six campaign pages
- App Configuration labels, roles and keyboard reachability — clickable controls that were mouse-only now carry `role="button"`, `tabIndex` and Enter/Space handling
- Loader screen and heading hierarchy corrections

`ACCESSIBILITY-REPORT.md` records the audit.

---

## Bug Fixes

| Ticket | Fix |
|---|---|
| `HCMPRE-4704` | Keep the boundary level list when the lowest level is unknown |
| `HCMPRE-4695` | Keep a swapped boundary selection — compare codes rather than counts, at both the level rebuild and the update shortcut |
| `HCMPRE-4692` | Update-dates fix |
| `HCMPRE-4686` | Do not cache an empty app-flow config search |
| `HCMPRE-4600` | Multi-select option localisation; guard on label when adding a field |
| `HCMPRE-4590` | workbench-ui version |
| `HCMPRE-4541` | Microplan sheet errors read `errorMessage`, not `errorCode` |
| `HCMPRE-4526` | Mobile number prefix |
| `HCMPRE-4520` | Rollup of 4508, 4520, 4531, 4415 (#4533) |
| — | Delivery strategy gating corrected for multi-round campaigns — the Mobile App card is no longer gated on a step a multi-round campaign never sees, and the campaign type's default strategies are no longer written to a multi-round campaign's `cycleData` |
| — | Delivery end date validated against the start date on the Delivery Setup step; the picker's `min` is bypassed by typing into the text input |
| — | Resource card products restored for campaigns that use no delivery strategies — such deliveries carry no `deliveryMethod`, so the strategy filter dropped them all and the card fell back to placeholders |
| — | Emoji stripping no longer removes the zero-width joiner, which is an ordinary letter in Malayalam, Sinhala and Bengali — so labels typed in those scripts survive save |
| — | Option delete icon made keyboard operable, with a screen-reader label naming the option it removes |
| — | Upload validation no longer crashes when the backend reports the failure on `additionalDetails` alone — the handler referenced a variable scoped to the other error branch, so the validation state was never set and the screen was left mid-check |
| — | Delivery strategies are cleared when the campaign type is changed after a draft is saved — they were being restored on every later save, so the campaign went on being treated as a strategy campaign under its new type |
| — | A saved strategy the campaign type no longer offers is dropped when the delivery step loads, instead of reaching the payload and giving Delivery Rules a tab for a strategy that no longer exists |
| — | POLIO download template (#4685) |

> Payments, HRMS, PGR and DSS fixes in this release are documented in their own modules' v2.2 release notes.

---

## How Access and Permissions Work

Unchanged from HCM v2.1.

| Role | What they can do |
|---|---|
| All authenticated employees | View campaign list and campaign details |
| System administrator | Retry a failed campaign creation |
| Campaign-scoped users | Create or update campaigns within their assigned boundary scope |

Role-based access for campaign actions is configured via MDMS — not hardcoded.

---

## Localisation

All translation keys are centralised in `src/utils/i18nKeyConstants.js` under the `I18N_KEYS` constant.

| Category | Key namespace |
|---|---|
| Common | `I18N_KEYS.COMMON` |
| Campaign creation | `I18N_KEYS.CAMPAIGN_CREATE` |
| App Configuration | `I18N_KEYS.APP_CONFIGURATION` |
| Commodity Management | `I18N_KEYS.COMMODITY_MANAGEMENT` |

New keys in HCM v2.2 cover Group Vaccination (`GV_*`), POLIO cloning (`HCM_CLONE_*`), and App Configuration accessibility labels.

---

## API Integrations

**No new endpoints in this release.** Group Vaccination is carried entirely on the existing campaign payload — strategies live in `additionalDetails.cycleData.deliveryMethods` and as `deliveryMethod` on each delivery.

| Endpoint | Method | Hook / Service | Purpose |
|---|---|---|---|
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Search campaigns; read saved delivery strategies |
| `/project-factory/v1/project-type/create` | POST | `createCampaignService` | Create campaign |
| `/project-factory/v1/project-type/update` | POST | `updateCampaignService` | Update campaign; write delivery strategies |
| `/boundary-service/boundary-relationships/_search` | GET | `useBoundaryRelationshipSearch` | Fetch boundary relationships |

---

## Versions

| Package | Previous | This release |
|---|---|---|
| `digit-ui-components` | dev-66 | **dev-78** |
| `digit-ui-react-components` | — | dev-21 |
| `digit-ui-svg-components` | — | dev-11 |
| `digit-ui-libraries` | — | dev-16 |
| `digit-ui-health-css` | 1.0.55 | **1.0.65** |
| `digit-ui-components-css` | dev-13 | dev-15 |

The module's own package version is unchanged at `1.0.0`.
