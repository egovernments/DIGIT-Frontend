# DIGIT HCM Console — Accessibility Improvement Programme

**Prepared:** 23 October 2026 · **Latest audit:** 23 Oct 2026, 12:21 PM IST

This report covers what we changed to make the HCM Console accessible, what the audit results show, and how
other DIGIT products can reuse the work.

All figures come from the DIGIT Accessibility Scanner reports (Playwright + axe-core) and from direct
inspection of the repositories. Where something is an interpretation rather than a measurement, it says so.

---

## 1. Executive Summary

### The result

| Metric | Baseline (21 Sep) | Latest (23 Oct) | Change |
|---|---:|---:|---|
| Accessibility score | **40** / 100 | **92** / 100 | **+52 points** |
| Distinct issues | **22** | **4** | **−18 (−82%)** |
| Adherence (avg of 4 standards) | **77%** | **95%** | **+18 points** |
| WCAG 2.1 | 79% | 95% | +16 |
| GIGW | 78% | 97% | +19 |
| SesMag (508 / EN 301 549) | 76% | 95% | +19 |
| ADA Title III | 75% | 93% | +18 |

**Severity: Severe 0 · High 3 · Medium 0 · Low 1**

Both Severe and Medium issues are now **completely eliminated**. The score sits firmly in the scanner's
**"Excellent"** band, and the `/employee` landing page scores a **perfect 100**.

### The key insight

**Most problems were in shared components, not screens.** One fix in `@egovernments/digit-ui-components`
removes that violation from every screen in every product using it. That is why 22 issues became 4 without
touching most application code — and it is the reuse argument for other teams.

### The honest caveat

**92 is not a compliance claim.** Automated tools catch roughly 30–40% of real accessibility barriers. We
have not done systematic screen-reader or keyboard-only testing. The accurate statement is: *"We have
substantially improved measured accessibility and removed major structural barriers. Full conformance needs
manual validation we have not yet done."*

### One decision gets us to 99

**Colour contrast is now the single binding constraint.** It is one High on 25 of the 27 pages, which is why
so many rows read exactly 93 (100 − 7). It needs a design decision on two colour tokens, not engineering
work.

> **Fixing contrast alone takes the site score from 92 to ~99.** (§4)

---

## 2. How to Read the Reports

### Score

Each page starts at 100 and loses points per issue. **The site score is the average of all 27 page scores.**

| Severity | Per issue | Max per severity |
|---|---:|---:|
| Severe | −10 | −30 |
| High | −7 | −30 |
| Medium | −4 | −30 |
| Low | −1 | −30 |

Because of the cap and the averaging, **one issue on every page hurts far more than five issues on one
page.** Contrast is the live example: one rule on 25 pages costs ~7 points of site average, while the three
other remaining issues together cost under 1.

### "Total issues" counts rules, not occurrences

This is the most misread number in the report.

In the 23 Oct report the per-page columns sum to **31 instances**, but the headline says **4**. The report
states it directly: *"Every distinct issue across all pages, one entry per rule."*

> **Consequence for planning:** fixing a rule on 24 of the 25 pages where it appears reduces the headline
> count by **zero**. A rule only leaves the list when it is gone from every page.

### Score and issue count move independently

Between 16 and 19 Oct the issue count fell 8 → 6 but the **score stayed at 91** — those were Mediums on one
page (−4 each on 1 of 27 pages ≈ 0.3 points, invisible after rounding).

The reverse is now true: contrast is **one** issue, but removing it is worth **+7 points**.

### Comparing two reports

Compare like with like: same routes, same scanner, same auth state. Read score and severity mix together,
not the total alone. Expect run-to-run variance — results are state-dependent (a page caught mid-load, or
with a dropdown open, yields different findings).

### What automated audits cannot tell you

They cannot judge whether a screen reader announces a flow sensibly, whether focus moves correctly around
dialogs, whether alt text is *meaningful* (only that it exists), or whether a keyboard user can finish a task.

A concrete example from our own data: the scanner reports a scrollable-region issue on `campaign-home`, but
running axe manually in a browser on that page returns clean — because the viewport differs.

---

## 3. Results

### Trend

