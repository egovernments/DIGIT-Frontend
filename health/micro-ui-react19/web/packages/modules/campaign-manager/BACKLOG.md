# Technical Backlog

This file tracks technical debt and improvements to be picked up in future sprints.

---

## Pending Improvements

### 1. Separate Delivery Cycle Page
- **Priority:** Medium
- **Description:** Only delivery cycle needs a separate page instead of the whole setup campaign flow
- **Current State:** Delivery cycle configuration is embedded within the complete SetupCampaign wizard flow
- **Proposed Change:** Extract delivery cycle configuration into its own dedicated standalone page for direct access
- **Files Affected:**
  - `src/pages/employee/SetupCampaign.js`
  - `src/pages/employee/CycleConfiguration.js`
  - `src/configs/CampaignConfig.js`

### 2. Remove Unused Route Definitions
- **Priority:** Low
- **Description:** The route `create-campaign/cycle-configure` is defined but never navigated to
- **Current State:** Routes exist in `index.js` (lines 340, 382) but no navigation points to them
- **Proposed Change:** Remove dead route definitions or implement navigation if standalone page is needed
- **Files Affected:**
  - `src/pages/employee/index.js`

---

## Notes
- `CycleConfiguration.js` is actively used as a component within the SetupCampaign wizard (via FormComposerV2 and CampaignConfig.js)
- The file should NOT be removed, only the unused routes can be cleaned up
