import {
    Header,
    InboxSearchComposer
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { caseAndFilingSearchConfig } from "../../configs/caseAndFilingSearchConfig";


// TODO: Searching via CaseNumber is taking to much time(from server side), need to optimize it

const defaultSearchValues = {
    filingNumber: "CASE-FILING-NO-2024-06-15-001711",
    caseNumber: ""
    
};



const CaseAndFilingSearch = () => {
    const { t } = useTranslation();
    const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
    const indConfigs = caseAndFilingSearchConfig();

    useEffect(() => {
        // Set default values when component mounts
        setDefaultValues(defaultSearchValues);
    }, []);

    return (
        <React.Fragment>
            <Header >{t(indConfigs?.label)}</Header>
            <div className="inbox-search-wrapper">
                {/* Pass defaultValues as props to InboxSearchComposer */}
                <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
            </div>
        </React.Fragment>
    );
};
export default CaseAndFilingSearch;