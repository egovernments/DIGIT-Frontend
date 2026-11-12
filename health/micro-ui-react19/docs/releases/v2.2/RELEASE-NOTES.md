# HCM Frontend — Complete Release Notes
**New features, enhancements, bug fixes, and migration instructions across all modules**

---

**Release:** HCM-v2.2
**Previous Release:** [HCM-v2.1](https://github.com/egovernments/DIGIT-Frontend/releases/tag/HCM-v2.1)
**Repository:** [egovernments/DIGIT-Frontend](https://github.com/egovernments/DIGIT-Frontend)

---

## Release Summary

HCM-v2.2 is a Campaign Manager feature release. Its centrepiece is **Group Vaccination** — the ability to run a single campaign round through more than one delivery strategy — House To House alongside Outside Household, which covers Transit Post and Communal Living Facility sessions — rather than one house-to-house round. Alongside it, App Configuration gains a substantial set of field-type, panel and preview capabilities, POLIO campaign cloning carries delivery rules forward, and an accessibility pass covers the campaign and App Configuration screens.

Unlike v2.1, this release involves **no platform migration and no new deployable variant**. Other modules receive only small fixes.

| Module | Nature of change |
|---|---|
| Campaign Manager | New feature: Group Vaccination delivery strategies; major App Configuration enhancements; POLIO cloning; accessibility pass |
| Health Payments | One bug fix (boundary session storage) |
| Health HRMS | One bug fix (deactivate popup field alignment); searchable dropdowns |
| Complaints Management (PGR) | Searchable dropdowns |
| Health DSS | Two bug fixes (percentage bar chart corner; localisation module list) |

---

## What's in This Release — At a Glance

**New features:**
- Group Vaccination — one campaign round delivered through multiple delivery strategies
- Delivery Setup step, with per-strategy tabs in Delivery Rules
- Multi-select dropdown field type in App Configuration
- Date-of-birth composite field (date *or* age) in the App Configuration preview
- Popup configuration separated from button configuration
- Group fields with an enable/disable toggle
- POLIO campaign cloning that carries delivery rules forward

**Changed behaviour:**
- Delivery strategies are written on **every** campaign save, not only the delivery step
- `groupAsSingleElement` treats a container as one element in App Configuration page properties
- Number inputs no longer silently clamp a typed value — they show an error and block save
- Create Campaign is disabled (not merely toast-blocked) while copied cycle dates fall outside the new campaign's dates

**No changes to:**
- Deployment topology — no new Docker variant, no new nginx routes
- API surface — no new endpoints in this release

---

## ⚠️ Action Required Before Upgrading

Complete the following before deploying HCM-v2.2. All of it is data configuration; there are no infrastructure changes.

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

## Campaign Manager

### Overview

Campaign Manager provides the full campaign lifecycle — creating a campaign, configuring the mobile app, uploading boundary data, managing cycles and delivery rules, and setting up attendance registers.

In HCM v2.2 it gains **Group Vaccination**: the ability to deliver one campaign round through several delivery strategies, each with its own app configuration, delivery rules and resources.

---

### What's New

#### Group Vaccination — Transit Post and CLF `HCMPRE-4413` (#4524)

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

---

#### App Configuration — field types

| Change | Ticket |
|---|---|
| Multi-select dropdown field type | `HCMPRE-4587` |
| Dedicated icon for the multi-select type | `HCMPRE-4598` |
| Reworked options handling for dropdown / radio / multi-select | `HCMPRE-4599` |
| Date-of-birth composite — date *or* age — in the preview (`DobTemplate.js`) | — |

---

#### App Configuration — panel and drawer

- **Popup configuration separated from button configuration** `HCMPRE-4613` — the two are now configured independently.
- **Button labels configurable independently of the action** `HCMPRE-4593`.
- **Panel properties hideable per field name**, not only per field type.
- **Group fields get an enable/disable toggle.** A switched-off group's validation no longer blocks save.
- **GPS popup timer** (minutes/seconds, with a configurable minimum). Limits and messages come entirely from `FieldPropertiesPanelConfig` — none are hardcoded.
- **Number inputs no longer silently clamp a typed value.** They show the configured error and help text and block save, so the user sees why the value was rejected.
- **Info card for age conditions** `HCMPRE-4553`.

---

#### App Configuration — preview

- **Opt-in value preview for `textTemplate`** (#4631). Setting `isFieldValue: false` previews the label that a value will replace, underlined to mark it as dynamic.
- **`groupAsSingleElement`** treats a container as one element, so a count and the label explaining it can no longer be hidden separately. Transit Post Overview went from 13 rows to 3.
- **Resource card built from the resources actually configured** on the campaign, rather than placeholder options.
- **Menu card alignment and icon position** read from the config's `styling` block.

New helpers: `numberLimits.js`, `groupValidation.js`, `panelItemVisibility.js`, `labelText.js`, `footerButtonType.js`.

---

#### Campaign cloning — POLIO

- A copy of a campaign that uses delivery strategies now carries its **delivery rules** forward. Campaigns without strategies are unchanged and re-enter them in the wizard. In practice this means POLIO, which is the only campaign type declaring `deliveryMethods` today — but the behaviour follows the strategies the campaign carries, not its type.
- The copy is confirmed by a **popup on the campaign it created**, not a toast on the listing the user leaves a second later. The 1-second redirect delay is gone, so the copy opens straight away.
- An **info card above the summary** lists the two steps left — edit the delivery strategy, then update the microplan. It is keyed on `additionalDetails.cloneFrom`, on the strategies the campaign carries and on it still being a draft, so it appears only for a copy that was actually given delivery rules, and disappears once the campaign is created.
- **Create Campaign is held disabled** while copied cycle dates fall outside the new campaign's dates. Previously it submitted and only raised a toast, creating nothing.

---

### What Changed in Existing Features

#### Delivery strategies written on every save

project-factory stores whatever `additionalDetails` it receives. A save from a step that knew nothing about strategies previously erased them. Every save path now resolves the strategies through `carryDeliveryMethods` before writing, so a step that does not know about them cannot drop them.

---

#### Round type now governs which delivery screens appear

Delivery strategies apply to a single round only. The Delivery Setup step, the campaign details gating, and the draft save path all now agree on this, so a multi-round campaign keeps the cycle screens, is never gated on a step it cannot reach, and never has strategies written to its `cycleData`.

---

#### Accessibility pass

WCAG fixes across the console (#4514, #4530 and follow-ups):

- `main` landmark and page heading on six campaign pages
- App Configuration labels, roles and keyboard reachability — clickable controls that were mouse-only now carry `role="button"`, `tabIndex` and Enter/Space handling
- Loader screen and heading hierarchy corrections

`ACCESSIBILITY-REPORT.md` records the audit.

---

### Bug Fixes

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
| — | Payments headers / toast / CSS; dashboard CSS |
| — | `rainmaker-hcm-dss` removed from the localisation call |

---

### How Access and Permissions Work

Unchanged from HCM v2.1.

| Role | What they can do |
|---|---|
| All authenticated employees | View campaign list and campaign details |
| System administrator | Retry a failed campaign creation |
| Campaign-scoped users | Create or update campaigns within their assigned boundary scope |

Role-based access for campaign actions is configured via MDMS — not hardcoded.

---

### Localisation

All translation keys are centralised in `src/utils/i18nKeyConstants.js` under the `I18N_KEYS` constant.

| Category | Key namespace |
|---|---|
| Common | `I18N_KEYS.COMMON` |
| Campaign creation | `I18N_KEYS.CAMPAIGN_CREATE` |
| App Configuration | `I18N_KEYS.APP_CONFIGURATION` |
| Commodity Management | `I18N_KEYS.COMMODITY_MANAGEMENT` |

New keys in HCM v2.2 cover Group Vaccination (`GV_*`), POLIO cloning (`HCM_CLONE_*`), and App Configuration accessibility labels.

---

### API Integrations

**No new endpoints in this release.** Group Vaccination is carried entirely on the existing campaign payload — strategies live in `additionalDetails.cycleData.deliveryMethods` and as `deliveryMethod` on each delivery.

| Endpoint | Method | Hook / Service | Purpose |
|---|---|---|---|
| `/project-factory/v1/project-type/search` | POST | `useSearchCampaign` | Search campaigns; read saved delivery strategies |
| `/project-factory/v1/project-type/create` | POST | `createCampaignService` | Create campaign |
| `/project-factory/v1/project-type/update` | POST | `updateCampaignService` | Update campaign; write delivery strategies |
| `/boundary-service/boundary-relationships/_search` | GET | `useBoundaryRelationshipSearch` | Fetch boundary relationships |

---

## Health Payments

### Bug Fixes

#### Boundary selection written to session storage during render

**Before:** `BoundaryDropdown` called `Digit.SessionStorage.set("paymentInbox", selected)` directly in the component body, writing on every render. The stored object also included the full `children` array of the selected boundary.

**After:** The write moved into a `useEffect` keyed on the selection, and the `children` array is stripped before storing. This removes a side effect during render and keeps the stored payload small.

Full detail: [Health Payments v2.2 release notes](../../../web/packages/modules/health-payments/docs/releases/v2.2/RELEASE-NOTES.md)

---

## Health HRMS

### Bug Fixes

#### Deactivate employee popup — fields not aligned vertically

**Before:** Four fields in the deactivate popup passed `alignFieldPairVerically` — a misspelling the component never matched — so the vertical alignment silently never applied.

**After:** Corrected to `alignFieldPairVertically`. The comment, effective date, document upload and remarks fields now align as intended.

---

#### Searchable dropdowns

`isSearchable` was added explicitly in module source — it is not inherited automatically from the `digit-ui-components` upgrade. In HRMS it covers the Employee Type, Department and Designation dropdowns on the create employee screen (`src/components/config/createEmployeeConfig.js`) and the boundary dropdown (`src/components/pageComponents/SelectEmployeeBoundary.js`).

Full detail: [Health HRMS v2.2 release notes](../../../web/packages/modules/health-hrms/docs/releases/v2.2/RELEASE-NOTES.md)

---

## Complaints Management (PGR)

### What Changed

#### Searchable complaint type and boundary dropdowns

`isSearchable` was added explicitly in PGR source — in `src/configs/CreateComplaintConfig.js` for the complaint type dropdown, and in `src/components/BoundaryComponentWithCard.js` for the boundary dropdown. Both now accept typed text and filter their options as you type.

No other source changes in this module.

Full detail: [PGR v2.2 release notes](../../../web/packages/modules/pgr/docs/releases/v2.2/RELEASE-NOTES.md)

---

## Health DSS

### Bug Fixes

#### Percentage bar charts — rounded corner drawn on the wrong segment

**Before:** The horizontal bar chart located the last non-zero segment with `Number.isInteger`. In percentage mode the plotted values are one-decimal floats, which that test rejects, so no segment was recorded and the rounded corner was drawn on the **bottom** segment instead of the top.

**After:** The test now accepts any numeric value. The corner is drawn on the correct segment in both count and percentage modes. Count mode was never affected.

---

#### Localisation request included a module that is no longer used

**Before:** The dashboard requested four localisation modules at load, one of which was `rainmaker-hcm-dss`.

**After:** `rainmaker-hcm-dss` has been removed, leaving `hcm-campaignmanager`, `hcm-dss` and `hcm-boundary-{hierarchyType}`.

> **Check before upgrading:** any dashboard label served only from `rainmaker-hcm-dss` will no longer resolve. Confirm dashboard labels exist under `hcm-dss`.

Full detail: [Health DSS v2.2 release notes](../../../web/packages/modules/health-dss/docs/releases/v2.2/RELEASE-NOTES.md)

---

## Versions

| Package | Previous | This release |
|---|---|---|
| `digit-ui-components` | dev-66 | **dev-78** |
| `digit-ui-module-core` | — | dev-44 |
| `digit-ui-module-workbench` | — | dev-29 |
| `digit-ui-react-components` | — | dev-21 |
| `digit-ui-svg-components` | — | dev-11 |
| `digit-ui-libraries` | — | dev-16 |
| `digit-ui-health-css` | 1.0.55 | **1.0.65** |
| `digit-ui-components-css` | dev-13 | dev-15 |

Module package versions are unchanged (`campaign-manager` 1.0.0, `health-payments` 1.0.0, `health-hrms` 1.0.0, `health-dss` 1.0.0, `pgr` 0.0.2).

---

## Testing Checklist

- [ ] POLIO campaign with all strategies: Delivery Setup, per-strategy tabs, summary
- [ ] Campaign type **without** `deliveryMethods` — cycle screens unchanged
- [ ] Campaign type **with** `deliveryMethods` set to multi-round — cycle screens shown, Mobile App card not locked, no strategies written to `cycleData`
- [ ] Save from each wizard step; `deliveryMethods` survives in `cycleData`
- [ ] Delivery end date earlier than the start date is rejected on validate
- [ ] Boundaries: swap one, add one, deselect one of two — at root and child level, and on a campaign with frozen boundaries
- [ ] Clone POLIO: rules copied, popup, info card, Create disabled until dates fixed
- [ ] Clone non-POLIO: rules not copied, no info card
- [ ] Change the campaign type on a saved POLIO draft — the strategies are not carried onto the new type
- [ ] Remove a strategy from MDMS, then open a draft that had saved it — no Delivery Rules tab for it
- [ ] Upload a sheet that fails validation on the backend record — the error is shown and the screen recovers
- [ ] App Config: multi-select, popup config, group toggle, timer limits, number errors, DOB
- [ ] Field label in Malayalam or Bengali survives saving — joiner not stripped
- [ ] Accessibility pass on campaign and App Configuration screens
- [ ] Regression: microplan upload, payments, dashboard

---