| Date | Score | Issues | Severe | High | Medium | Low |
|---|---:|---:|---:|---:|---:|---:|
| 21 Sep *(baseline)* | 40 | 22 | — | — | — | — |
| 14 Oct | 79 | 9 | 1 | 4 | 3 | 1 |
| 15 Oct | 90 | 5 | 1 | 2 | 1 | 1 |
| 16 Oct | 91 | 8 | 1 | 3 | 3 | 1 |
| 19 Oct | 91 | 6 | 1 | 3 | 1 | 1 |
| 20 Oct | 91 | 8 | 1 | 3 | 3 | 1 |
| **23 Oct** | **92** | **4** | **0** | **3** | **0** | **1** |

*Severity breakdown was not recorded in the September baseline.*

**Reading this honestly:**

- The large gain came before 14 Oct (40 → 79) and on 14–15 Oct (79 → 90), from the shared-library fixes and
  the loader-state fix.
- From 15 to 20 Oct the score plateaued at 91 while the count oscillated (5, 8, 6, 8) — partly genuine
  scanner state-dependence, partly our own regression on 20 Oct.
- **23 Oct is the payoff scan:** the three pending releases shipped, and Severe and Medium both went to zero.
- The score moved only +1 because contrast now dominates — see §4.

### Projection vs. actual — the method held

On 20 Oct we published a projection of what the pending releases would deliver. The 23 Oct scan measured it:

| Metric | Projected (20 Oct) | **Actual (23 Oct)** | Verdict |
|---|---:|---:|---|
| Issues | 4 (possibly 3) | **4** | ✅ exact |
| Score | ~93 | **92** | ✅ within 1 |
| Severe | 0 | **0** | ✅ |
| High | 3 | **3** | ✅ |
| Medium | 0 | **0** | ✅ |
| Low | 0 or 1 | **1** | ✅ (the one we flagged as uncertain) |

Every fix traced to a root cause behaved as predicted. The only item we could not attribute confidently —
the Low on `unified-upload-screen` — is the one that remains. That is a useful signal for how much weight to
put on the root-cause method going forward.

### What the fixes delivered, page by page

| Page | 20 Oct | **23 Oct** | What changed |
|---|---:|---:|---|
| `/employee` | 92 | **100** | Duplicate/nested `main` regression fixed (core) |
| `setup-campaign?key=5` | 83 | **93** | The Severe — form fields now labelled (MSD fork) |
| `campaign-templates` | 89 | **93** | `region` — dropdown portal landmark |
| `my-campaign-new` | 89 | **93** | same |
| `create-campaign?key=1` | 89 | **93** | same |
| `setup-campaign?key=8` | 89 | **93** | same |
| `search` (×2) | 89 | **93** | same |
| `new-app-config` (PERMISSIONHANDLER) | 86 | **93** | Scrollable preview card now keyboard-reachable |
| `campaign-home` | 86 | **86** | Unchanged — contrast + scrollable |
| `unified-upload-screen` | 85 | **85** | Unchanged — contrast + nested interactive + role |
| `localization-add` | 85 | **85** | Unchanged — same three rules |

### The 4 remaining issues

| # | Issue | Severity | Pages | Status |
|---|---|---|---|---|
| 1 | Text is difficult to read (low contrast) | High | 25 of 27 | **Open — needs design decision** (§4) |
| 2 | Scrollable area not reachable by keyboard | High | `campaign-home` | **Open — element not located** |
| 3 | Interactive elements nested inside each other | High | `unified-upload-screen`, `localization-add` | **Open — not located** |
| 4 | Element has a role not allowed for that tag | Low | `unified-upload-screen`, `localization-add` | **Open** |

Only three pages are not already at 93 or 100: `campaign-home` (86), `unified-upload-screen` (85) and
`localization-add` (85).

---

## 4. Colour Contrast — the decision that gets us to 99

Some grey and orange text is too light to read comfortably. This affects users with low vision or colour
vision deficiency, and anyone on a poor screen or in sunlight — including field staff using the Console
outdoors.

**Rule:** `color-contrast` · **WCAG 1.4.3 (AA)** requires **4.5:1** for normal text.

Traced to exactly **two design tokens**:

| Token | Current | On white | On `#FAFAFA` page bg | Verdict |
|---|---|---:|---:|---|
| `--digitv2-lightTheme-text-secondary` | `#787878` | 4.42:1 | 4.23:1 | **Fails both** |
| `--digitv2-lightTheme-primary-1` | `#C84C0E` | 4.67:1 | 4.47:1 | Passes white, **fails page bg** |

