# Group vaccination (CLF and Transit post ) LLD (admin console)

**Feature** :  Delivery strategy selection for polio campaigns   
**Module**:  campaign-manager  
**Issue** : [https://github.com/egovernments/DIGIT-Frontend/issues/4412](https://github.com/egovernments/DIGIT-Frontend/issues/4412)  
**Figma**: [https://www.figma.com/make/aRNpJFeKsdHbTDUB5mhiFP/Delivery-Strategy?p=f](https://www.figma.com/make/aRNpJFeKsdHbTDUB5mhiFP/Delivery-Strategy?p=f)  
**Author**:  Swathi   
**Version** 0.2 · corrected against the implementation   
**Date**: 11 September 2026 (updated 5 October 2026)

## 1. Scope
Two screens change and two read a new value.

| Screen | Route | Change |
| ----- | ----- | ----- |
| Delivery Setup | setup-campaign?key=7 | New component, replaces CycleConfiguration |
| Delivery Rules | setup-campaign?key=8 | Same screen, tabs become strategies |
| Campaign Details | view-details | One more condition on two cards |
| Mobile App Setup | new-app-modules | One more condition on card enablement |

No new routes, no new API, no change to how the wizard navigates. The microplan sheet upload flow is untouched, and no other campaign type is affected.

A note on names: 

The user sees on the screen a delivery strategy. In code it is deliveryMethod. They differ on purpose. deliveryStrategy is an existing field on every delivery that holds DIRECT or INDIRECT whether a dose was observed being taken. Reusing that name for the new concept would collide with it and corrupt the delivery-rule transforms. So the screens say "delivery strategy" and the code says deliveryMethod.

## 2. Component Structure
```
DeliverySetup                         (new -- pages/employee/deliverySetup)
├── TagComponent                      (existing -- campaign date chip)
├── DeliveryDatesCard                 (new)
│   └── DateRange                     (shared component library)
└── DeliveryMethodSelection           (new)
    ├── CheckboxGroup                 (shared)
    └── ValidationMessage             (shared)

DeliveryRule                          (existing -- pages/employee/deliveryRule)
└── MultiTab
    ├── Tabs                          (cycles -- hidden when there is one cycle)
    ├── SubTabs                       (Toggle → Tab, labelled by strategy)   ← changed
    └── AddDeliveryRuleWrapper        (unchanged)
        ├── attribute / operator / value row
        └── AddProducts
```

Only SubTabs changes inside Delivery Rules.

**DeliverySetup**

Owns the step. Reads the campaign type record, decides whether the feature applies, renders the two cards, validates, and writes to session on continue. If the campaign type lists no strategies it renders CycleConfiguration instead the fallback lives here, in one place.

**DeliveryMethodSelection**

Renders one checkbox per strategy with its label and description. Holds nothing itself; the selection is lifted to DeliverySetup.

```
Props
  methods    : { code, order, i18nKey, descriptionI18nKey }[]
  selected   : string[]
  onChange   : (codes: string[]) => void
  error      : string | null
  disabled   : boolean          // campaign locked or view mode
```

**Edit strategy warning popup** (inline in CampaignDetails.js, not a separate component)

Shown when the user navigates back to Delivery Setup, Delivery Rules or Boundary on a campaign whose Mobile App Setup is already complete. Proceed or cancel. Uses the existing PopUp pattern from CampaignHome.

## 3. Delivery Setup Screen
Card 1 — delivery dates

One date range. End on or after start, both inside the campaign's own date range. The existing date validators apply unchanged.

These dates are not a new field. They are cycle 1's dates. The screen writes cycleConfigure.cycleData = [{ key: 1, fromDate, toDate }] , the same shape CycleConfiguration writes today and the save transform picks them up from there without modification.

Card 2 — delivery strategies

Multi-select checkbox group, at least one required. The list comes off the campaign type record, sorted by its order field:

```
const methods = [...(projectConfig?.deliveryMethods ?? [])]
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
```

Label is t(m.i18nKey), description is t(m.descriptionI18nKey). No strategy code, label or description is written into the module.

On continue

```
cycleConfigure = {
  cycleData:         [{ key: 1, fromDate, toDate }],
  cycleConfgureDate: { cycle: 1, deliveries: <number of strategies>, IsDisable: true },
  deliveryMethods:   ["HOUSEHOLDSTRATEGY", "TRANSITPOST", "CLF"],
}
```

Written under the existing HCM_CAMPAIGN_CYCLE_CONFIGURE key. Keeping that contract means the save transform, draft resume and the summary screens keep working with no changes.

Unticking a strategy that has rules

Ask for confirmation first. Rules are discarded only on confirm the user may just be looking.

## 4. Delivery Rules Screen
### 

**What changes**

|  | Now | After |
| ----- | ----- | ----- |
| Cycle tab strip | Tab, one per cycle | Hidden. The existing campaignData.length <= 1 guard already does this |
| Delivery selector | Toggle labelled Delivery 1, Delivery 2 | Tab labelled with the strategy name |
| Everything below | attribute / operator / value, resources, footer | Unchanged |

The label change itself is trivial — labels today are pure index arithmetic (`${t(CAMPAIGN_DELIVERY)} ${index + 1}`) and the delivery object passed into that map is never read. Which is exactly why the risk sits elsewhere: nothing in the UI will complain when the *content* attached to a tab is wrong.

Tab defaults

Every tab opens with the campaign type's existing dose criteria. So the campaign type needs no per-strategy delivery definitions. Resolution takes a strategy-specific delivery if one exists and otherwise falls back to the shared one:

```
const template =
  deliveries.find(d => d.deliveryMethod === code)   // strategy-specific, if defined
  ?? deliveries[0];                                 // otherwise the shared template
```

Today every tab resolves to the same template. If a country later wants a wider age band at transit posts, they add a delivery carrying that strategy code and it takes precedence, with no code change.

## 5. State
Shape  
One cycle, one delivery per chosen strategy:

```
campaignData: [
  {
    cycleIndex: 0,
    deliveries: [
      { deliveryIndex: 0, deliveryMethod: "HOUSEHOLDSTRATEGY", deliveryType: "DIRECT",
        deliveryRules: [ { ruleKey: 1, attributes: [...], products: [...] } ] },
      { deliveryIndex: 1, deliveryMethod: "TRANSITPOST",       ... },
      { deliveryIndex: 2, deliveryMethod: "CLF",               ... },
    ]
  }
]
```

Nesting depth, reducer signatures and selectors are unchanged. cycleIndex and deliveryIndex keep their names — renaming them would touch every reducer and call site for nothing.

Initialisation

```
initializeData(1, methods.length, effectiveDeliveryConfig, savedDeliveryRules, ...)
```

then stamp each delivery with its strategy code, in the order the campaign type lists them.

Suppress the observation-strategy sync

Under DOT1 that logic forces DIRECT on the first delivery and INDIRECT on the rest:

```
const expectedDeliveryType = observationStrategy === "DOT1"
  ? (deliveryIndex === 0 ? "DIRECT" : "INDIRECT") : "DIRECT";
```

That describes a dose sequence. It means nothing when the index is a strategy — being reached at a transit post says nothing about whether the dose was observed.This isn't hypothetical. The strategy defaults to DOT1 when a campaign type doesn't set one, and polio doesn't. Left in, Transit Post would save DIRECT and CLF and Household INDIRECT purely by tab position, and because the sync runs on load it would also overwrite any correction the user made. All strategy deliveries are DIRECT.

Reconciling when the selection changes

Match on deliveryMethod, not on count. Strategies still selected keep their rules, deselected ones are dropped, newly selected ones are appended with the default.The stock syncDeliveryCount truncates and appends by count alone. Remove the first of three strategies with that and every remaining strategy's rules shift onto its neighbour — the user's CLF configuration silently becomes Transit Post's.

## 6. The identity rule
Existing code finds a delivery by its position in the array. Correct while position means "second dose", wrong once it means "which strategy", because the user can tick any subset.

| Where | Now | Needs to be |
| ----- | ----- | ----- |
| Tab defaults | deliveries[deliveryIndex] | shared template, or strategy-specific if defined |
| After a selection change | truncate / append by count | match on deliveryMethod |
| Reopening a saved campaign | tab by index | tab by deliveryMethod |

The last two matter most — they act on rules the user has already edited, so getting them wrong destroys real work. The first is milder now that every strategy shares one template.

## 7. What gets saved
```
{
  "additionalDetails": {
    "cycleData": { "deliveryMethods": ["HOUSEHOLDSTRATEGY", "TRANSITPOST", "CLF"] }
  },
  "deliveryRules": [{
    "cycles": [{
      "id": 1,
      "startDate": 1760054400000,          // the delivery dates
      "endDate": 1760832000000,
      "deliveries": [
        { "id": 1, "deliveryMethod": "HOUSEHOLDSTRATEGY", "deliveryStrategy": "DIRECT", "doseCriteria": [...] },
        { "id": 2, "deliveryMethod": "TRANSITPOST",       "deliveryStrategy": "DIRECT", "doseCriteria": [...] },
        { "id": 3, "deliveryMethod": "CLF",               "deliveryStrategy": "DIRECT", "doseCriteria": [...] }
      ]
    }],
    "resources": [...]
  }]
}
```

deliveryMethod is the new field. deliveryStrategy next to it is the existing DIRECT / INDIRECT value and is unrelated.

If project-factory drops additionalDetails.deliveryMethods, work the list out from the deliveries instead and leave that field out. Nothing else changes.

**Figure 1 - User flow**

[**https://drive.google.com/file/d/1DQ3hmJnJRBwfyuNXgtwK8JIUtNLNqyk2/view?usp=sharing**](https://drive.google.com/file/d/1DQ3hmJnJRBwfyuNXgtwK8JIUtNLNqyk2/view?usp=sharing)

**Figure 2 — Configure and save**

[**https://drive.google.com/file/d/1kDELa4ZHtmCVwVMyMkJ4aieGKslvXlj9/view?usp=sharing**](https://drive.google.com/file/d/1kDELa4ZHtmCVwVMyMkJ4aieGKslvXlj9/view?usp=sharing)

## 8. Configuration needed
All of it goes on the campaign type's own HCM-PROJECT-TYPES.projectTypes record. No new MDMS master.

```
"deliveryMethods": [
  { "code": "HOUSEHOLDSTRATEGY", "order": 1,
    "i18nKey": "CAMPAIGN_DELIVERY_METHOD_HOUSEHOLD",
    "descriptionI18nKey": "CAMPAIGN_DELIVERY_METHOD_HOUSEHOLD_DESC" },
  { "code": "TRANSITPOST",       "order": 2,
    "i18nKey": "CAMPAIGN_DELIVERY_METHOD_TRANSIT_POST",
    "descriptionI18nKey": "CAMPAIGN_DELIVERY_METHOD_TRANSIT_POST_DESC" },
  { "code": "CLF",               "order": 3,
    "i18nKey": "CAMPAIGN_DELIVERY_METHOD_CLF",
    "descriptionI18nKey": "CAMPAIGN_DELIVERY_METHOD_CLF_DESC" }
]
```

The POLIO record already exists on demo with one cycle, one delivery, 0<=age<59, nOPV2, attrAddDisable: false and deliveryAddDisable: false. It needs this one field added; its cycles block stays exactly as it is.

Module cards

Two schemas, and the difference matters for where to add things:

* FormConfigTemplate keyed by campaign type (POLIO). The source.  
* FormConfig — keyed by campaign number. What NewAppModule actually renders.

New module entries go into FormConfigTemplate; changing FormConfig would only fix one campaign. TRANSITPOST.POLIO and CLF.POLIO now exist in FormConfigTemplate. 

Card enablement then becomes:

enabled = formConfigEntry.active === true && campaignMethods.includes(code)

Cards stay visible when disabled. Hiding them would leave no clue that the module exists or how to turn it on.

## 9. UI states
Delivery Setup:

```
Loading campaign type record
   ├── loaded, strategies present  → render the two cards
   ├── loaded, no strategies       → render CycleConfiguration instead
   └── fetch failed                → error with retry; do not render an empty selection
```

```
Editing
   ├── nothing ticked              → Continue blocked, message shown
   ├── dates invalid               → field-level error
   └── valid                       → Continue enabled
```

```
Continuing                         → button busy, inputs disabled
Locked campaign / view mode        → everything read-only
```

Delivery Rules keeps its existing loading and error states. The one addition is that a validation failure on a tab that isn't open must name the strategy "complete the delivery condition" tells the user nothing when three tabs exist and one is wrong.

## 10. Validation
| Where | Rule | Message |
| ----- | ----- | ----- |
| Delivery Setup | at least one strategy | ES__REQUIRED_DELIVERY_METHOD |
| Delivery Setup | dates present | ES__REQUIRED_DELIVERY_DATE |
| Delivery Setup | end ≥ start, inside campaign range | existing date validators |
| Delivery Rules | every tab has a complete rule with a resource | existing, extended to name the strategy |

New static keys: the two above, plus HCM_DELIVERY_SETUP_HEADING, HCM_DELIVERY_SETUP_DESC, HCM_DELIVERY_DATES_HEADING, HCM_DELIVERY_DATES_DESC, HCM_DELIVERY_DATES_LABEL, CAMPAIGN_CHOSEN_DELIVERY_STRATEGIES, HCM_EDIT_DELIVERY_STRATEGY_WARNING_HEADING, HCM_EDIT_DELIVERY_STRATEGY_WARNING_TEXT, STRATEGY_NOT_SELECTED_MODULE, CAMPAIGN_SUMMARY_ATTRIBUTES_MISSING_STRATEGY_ERROR, CAMPAIGN_SUMMARY_PRODUCT_MISSING_STRATEGY_ERROR.

## 11. Navigation
No new routes; both screens are existing wizard steps.

Back from Delivery Rules to Delivery Setup — selection and dates restore from session. If the user changes the selection, rules are reconciled by strategy code.Refresh mid-configuration — restores from HCM_CAMPAIGN_MANAGER_FORM_DATA, same as today.Deep link straight to key=8 with nothing selected — the step has nothing to build tabs from, so it must send the user back to key=7 rather than show an empty screen.Editing after Mobile App Setup is done — warning popup, proceed or cancel.

## 12. Permissions
No new permission. Access to the wizard is already controlled by the campaign-manager role, and Delivery Setup adds nothing on top. Card enablement in Mobile App Setup follows from configuration, not from authorisation — a user who can reach the screen can reach every card they've enabled.

## 13. Files
New:

```
pages/employee/deliverySetup/index.js
components/CreateCampaignComponents/DeliveryMethodSelection.js
utils/deliveryMethods.js                  applies-or-not check + strategy list helpers
```

Changed:

```
configs/CampaignConfig.js                          route key=7 to DeliverySetup when it applies
pages/employee/deliveryRule/MultiTabcontext.js     SubTabs: Toggle → Tab, label from deliveryMethod
pages/employee/deliveryRule/index.js               initialise 1 × N; skip observation-strategy sync
pages/employee/deliveryRule/deliveryRulesSlice.js  carry deliveryMethod; reconcile by code
pages/employee/deliveryRule/useDeliveryRules.js    strategy-aware selectors
utils/setupCampaignHelpers.js                      write and read deliveryMethod
pages/employee/NewCampaignCreate/CampaignDetails.js  step gating
pages/employee/NewCampaignCreate/NewAppModule.js     card enablement
utils/i18nKeyConstants.js                          new static keys
Module.js                                          register new components
```

## 14. Edge cases
* Only one strategy selected, does the tab strip still show? Design decision  
* All three selected, then two removed , the remaining tabs keep their own rules.  
* Strategy removed after its module was configured in Mobile App Setup, the card goes back to disabled, and the console does not delete the saved app configuration. That leaves a campaign carrying configuration for a strategy it no longer uses, but it should be made inactive.   
* Campaign type lists strategies but the campaign was created multi-round — cycle flow.  
* Check the flow for existing campaigns

## 15. Tests
Delivery Setup

* Continue blocked with nothing selected.  
* Each strategy selectable alone, all three selectable together.  
* End date before start date rejected,dates outside the campaign range rejected.  
* Unselect a configured strategy then cancel, configuration survives.  
* Campaign type with no strategies renders the old cycle screen.

Delivery Rules

* Tab count, labels and order match the selection.  
* Cycle tab strip absent.  
* Ticking only CLF gives CLF that template, not "the first strategy's".  
* Editing one tab leaves the others alone.  
* An incomplete tab blocks submit and the message names the strategy.  
* Refresh restores all tabs.  
* Remove the first of three strategies, remaining tabs keep their own rules.

Payload

* Exactly one cycle regardless of how many strategies were selected.  
* Cycle dates carry the delivery dates as epochs.  
* One delivery per strategy, each with its code and dose criteria, all DIRECT.  
* Resources aggregate across strategies without double counting.  
* Save, reopen, and every strategy's rules land on its own tab.

Downstream

* Boundaries set but no strategy, Microplan Upload and Mobile App Setup disabled.  
* Transit Post only, its card enabled, CLF card disabled and still visible.  
* Edit after Mobile App Setup, warning shown, cancel aborts.

Regression

* Multi-round SMC campaign: cycle tabs and delivery toggle exactly as before.  
* Bednet: one cycle, one delivery, counts disabled, dates saved as today.  
* Existing campaign without strategy codes opens and saves cleanly.  
* deliveryStrategy values on existing campaigns unchanged after saving through the new screens.

## 16. Open questions
The three in the HLD (two now resolved), plus one for design:

* With a single strategy ticked, does the tab row render or disappear? The existing guard hides a single tab.