import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";

import { Header, InboxSearchComposer, Loader, Button, AddFilled } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { SearchHouseholdConfig } from "./SearchHouseholdConfig";
import { SearchProductConfig } from "./SearchProductConfig";
import { SearchProductVariant } from "./SearchProductVariantConfig";
import { SearchProjectBeneficiary } from "./SearchProjectBeneficiaryConfig";
import { SearchProjectStaff } from "./SearchProjectStaffConfig";
import { SearchProjectTask } from "./SearchProjectTaskConfig";
import { SearchProjectConfig } from "./SearchProjectConfig";
import { SearchFacilityConfig } from "./SearchFacility";

const SearchBoundary = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory()
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("config");
    const configModuleName = Digit.Utils.getConfigModuleName()
    const tenant = Digit.ULBService.getStateId();
    const { isLoading, data } = Digit.Hooks.useCustomMDMS(
        "mz",
        "commonHCMUiConfig",
        [
            {
                name: id
            }
        ],
        {
            select: (data) => {
                // return data?.commonHCMUiConfig[id]?.[0]
                return SearchFacilityConfig?.SearchFacilityConfig?.[0];
            },
        }
    );
    
    let config = useMemo(
        () => Digit.Utils.preProcessMDMSConfigInboxSearch(t, data, "sections.search.uiConfig.fields", {
            updateDependent: [
                {
                    key: "fromProposalDate",
                    value: [new Date().toISOString().split("T")[0]]
                },
                {
                    key: "toProposalDate",
                    value: [new Date().toISOString().split("T")[0]]
                }
            ]
        }
        ), [data]);


    if (isLoading) return <Loader />


    return (
        <React.Fragment>
            <Header className="works-header-search">{t(config?.label)}</Header>
            {Digit.Utils.didEmployeeHasRole(config?.actionRole) && (
                <Button
                    label={t(config?.actionLabel)}
                    variation="secondary"
                    icon={<AddFilled />}
                    onButtonClick={() => {
                        history.push(`/${config?.actionLink}`)
                    }}
                    type="button"
                />
            )}
            <div className="inbox-search-wrapper">
                <InboxSearchComposer configs={config}></InboxSearchComposer>
            </div>
        </React.Fragment>
    )
};

export default SearchBoundary;
