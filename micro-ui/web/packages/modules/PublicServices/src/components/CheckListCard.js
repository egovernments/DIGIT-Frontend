import React from "react";
import { Card, TextBlock, Button, Loader } from "@egovernments/digit-ui-components";
import { transformViewApplication } from "../utils/createUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckListCard = (props) => {
    const [filled, setFilled] = useState(false);
    const [loading, setLoading] = useState(false);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const navigate = useNavigate();

    const style = {
        display: "flex",
        alignItems: "center",
        gap: "1rem"
    };

    //To fetch the checklist data
    const request = {
        url: "/health-service-request/service/v1/_search",
        params: {},
        body: {},
        method: "POST",
        headers: {},
        config: {
            enable: false,
        },
    }
    const mutation = Digit.Hooks.useCustomAPIMutationHook(request);

    //To check if the checklist is in filled or pending to fill state
    const isFilled = async (id, accid) => {

        await mutation.mutate(
            {
                url: '/health-service-request/service/v1/_search',
                method: "POST",
                body: transformViewApplication(id, accid,tenantId),
                config: {
                    enable: false,
                },
            },
            {
                onSuccess: (res) => {
                    let field = res.Services.filter(items => items.serviceDefId == id);
                    const allValid = field?.[0]?.additionalFields?.[0].action=="SUBMIT";
                    if (field && field.length > 0) {
                        setFilled(allValid);
                    }
                    setLoading(true);
                },
                onError: () => {
                    console.error("Error checking filled status");
                    setLoading(true);
                },
            }
        )
    }

    useEffect(() => {
        isFilled(props.item.id, props.accid)
    }, [props.item.id, props.accid]);

    return (
        <div>
            {loading ? (
                <Card type="primary" style={style}>
                    <TextBlock body={props.t(props.item.code)} />
                    {filled ? (
                        <Button label="View Response" onClick={() => 
                            navigate({ 
                                pathname: `/${window.contextPath}/${window?.location.href.includes("/citizen/")? "citizen" : "employee"}/publicservices/viewresponse`,
                                search : `?accid=${props.accid}&id=${props.item.id}&code=${props.item.code}`,
                                state:{
                                    cardItems:props.item,
                                    redirectionUrl : `${window.location.href}`
                                },
                            })
                        } />
                    ) : (
                        <Button label="Fill Checklist" onClick={() => navigate(window?.location.href.includes("/citizen/")? `/${window.contextPath}/citizen/publicservices/checklist?accid=${props.accid}&id=${props.item.id}&code=${props.item.code}` :  `/${window.contextPath}/employee/publicservices/checklist?accid=${props.accid}&id=${props.item.id}&code=${props.item.code}`, { redirectionUrl : `${window.location.href}`,})} />
                    )}
                </Card>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default CheckListCard;