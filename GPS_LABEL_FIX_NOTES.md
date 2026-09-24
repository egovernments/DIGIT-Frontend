# GPS Coordinates label missing in App Configuration preview

**Date:** 2026-08-26
**Branch:** `FEATURE/form-config-corrector`
**Status:** Change applied locally. **Not committed, not pushed.**

---

## 1. What was reported

On the App Configuration (redesign) screen, the **Page properties** panel on the right lists a
field named **GPS coordinates** with its toggle ON, but the mobile preview in the centre renders
that field as a **bare input box with no label above it**.

Reproduced on:

```
https://hcm-demo.digit.org/workbench-ui/employee/campaign/new-app-configuration-redesign
  ?campaignNumber=CMP-2026-08-26-004332&flow=REGISTRATION&version=1
```

Flow: **Delivery → Vaccinated Elsewhere**

Other fields on the same page (e.g. `Resource`) render their label correctly, so the problem is
specific to the GPS field.

---

## 2. Investigation

### 2.1 The label markup is never generated

Inspected the two rendered field wrappers inside the phone preview:

| | Resource field | GPS coordinates field |
|---|---|---|
| Wrapper class | `digit-label-field-pair ... removeMargin` | *identical* |
| Child elements | 2 — `<header>` + `.digit-field` | **1 — only `.digit-field`** |
| `<label>` elements | 1 (`"Resource"`) | **0** |
| `<header>` elements | 1 | **0** |

The input itself renders as
`id="campaign-new-app-configuration-redesign-standalone-field-304"` with `aria-label=""`.

This rules out CSS/visibility as the cause, and rules out a missing translation — an empty
translation string would still emit a `<header>` with blank text. The `<header>` block is
**conditionally rendered** and the condition evaluated false.

### 2.2 The props reaching the renderer

Read live off the React tree:

| prop | Resource | GPS coordinates |
|---|---|---|
| `label` | `"Resource"` | `""` |
| `type` | `component` | `text` |

So the label is already empty by the time it reaches the field component.

### 2.3 The field config

The GPS field's actual config object:

```json
{
  "fieldName": "latLng",
  "label": "VACCINATED_ELSEWHERE_LATLNG_LABEL",
  "type": "string",
  "format": "latLng",
  "showLabel": false,
  "innerLabel": "",
  "hidden": false,
  "includeInForm": true,
  "mandatory": false,
  "order": 1
}
```

`showLabel: false` is the trigger.

### 2.4 Where the suppression happens

`health/micro-ui-react19/web/packages/modules/campaign-manager/src/components/ComponentToRender.js:116-122`

```js
label={
  field?.showLabel === false || fieldType === "checkbox" || field.format === "scanner"
    ? ""
    : shouldCustomTranslate
    ? field?.label
    : customT(field?.label) || ""
}
```

When `showLabel === false`, an empty string is passed as the label, which is why no `<header>`
is emitted downstream.

### 2.5 Why the right panel still says "GPS coordinates"

This is what made the behaviour look self-contradictory. The two sides read from **different
sources**:

- **Panel title** ("GPS coordinates") and chip ("GPS coordinate accuracy") come from the
  **field-type catalogue** (`HCM-ADMIN-CONSOLE.NewFieldType.json`) — the same source that shows
  "Text" for Site name and Region. It is the element's *type name*, not its label.
- **Preview label** comes from `config.label`, gated by `showLabel`.

So the panel was never displaying a label that failed to render. Also note the orange toggle in
the panel is the include/enable toggle (correctly ON, which is why the input renders at all) —
it does **not** control `showLabel`.

### 2.6 Evidence that latLng is meant to be a labelled field

`HCM-ADMIN-CONSOLE.FieldPropertiesPanelConfig.json` — the `label` property entry
(`bindTo: "label"`, `fieldType: "text"`) lists `latLng` in its `visibilityEnabledFor` array:

```json
{ "id": "label", "label": "label", "order": 2, "bindTo": "label",
  "fieldType": "text", "defaultValue": "", "showFieldOnToggle": false,
  "visibilityEnabledFor": ["text","date","numeric","dropdown","number",
                           "mobileNumber","Image","latLng","locality"] }
```

The panel is explicitly configured to let users **edit the label of a latLng field**. Therefore a
latLng field carrying `showLabel: false` is inconsistent with the panel's own configuration.