The second is subtle: the brand orange passes on pure white, but the Console background is `#FAFAFA`, which
pushes it under 4.5:1.

**Proposed:**

| Token | Current | Proposed | White | On `#FAFAFA` |
|---|---|---|---:|---:|
| `text-secondary` | `#787878` | **`#737373`** | 4.74:1 | 4.54:1 |
| `primary-1` | `#C84C0E` | **`#B8460C`** | 5.92:1 | 5.67:1 |

`#737373` is the lightest grey passing on **both** backgrounds. An earlier `#767676` proposal was withdrawn —
it passes on white (4.54:1) but fails on `#FAFAFA` (4.35:1).

**Affects:** breadcrumbs, stepper labels, tab labels, view-card values, template text, hierarchy names,
app-config labels, upload hints.

### What it is worth

Contrast is 1 High on 25 of 27 pages. Removing it:

- 23 pages at 93 → **100**
- `campaign-home` 86 → **93**
- `unified-upload-screen` and `localization-add` 85 → **92**

**Site score 92 → 99.** It is by far the highest-value remaining action, and it costs no engineering effort —
only a brand decision.

**Also flagged:** the `.drag-drop` placeholder at `#C5C5C5` is **1.73:1** — far below any threshold.

---

## 5. What We Fixed

| Category | Problem | Fix | Where |
|---|---|---|---|
| **Loading states** | Spinner with no heading or main region — nothing to orient by | `<main display:contents>` + screen-reader-only `<h1>` across 9 screens | campaign-manager `d7c0314f41` |
| **Unnamed controls** | Visible label not connected to the input; screen reader announces "edit text" | `ariaLabel` prop plumbed through dropdowns, menus, multi-selects | Library + campaign-manager |
| **Nested interactives** | Clickable card containing a clickable button — merged, confusing announcement | Card made a plain container; actions became siblings | `SelectHierarchy.js`, `Chip.js`, `Tag.js` |
| **Invalid ARIA roles** | `<label role="button">` — HTML permits no role on `<label>` | Role removed, keyboard stop retained | `CheckBox.js`, `UploadImage.js`, `LinkLabel.js` |
| **Landmarks** | Four components emitted duplicate `banner`; portalled dropdowns sat outside all landmarks | `<header>` → `<div>`; portal wrapped in `role="region"` | `Banner.js`, `SearchComponent.js`, `Dropdown.js` |
| **Scrollable regions** | Panels that scroll with nothing focusable — unreachable without a mouse | `tabIndex={0}` + `role="group"` + label | `NewLayoutRenderer.js`, `AppPreview.js` |

### Three details worth knowing

**1. A forked component silently missed every library fix.** The boundary screen uses a *local fork* of
`MultiSelectDropdown`, not the library one. Every library fix bypassed it for weeks — this was the cause of
the site's only Severe issue. It was identified by a `serachable` typo present in neither the library source
nor the published bundle.
→ **Lesson for every team: audit your imports before assuming a library upgrade landed.**

**2. Removing an attribute nearly caused a product-wide visual change.** Tailwind's preflight has
`[role="button"] { cursor: pointer }`, and `.label` has no cursor rule of its own. Removing `role="button"`
would have silently dropped the pointer cursor from every checkbox label. We added `cursor: "pointer"`
explicitly:

```jsx
// before
style={{ maxWidth: "100%", width: "100%", marginRight: "0rem" }}
tabIndex={0}
role={"button"}          // ← invalid on <label>

// after — role gone, cursor preserved, tab stop kept
style={{ maxWidth: "100%", width: "100%", marginRight: "0rem", cursor: "pointer" }}
tabIndex={0}
```

**3. We added structure without changing layout** using `display: contents`, which generates no box — so the
element cannot become a flex/grid item or a containing block:

```jsx
<main style={{ display: "contents" }}>
  <h1 style={srOnlyStyle}>{t("PAGE_TITLE")}</h1>
  <Loader page={true} />
</main>
```

### The 20 Oct regression — and what it taught us

On 20 Oct the report showed *"Medium issues increased by 2."* The cause was ours: a change in core's
`Home.js` wrapped the landing page in `<main>` to satisfy the "no main landmark" rule — but
`LandingPageWrapper` **already declared `role="main"`**, producing two main landmarks, one nested in the
other.

