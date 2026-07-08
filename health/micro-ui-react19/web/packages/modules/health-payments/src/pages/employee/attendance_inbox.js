import React from "react";
import { useTranslation } from "react-i18next";
import { HeaderComponent } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";
import AttendanceInboxComponent from "../../components/attendance_inbox/attendance_inbox";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

/**
* Business Flow Description:
* 1. In the search section, a project select dropdown is provided.
*    - When a project is selected from the dropdown, the Boundary Search Service is invoked to fetch the boundary hierarchy.
* 2. On successful fetching of the boundary hierarchy from the service:
*    - A dynamic list of boundary selection dropdowns is rendered in the filter section.
* 3. When filters are applied:
*    - The Attendance Register Search API is called with the applied filter criteria.
*    - On receiving a successful response, the table data is rendered accordingly.
* 4. Tab Functionality:
*    - Tabs are implemented in the UI for additional functionality.
*    - Based on the tab selection, the Attendance Register Search API is triggered with a custom payload specific to the selected tab.

*/

/**
 * Reason for not using React Component - InboxComposer:
 * 1. Restrictions in InboxComposer:
 *    - The component requires showing "No Results" initially, which does not align with our requirement. 
 *    - Search should only be triggered after filters are applied.
 * 2. Dynamic Boundary Filters:
 *    - The boundary filter options need to be dynamically determined based on the selected project.
 * 3. Tab-Specific API Calls:
 *    - On tab selection, the same Attendance Register Search API must be called with different status filters, 
 *      which is not inherently supported by the InboxComposer component.

 
 */

const AttendanceInbox = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const fromBill = Boolean(location?.state?.fromBill);

  return (
    <div>
      <HeaderComponent className="payment-screen-headers" styles={{marginBottom:"1.5rem"}}>{t(I18N_KEYS.PAGES_ATTENDANCE.HCM_AM_ATTENDANCE_INBOX)}</HeaderComponent>
      {
        <div
          className="inbox-search-wrapper"
          style={{
            height: "160px",
          }}
        >
          <AttendanceInboxComponent fromBill={fromBill} />
        </div>
      }
    </div>
  );
};

export default AttendanceInbox;
