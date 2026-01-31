import React from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import AttendanceInboxComponent from "../../components/attendance_inbox/attendance_inbox";

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

  return (
    <div>
      <Header styles={{ fontSize: "28px" }}>
        <span style={{ color: "#0B4B66" }}>{t("HCM_AM_ATTENDANCE_INBOX")}</span>
      </Header>
      {
        <div
          className="inbox-search-wrapper"
          style={{
            height: "160px",
          }}
        >
          <AttendanceInboxComponent></AttendanceInboxComponent>
        </div>
      }
    </div>
  );
};

export default AttendanceInbox;