Reverted to a `<div>`, with the screen-reader-only `<h1>` moved *inside* `LandingPageWrapper`.
**`/employee` now scores 100.**

Worth presenting rather than hiding: it shows why accessibility fixes need measurement rather than
pattern-matching, and it shows the daily audit working — caught within 24 hours, fixed, and verified by the
next scan.

### Bugs found along the way

- **`Tag.js` threw an exception** — `role`/`tabIndex`/`onKeyDown` were unconditional and the handler called
  `onClick(e)` without checking it existed. Pressing Enter on a decorative tag **crashed**. Now gated on
  `typeof onClick === "function"`.
- A `TextInput` in `CycleConfiguration.js` had no label while its sibling did.
- A dead `onClick={() => {}}` was turning a card into a `role="button"` wrapping a real button.
- A **merge defect**: the `Home.js` revert landed half-applied on `develop` — `<div>` opened but `</main>`
  closed, so core did not compile. Fixed (§6).

---

## 6. Repositories and Release Status

There are **two GitHub repositories** (three local working copies):

| Repo | Path in repo | Role |
|---|---|---|
| `egovernments/DIGIT-UI-LIBRARIES` | `react/ui-components` | Shared components — used by every DIGIT product |
| `egovernments/DIGIT-Frontend` | `micro-ui/` | Core module — app shell, top bar, landing page |
| `egovernments/DIGIT-Frontend` | `health/micro-ui-react19/` | campaign-manager — the product audited |

All component pins across core are now on **dev-77**; core is published at **dev-44**.

**Both release blockers from the previous version of this report are closed**, and the 23 Oct scan confirms
each fix landed in production.

---

## 7. What Drove the Improvement

### Traceability — now confirmed by the 23 Oct scan

| Finding | Fix | Where | Outcome |
|---|---|---|---|
| Severe: form fields unlabelled | `ariaLabel` in the MSD fork | campaign-manager `1f2409c4fa` | ✅ **Severe 1 → 0**; `key=5` 83 → 93 |
| 2× Medium: duplicate/nested main | `Home.js` revert | Core dev-43 | ✅ `/employee` 92 → **100** |
| Medium: sections not labelled (`region`) | Dropdown portal `role="region"` | Library dev-77 | ✅ **Medium 3 → 0**; 6 pages 89 → 93 |
| High: scrollable preview card | `tabIndex` + `role="group"` | campaign-manager | ✅ PERMISSIONHANDLER 86 → 93 |
| Unnamed listboxes site-wide | `Menu.js` `aria-label` fallback | Library `d4b91b15cf` | ✅ confirmed earlier |
| Duplicate banner landmarks | 4 components `<header>` → `<div>` | Library `d4b91b15cf` | ✅ library emits zero banners |
| Low: role not allowed | `<label role>` removed | Library dev-77 | ❌ **still present** — was a different element |

The last row is the one honest miss. We flagged it as unconfirmed, and it turned out the Low on
`unified-upload-screen` was **not** the checkbox label we fixed. It remains open.

### Why shared components dominate

> A rule fires on every page where the failing component renders.

One High (−7) on 25 of 27 pages costs ≈ **6.5 points** of site average. The same High on one page costs
≈ **0.26**. The same defect is roughly **25× more expensive** in a shared component — and 25× cheaper to fix
there. Fixing `Menu.js` once removed an unnamed-listbox High from every page with a menu, in every product.

The `region` fix is the cleanest demonstration: **one change in `Dropdown.js` cleared a Medium from six
pages simultaneously.**

### Work that didn't move the score

The `Tag.js` crash fix, removing phantom tab stops from decorative tags, and `aria-pressed` state on
hierarchy selection are all real improvements with no corresponding axe rule. **A plateauing score does not
mean work stopped delivering value.**

---

## 8. Adoption by Other Products

### What you get automatically

| Category | Automatic on upgrade? | Example |
|---|---|---|
| Shared-component semantics | ✅ **Yes** | Menu names, Chip/Tag, banner removal, Dropdown portal |
| New opt-in props | ❌ Code change | `ariaLabel`, `showLabel`, `wrapLabel` |
| Product-specific markup | ❌ Code change | Loader states, page headings, landmarks |
| **Forked components** | ❌ **Needs a change you may not know about** | Our `MultiSelectDropdown` fork |
| Colour / design tokens | ❌ Design decision | Contrast |

