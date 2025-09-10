import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dropdown,
    Loader,
    HeaderComponent,
    Card,
    LabelFieldPair,
    Button,
    Toast,
    CardLabel
} from "@egovernments/digit-ui-components";

const UserAssignment = ({t, config, onSelect, formData,}) => {


    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [options, setOptions] = useState([]);

    const boundaryCode = Digit?.SessionStorage.get("selectedBoundary")?.code;
    //const { t } = useTranslation();
    const tenantId = Digit.ULBService.getStateId();

    const reqCri = {
        url: `/health-individual/v1/_search`,
        params: {
            tenantId: tenantId,
            limit: 4,
            offset: 0,
        },
        body: {
            Individual: {
                roleCodes: ["PROXIMITY_SUPERVISOR"],
                locality: {
                    id: null,
                    tenantId: null,
                    code: boundaryCode,
                    geometry: null,
                    auditDetails: null,
                    additionalDetails: null
                }
            }
        },
        config: {
            enabled: true,
            select: (data) => {

                console.log("data", data);
                return data.Individual;
            },
        },
    };
    // Fetch project staff details using custom API hook
    const { isLoading: isIndividualsLoading, data: individualData } = Digit.Hooks.useCustomAPIHook(reqCri);

    console.log("assignTo", individualData);


    useEffect(() => {
        if (!individualData) return; // wait until data is available

        const result = individualData.map(item => ({
            code: item.id,
            name: item.name?.givenName || null
        }));
        setOptions(result);
    }, [individualData]);


    if (isIndividualsLoading) {
        return <Loader />
    }

    return (
        <LabelFieldPair>
            <CardLabel style={{ width: "50.1%" }} className="digit-card-label-smaller">
                {t("HCM_AM_REPORTING_TO")}
            </CardLabel>
            <div style={{ width: "100%" }}>
                <Dropdown
                    style={{ width: "40rem" }}
                    t={t}
                    option={options}
                    optionKey={"name"}
                    selected={selectedHierarchy}
                    select={(value) => {
                        setSelectedHierarchy(value)
                         onSelect(config.key, value);
                    }}
                // select={(value) => onHierarchySelect(value)}
                />
            </div>
        </LabelFieldPair>
    )





}



export default UserAssignment;