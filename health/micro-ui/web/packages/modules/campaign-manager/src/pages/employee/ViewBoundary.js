import React, { useEffect, useState , useRef} from "react";
import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { boundarySearchConfig } from "../../configs/boundarySearchConfig";
import { useTranslation } from "react-i18next";

const ViewBoundary = () => {
    const { t } = useTranslation();


    return (
        <div>
            <Header styles={{ fontSize: "2.5rem", marginBottom:"1rem", marginTop:"2rem"}}>{t("CURRENT_HIERARCHIES")}</Header> 
            <div className="inbox-search-wrapper">
                {/* Pass defaultValues as props to InboxSearchComposer */}
                <InboxSearchComposer configs={boundarySearchConfig?.[0]} 
                    // defaultValues={defaultValues} 
                    additionalConfig={{
                    resultsTable: {
                        // onClickRow,
                    },
                    }}
                    >
                </InboxSearchComposer>
            </div>
        </div>
    )


};

export default ViewBoundary;