> **Do not assume a library upgrade fixes everything.** In our own product a forked component silently missed
> every library fix for weeks — and it was the cause of our only Severe issue.

### Steps

1. **Inventory** — `npm ls @egovernments/digit-ui-components` and your React version.
2. **Find forks early:**
   ```bash
   find src -name "*.js" | xargs grep -l "MultiSelectDropdown\|Dropdown\|CheckBox" \
     | xargs grep -L "@egovernments/digit-ui-components"
   ```
3. **Baseline audit** — record the exact configuration (routes, viewport, auth). Without it, later
   comparisons are meaningless.
4. **Classify each violation** — shared component / fork / product code / design token.
5. **Upgrade** to **`digit-ui-components` 2.0.0-dev-77 or later** (and `digit-ui-module-core` dev-44+).
6. **Adopt opt-in props** where your audit shows unnamed controls.
7. **Fix product-specific issues** — loader states, headings, landmarks.
8. **Re-audit** with the identical configuration.
9. **Manual validation** — keyboard-only pass, screen-reader spot checks.
10. **Document remaining gaps**, including anything needing design sign-off.

### Example changes

```jsx
// Name a control without changing the visible UI
<CardLabel>{t("DISTRICT")}</CardLabel>
<MultiSelectDropdown options={...} ariaLabel={t("DISTRICT")} />

// Make a scrollable panel keyboard-reachable
<div style={{ overflow: "auto" }} tabIndex={0} role="group" aria-label={t("PREVIEW")}>
```

### Estimating effort

We give **no day estimates** — effort depends on factors specific to each product.

| Workstream | Driven by |
|---|---|
| Library upgrade | Version gap; React 19 readiness |
| Fork remediation | **Number of forked components — the biggest hidden cost** |
| Product remediation | Routes; how many violations are product-specific |
| Design tokens | Brand sign-off cycle, not engineering |
| Manual validation | Number of critical journeys |

**Method:** run a baseline audit, classify by the table above, then size only the product-specific and fork
work. Shared-library issues cost near zero once a compatible version exists.

### Guard rails when fixing

- Prefer **attribute-only** changes (`role`, `aria-*`) — no CSS targets them
- Use `display: contents` to add structure without layout impact
- **When removing an attribute, check whether CSS depends on it** (the `cursor: pointer` trap)
- Run axe's **full rule set** and check **incompletes**, not just violations
- Always use a **negative control** — confirm the rule fires on the unfixed markup. A test that cannot fail
  proves nothing.

---

## 9. Limitations and Risks

### Open issues

| Issue | Severity | Status |
|---|---|---|
| Colour contrast | High | **Open** — needs design sign-off; worth +7 points (§4) |
| Scrollable area on `campaign-home` | High | **Open** — element not located; doesn't reproduce in our browser testing |
| Nested interactive | High | **Open** — on `unified-upload-screen` and `localization-add` |
| Role not allowed for tag | Low | **Open** — not the element we fixed; needs investigation |

### Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Score treated as a compliance claim | Medium | Communicate §2 consistently |
| Forked components miss library fixes | Medium | Audit imports; plan fork convergence |
| CI does not catch non-compiling code on `develop` | Medium | Add a build gate |
| Regression after this milestone | Medium | Keep daily scanning; add axe to CI |

### What we could not verify

The September baseline's severity split · the scanner's viewport and whether it opens dropdowns before
scanning · why the `campaign-home` scrollable issue reproduces in the scanner but not in a browser.

---

## 10. Recommendations

**Highest value — this week**
1. **Decide the two colour tokens.** One design decision takes the site from **92 to ~99** and clears the
   largest remaining barrier for low-vision users. No engineering effort.

**Short term**
2. **Locate the three remaining issues** with state-based axe runs at the scanner's viewport — the scrollable
   region on `campaign-home`, and the nested-interactive plus invalid-role items shared by
   `unified-upload-screen` and `localization-add`.
3. **Add a build gate to CI** — a non-compiling file reached `develop` undetected.
4. **Seed missing localisation keys** — `APP_CONFIG_PREVIEW_REGION`, `CORE_COMMON_USER_MENU`,
   `CS_COMMON_OPTIONS`, `CS_COMMON_SELECT_OPTION`. *(Unseeded keys are read aloud verbatim by screen readers.)*
