# Localization Constants - Developer Guide

## Overview

This folder contains the centralized localization constants for the Campaign Manager module. All localization strings used in `t()` translation function calls **must** be referenced from `localizationConstants.js` instead of using hardcoded string literals.

## Why Use Localization Constants?

### Benefits
- ✅ **Type Safety**: Catch missing or typo'd localization keys at development time
- ✅ **Maintainability**: Easy to find and update all localization keys in one place
- ✅ **Discoverability**: Developers can see all available translations at a glance
- ✅ **Refactoring**: Easier to rename or reorganize translation keys
- ✅ **Code Quality**: Prevents duplicate or inconsistent translation keys

### Anti-Patterns (Don't Do This)
```javascript
// ❌ BAD - Hardcoded string literals
t("CAMPAIGN_NAME")
t("HCM_SUBMIT")

// ❌ BAD - Magic strings scattered across the codebase
const submitText = t("SUBMIT");
```

### Best Practices (Do This)
```javascript
// ✅ GOOD - Import and use constants
import { LOCALIZATION } from "../constants/localizationConstants";

const submitText = t(LOCALIZATION.SUBMIT);
```

---

## How to Add New Localization Strings

### Step 1: Add the Constant to `localizationConstants.js`

Open `constants/localizationConstants.js` and add your new constant under the **appropriate category**.

**Example**: Adding a new button label

```javascript
export const LOCALIZATION = {
  // ... existing constants ...

  // ==========================================================================
  // 1. COMMONLY USED KEYS - Buttons, Actions, and Navigation
  // ==========================================================================
  BACK: "BACK",
  NEXT: "NEXT",
  SUBMIT: "SUBMIT",

  // Add your new constant here
  SAVE_AND_CONTINUE: "SAVE_AND_CONTINUE",  // ✅ New constant added

  // ... more constants ...
};
```

**Naming Conventions**:
- Use **SCREAMING_SNAKE_CASE** for constant names
- The constant name should match the actual translation key string
- Be descriptive but concise
- Group related constants together

### Step 2: Import LOCALIZATION in Your Component

At the top of your component file, import the LOCALIZATION constant:

```javascript
import { LOCALIZATION } from "../constants/localizationConstants";
// or adjust the path based on your file location:
// import { LOCALIZATION } from "../../constants/localizationConstants";
```

### Step 3: Use the Constant in Your Component

Use `t(LOCALIZATION.YOUR_CONSTANT)` instead of `t("YOUR_CONSTANT")`:

```javascript
import React from "react";
import { useTranslation } from "react-i18next";
import { LOCALIZATION } from "../constants/localizationConstants";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t(LOCALIZATION.CAMPAIGN_NAME)}</h1>
      <button>{t(LOCALIZATION.SAVE_AND_CONTINUE)}</button>
    </div>
  );
};

export default MyComponent;
```

### Step 4: Ensure Translation Exists in Localization Service

Make sure the actual translation string exists in your localization backend/service. The constant value (e.g., `"SAVE_AND_CONTINUE"`) should match the key in your localization files.

---

## Understanding the Constants File Structure

The `localizationConstants.js` file is organized into **20 logical sections**:

### 1. Commonly Used Keys
Buttons, actions, navigation elements used across multiple flows
- `BACK`, `NEXT`, `SUBMIT`, `CANCEL`, `SAVE`, `EDIT`, `DELETE`, etc.

### 2. Toast Messages
Success, error, warning, and progress messages
- Success: `*_SUCCESS_RESPONSE`, `*_CREATED_SUCCESSFULLY`
- Errors: `*_ERROR`, `*_FAILED`, `INVALID_*`
- Progress: `*_IN_PROGRESS`, `PLEASE_WAIT*`, `VALIDATING_*`

### 3. Create Campaign Flow
All strings related to creating a new campaign
- Campaign home, navigation, details, type, name, dates, cycles, summary

### 4. Boundary Selection Flow
Selecting and managing boundaries for campaigns

### 5. Boundary Data Management Flow
Creating, editing, and managing boundary hierarchies

### 6. Upload Data Flow
Uploading facilities, users, targets, and boundary data

### 7. Upload Localization Flow
Bulk uploading localization files and module selection

### 8. Delivery Rules Configuration Flow
Configuring delivery rules, conditions, and products

### 9. Product Management Flow
Adding and managing campaign products

### 10. App Configuration Flow
Mobile app configuration, fields, navigation, and modules

### 11. Checklist Flow
Creating, viewing, and updating checklists

### 12. My Campaigns Flow
Campaign list, search, and cloning

### 13. Date and Cycle Update Flow
Updating campaign dates and cycles

### 14. Microplan Integration Flow
Fetching and integrating with microplans

### 15. Timeline & Progress Tracking
Campaign timeline and progress visualization

### 16. Documents & Resources
Campaign documents and resources

### 17. National Dashboard & DSS
Dashboard and analytics views

### 18-20. Additional Sections
Multi-tab context, API handling, and utility keys

---

## Finding the Right Category for Your String

Use this decision tree:

1. **Is it a common button/action?** → Section 1 (Commonly Used Keys)
2. **Is it a success/error/progress message?** → Section 2 (Toast Messages)
3. **Which feature flow does it belong to?**
   - Creating campaigns → Section 3
   - Selecting boundaries → Section 4
   - Managing boundary data → Section 5
   - Uploading data → Section 6
   - Uploading localization → Section 7
   - Delivery rules → Section 8
   - Product management → Section 9
   - App configuration → Section 10
   - Checklists → Section 11
   - My campaigns list → Section 12
   - Date/cycle updates → Section 13
   - Microplan integration → Section 14
   - Timeline → Section 15
   - Documents → Section 16
   - Dashboards → Section 17
4. **Doesn't fit anywhere?** → Section 20 (Additional Utility Keys)

---

## Migration Guide (For Existing Code)

If you're working on an existing file that uses hardcoded strings:

### Before Migration
```javascript
// OldComponent.js
const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("CAMPAIGN_NAME")}</h1>
      <button>{t("SUBMIT")}</button>
      <p>{t("HCM_CAMPAIGN_DATES_DESC")}</p>
    </div>
  );
};
```

### After Migration
```javascript
// OldComponent.js
import { LOCALIZATION } from "../constants/localizationConstants";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t(LOCALIZATION.CAMPAIGN_NAME)}</h1>
      <button>{t(LOCALIZATION.SUBMIT)}</button>
      <p>{t(LOCALIZATION.HCM_CAMPAIGN_DATES_DESC)}</p>
    </div>
  );
};
```

### Migration Checklist
- [ ] Import `LOCALIZATION` from constants
- [ ] Replace all `t("STRING")` with `t(LOCALIZATION.STRING)`
- [ ] Verify all constants exist in `localizationConstants.js`
- [ ] Add any missing constants to the appropriate section
- [ ] Test the component to ensure translations still work

---

## Special Cases & Edge Cases

### Dynamic Translation Keys

Some components use dynamic translation keys based on variables. These are acceptable exceptions:

```javascript
// ✅ Acceptable - Dynamic key based on runtime value
const roleKey = `ACCESSCONTROL_ROLES_ROLES_${roleLocal}`;
t(roleKey);

// ✅ Acceptable - Template literal with variable
t(`CAMPAIGN_PROJECT_${projectType.toUpperCase()}`);
```

**Note**: For dynamic keys, ensure all possible variants exist in the localization service.

### Empty or Placeholder Strings

**Don't do this:**
```javascript
// ❌ BAD - Empty placeholder
t("")
```

**Instead, use a proper constant or remove the translation:**
```javascript
// ✅ GOOD - Use a meaningful placeholder constant
t(LOCALIZATION.PLACEHOLDER_TEXT)

// ✅ GOOD - Or don't translate if not needed
<div>Some static text</div>
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting to Import
```javascript
// ❌ This will cause a runtime error
const text = t(LOCALIZATION.SUBMIT);  // LOCALIZATION is not defined
```

**Fix**: Always import LOCALIZATION
```javascript
import { LOCALIZATION } from "../constants/localizationConstants";
```

### ❌ Mistake 2: Typos in Constant Names
```javascript
// ❌ Typo in constant name
t(LOCALIZATION.SUBMITT);  // Should be SUBMIT
```

**Fix**: Use IDE autocomplete or check the constants file

### ❌ Mistake 3: Creating Duplicate Constants
```javascript
// ❌ Both constants have the same value
export const LOCALIZATION = {
  BACK: "BACK",
  GO_BACK: "GO_BACK",  // Potential duplicate
  HCM_BACK: "HCM_BACK",  // Another duplicate?
};
```

**Fix**: Check if a similar constant already exists before adding a new one

---

## Quick Reference: File Paths

Depending on where your component is located, use the appropriate import path:

```javascript
// From: src/components/
import { LOCALIZATION } from "../constants/localizationConstants";

// From: src/pages/employee/
import { LOCALIZATION } from "../../constants/localizationConstants";

// From: src/pages/employee/NewCampaignCreate/
import { LOCALIZATION } from "../../../constants/localizationConstants";

// From: src/utils/
import { LOCALIZATION } from "../constants/localizationConstants";
```

---

## FAQs

### Q: What if my translation key doesn't exist in the constants file?
**A**: Add it! Follow the steps in "How to Add New Localization Strings" above.

### Q: Can I add constants with different naming patterns?
**A**: Try to follow existing naming conventions. Look for similar constants and match their pattern (e.g., `HCM_*`, `ES_*`, `CAMPAIGN_*`).

### Q: What if I need to use the same translation in multiple places?
**A**: That's the point! Reuse the same constant everywhere. This ensures consistency.

### Q: Should I create separate constants for similar translations?
**A**: Check if an existing constant serves the same purpose. For example, use `LOCALIZATION.BACK` instead of creating `LOCALIZATION.GO_BACK_BUTTON`.

### Q: What about dynamic translation keys based on user input?
**A**: For runtime-dynamic keys, it's acceptable to use template literals. Just ensure all possible key variants exist in your localization service.

---

## Need Help?

- Check the existing constants in `localizationConstants.js` for examples
- Look at how similar components import and use LOCALIZATION

---