Additionally, `showLabel` appears **nowhere** in `FieldPropertiesPanelConfig.json` — it is not
user-configurable anywhere in the UI. It is an internal flag intended for formats that render
their own label-less capture control.

### 2.7 Where `showLabel: false` did *not* come from

Checked and cleared:

- **`ComponentToRender.js`** — only reads the flag, never sets it.
- **`remoteConfigSlice.js:778-781`** (`addField`) — sets `showLabel = false` only for
  `format === "scanner"` and `format === "qrScanner"`. latLng is not covered.
- **`HCM-ADMIN-CONSOLE.NewFieldType.json`** — the latLng catalogue entry has no `showLabel`
  (and `fieldType: "text"`, which explains the `type: "text"` prop seen in 2.2).
- **`FormConfigTemplate.json` / `FormConfig.json` / `NewApkConfig.json`** — before this change,
  **none** of the 8 latLng field definitions across these files carried `showLabel` at all.
- **`tools/form-config-corrector/corrector-engine.js`** — despite the branch name, its only
  latLng reference is a display-name map (`latLng: 'GPS Coordinates'`). Unrelated.

Conclusion: the `showLabel: false` observed on the demo environment originates from the
**campaign's saved configuration on the server** (campaign `CMP-2026-08-26-004332`), not from any
repo default.

---

## 3. Change made

**Scope, as requested: MDMS `FormConfigTemplate` only. No code changes.**

File: `health/configs/Data/HCM-ADMIN-CONSOLE.FormConfigTemplate.json`

Added `"showLabel": true` to all **6** latLng field definitions, placed immediately after
`"mandatory"` to match the key ordering already used by the scanner/checkbox blocks in the same
file.

```diff
                                         "readOnly": false,
                                         "fieldName": "latLng",
                                         "mandatory": true,
+                                        "showLabel": true,
                                         "deleteFlag": false,
```

Diff: **6 insertions, 0 deletions, 1 file.** JSON re-validated after the edit; no reformatting of
the surrounding file.

Labels affected (3 distinct codes across 6 occurrences):
- `CLOSEHOUSEHOLD_CLOSEHOUSEHOLDDETAILS_latLng_LABEL`
- `APPONE_REGISTRATION_BENEFICIARYLOCATION_label_latlong`

For reference, `showLabel: false` in this template remains used only where intended — the 15
pre-existing occurrences are all `scanner`, `qrScanner`, or `checkbox` formats. Those are
untouched.

---

## 4. Important caveats

1. **This does not fix the campaign that was reported.** Campaign `CMP-2026-08-26-004332` already
   has its configuration saved server-side with `showLabel: false`. The template governs newly
   generated configs, not ones already persisted. To fix the existing campaign, its stored config
   must be corrected on the server.

2. **The template change is a no-op for the strict code condition, by design.** The check is
   `showLabel === false`. An absent `showLabel` already renders the label. So the value of this
   change is to make the intent **explicit** and to prevent a `false` value being inherited or
   propagated — it is a hardening/assertion change, not a behavioural fix on its own.

3. **The underlying code-level gap is still open.** `ComponentToRender.js:117` will blank the
   label of *any* latLng field whose saved config says `showLabel: false`, even though the
   properties panel offers no way to set or unset that flag. If GPS fields should never be
   label-less, the durable fix is to exclude `format === "latLng"` from the suppression condition
   in `ComponentToRender.js`. **This was deliberately not done, per instruction to change MDMS
   only.**

4. **Localization not verified.** `VACCINATED_ELSEWHERE_LATLNG_LABEL` was not present in the
   browser's local cache and is fetched from the localization service. If the label eventually
   renders as the raw code rather than readable text, that is a separate missing-localization
   issue.

---

## 5. Verification done

- [x] Root cause traced from DOM → React props → field config → source condition
- [x] Confirmed panel title comes from field-type catalogue, not from `config.label`
- [x] Confirmed `latLng` is label-enabled in `FieldPropertiesPanelConfig.json`
- [x] Ruled out code paths and repo templates as the source of `showLabel: false`
- [x] JSON validity re-checked after edit
- [x] Diff reviewed — 6 insertions only, correct key position, scanner blocks untouched

Not done:
- [ ] Runtime re-test in the browser (template change cannot affect the already-saved campaign)
- [ ] Committed / pushed — **intentionally left in the working tree**