5. **Update the library's `ACCESSIBILITY_AUDIT.md`** — line 61 records the CheckBox role issue as unfixable;
   it is now fixed and shipped.

**This quarter**
6. **Add automated accessibility checks** (`jest-axe` for components, `@axe-core/playwright` for routes).
7. **Run a manual audit** of critical journeys — the only way to claim real accessibility.
8. **Plan fork convergence** for `MultiSelectDropdown`.
9. **Baseline other DIGIT products** to quantify organisation-wide status.

---

## 11. Q&A

**Why did we do this work?**
> DIGIT serves government health campaigns. Accessibility is a legal and procurement requirement under GIGW,
> Section 508 / EN 301 549 and ADA. Our September baseline was 40/100 — "Poor".

**What did we achieve?**
> Score 40 → 92. Issues 22 → 4 (−82%). Adherence 77% → 95%. Severe and Medium issues eliminated entirely.

**Can we say the product is accessible now?**
> No. We can say automated scanning finds far fewer violations. Automated tools catch ~30–40% of real
> barriers and we have not completed screen-reader testing.

**Why did the score only move 1 point on the last scan when issues halved?**
> Because the four issues removed were concentrated on a few pages, while the one remaining High — contrast —
> is on 25 of 27 pages. That single rule is now worth 7 points on its own.

**Will upgrading the library fix most of our issues?**
> A substantial share, but not all. Opt-in props need code changes, forked components bypass library fixes
> entirely, and product-specific markup needs product fixes. Audit first.

**Which versions should we take?**
> `digit-ui-components` **2.0.0-dev-77** or later, and `digit-ui-module-core` **2.0.0-dev-44** or later. Both
> are published and verified in QA.

**What should our acceptance criteria be?**
> No Severe or High violations on critical journeys; all form controls programmatically named; critical
> journeys completable by keyboard; no new violations from a PR. Avoid a bare score target — it invites
> gaming (§2).

**Are there breaking changes?**
> None identified. Changes are attribute-only or additive opt-in props. `TextInput` without `showLabel` is
> byte-identical to before. `Tag` gained a behavioural **bug fix** — it previously threw on Enter.

**How do we validate a fix?**
> Four layers: axe full rule set including incompletes; a negative control proving the rule fires pre-fix;
> before/after DOM comparison; manual keyboard and screen-reader checks.

**How do we prevent regressions?**
> Daily scanning already works — it caught our 20 Oct regression in 24 hours and confirmed the fix on 23 Oct.
> Next: axe checks in CI and accessibility in the PR checklist.

**What are the audit's known limitations?**
> 27 routes, one viewport, one auth state, automated only, and findings are state-dependent. The
> `campaign-home` scrollable issue reproduces in the scanner but not in our browser testing — still
> unexplained.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **WCAG 2.1** | The international standard; Level AA is the usual legal target |
| **GIGW / Section 508 / ADA** | Indian, US federal and US civil-rights accessibility requirements |
| **axe-core** | The open-source engine that detects violations |
| **Rule** | One automated check, e.g. `color-contrast` |
| **Affected node** | One element failing a rule |
| **Semantic HTML** | Using elements for their meaning (`<button>` for buttons) so assistive tech understands them |
| **ARIA** | Attributes adding meaning where HTML can't. *First rule of ARIA: prefer native HTML* |
| **Accessible name** | The text a screen reader announces for a control |
| **Landmark** | A navigable region (`main`, `banner`, `navigation`) |
| **Screen reader** | Software reading the interface aloud (NVDA, JAWS, VoiceOver) |
| **`display: contents`** | CSS making an element generate no box — adds structure without affecting layout |
| **sr-only** | Visually hidden but available to screen readers |
| **Incomplete** | An axe result needing human review — not a pass |
| **Negative control** | Confirming a test fails on broken markup, proving it can detect the problem |

**Sources:** `hcm-qa-uat-report-2026-10-23.pdf`, `hcm-qa-uat-pages-2026-10-23.pdf`,
`hcm-qa-uat-issues-2026-10-23.pdf`, daily scanner reports 14–23 Oct, the library's `ACCESSIBILITY_AUDIT.md`
(9–12 Oct), and git/npm inspection of both repositories on 23 Oct 2026.

---