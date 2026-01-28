import React from "react";
import { Card, TextBlock, Button } from "@egovernments/digit-ui-components";
import { useEffect, useState } from "react";
import transformViewCheckList from "../../../utils/createUtils.js"
import CheckListCard from "../../../components/CheckListCard.js";
import { useTranslation } from "react-i18next";

const ViewCheckListCards = ({checkListCodes, applicationId, serviceConfigData}) => {
    const { t } = useTranslation();

    const code = checkListCodes;
    const accountID = applicationId;
    const [cardItems, setCardItems] = useState([]);

    // Get logged-in user info and roles
    const userInfo = Digit.UserService.getUser();
    const userRoles = userInfo?.info?.roles?.map(role => role.code) || [];

    // Get editor roles from service config
    const editorRoles = serviceConfigData?.mdms?.[0]?.data?.access?.roles?.editor || [];
    let finalAllowedRoles = editorRoles ? [...editorRoles, "STUDIO_ADMIN"] : ["STUDIO_ADMIN"];

    // Check if user has any editor role
    const hasEditorAccess = userRoles.some(userRole => finalAllowedRoles.includes(userRole));

    const request = {
        url: "/health-service-request/service/definition/v1/_search",
        params: {},
        body: {},
        method: "POST",
        headers: {},
        config: {
            enable: false,
        },
    }
    const mutation = Digit.Hooks.useCustomAPIMutationHook(request);

    const getcarditems = async (code) => {
        // Only fetch checklist if user has editor access
        if (!hasEditorAccess) {
            setCardItems([]);
            return;
        }

        await mutation.mutate(
            {
                url: "/health-service-request/service/definition/v1/_search",
                method: "POST",
                body: transformViewCheckList(code),
                config: {
                    enable: false,
                },
            },
            {
                onSuccess: (res) => {
                    if(code?.length > 0)
                    setCardItems(res?.ServiceDefinitions);
                    else
                    setCardItems([])
                },
                onError: () => {
                    console.error("Error occured");
                },
            }
        )
    }

    useEffect(() => {
        getcarditems(code);
    }, [code, hasEditorAccess]);

    return (
        <React.Fragment>
            {
                cardItems.map((item, index) => (
                    <CheckListCard 
                        key={`${item.id}-${checkListCodes?.join(',')}`} // Forces re-mount when checklist codes change
                        item={item} 
                        t={t} 
                        accid={accountID}
                    />
                ))
            }
        </React.Fragment>
    );
};

export default ViewCheckListCards;