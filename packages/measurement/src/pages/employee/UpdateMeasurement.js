import { Loader, FormComposerV2, Header } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import CreateMeasurement from "./CreateMeasurement";
import _ from "lodash";
import { transformMeasurementData } from "../../utils/transformMeasurementData";
const UpdateMeasurement = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const history = useHistory();

    const [data, setData] = useState(null);
    // get MBNumber from the url
    const searchparams = new URLSearchParams(location.search);
    const mbNumber = searchparams.get("mbNumber");

    const pagination = {

    }
    const criteria = {
        tenantId: tenantId,
        measurementNumber: mbNumber
    }
    const body = {
        criteria,
        pagination
    }
    const reqCriteriaUpdate = {
        url: `/measurement-service/v1/_search`,
        params: {},
        body: {},
        config: {
            enabled: false,
        },
    };
    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);
    useEffect(() => {
        const onError = (resp) => {
            setErrorMessage(resp?.response?.data?.Errors?.[0]?.message);
            setShowErrorToast(true);
        };

        const onSuccess = (resp) => {
            setData(resp);
        };

        mutation.mutate(
            {
                params: {},
                body: { ...body },
                config: {
                    enabled: true,
                }
            },
            {
                onError,
                onSuccess,
            }
        );
    }, []);
    if (data == undefined) {
        return <Loader />
    }
    const propsToSend = {
        isUpdate: true,
        data: data?.measurements,
    }
    return (
        <CreateMeasurement props={propsToSend}></CreateMeasurement>
    );
};
export default UpdateMeasurement;