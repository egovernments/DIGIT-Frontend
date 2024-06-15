

import {
  Header,
  InboxSearchComposer
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/ViewHearingConfig";
import { useHistory } from 'react-router-dom';
import { downloadHearingsAsPDF } from "../../hooks/services/downloadHearingPDF";

const defaultSearchValues = {
  individualName: "",
  mobileNumber: "",
  IndividualID: ""
};



const ViewHearing = () => {

  const { t } = useTranslation();
  const history = useHistory();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = searchconfig();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  const dropdownItems = [
    { label: 'View Case', path: '/employee/hearings/view-case' },
    { label: 'Reschedule hearing', path: '/employee/hearings/reschedule-hearing' },
    { label: 'View transcript', path: '/employee/hearings/view-transcript' },
    { label: 'View witness deposition', path: '/employee/hearings/view-witness-deposition' },
    { label: 'View pending task', path: '/employee/hearings/view-pending-task' },
  ];

  const downloadHearing = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const epochFromDateTime = today.getTime();
    today.setHours(23, 59, 59, 999);
    const epochToDateTime = today.getTime();
    // TODO: Prepare query list
    let params = {
      'tenantId': Digit.ULBService.getCurrentTenantId(),
      'judgeId': '87f0c966-e42c-490d-8edb-bfwe9a9da5b60', // TODO: Remove hardcoded judgeId
      'fromDate': epochFromDateTime,
      'toDate': epochToDateTime
    }
    downloadHearingsAsPDF({t, params})
  }

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  return (
    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <React.Fragment>
      <Header >{t(indConfigs?.label)}</Header> 
      <div className="inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
      </div>
      // TODO: Create a button and call downloadHearing()
    </React.Fragment>
  // </div>
  
    
  );
};
export default ViewHearing;

