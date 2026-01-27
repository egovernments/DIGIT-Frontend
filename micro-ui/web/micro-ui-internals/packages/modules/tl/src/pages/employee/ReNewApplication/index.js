import { FormComposer, Header, Loader, Toast, Card, CardHeader, CardText, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { convertEpochToDate, gettradeownerarray, gettradeunits, gettradeupdateaccessories, gettradeupdateunits, getTLAcknowledgementData } from "../../../utils";


const ReNewApplication = () => {
    const { t } = useTranslation();
    const history = useHistory();
    let { id: applicationNumber, tenantId } = useParams();
    tenantId = tenantId ? tenantId : Digit.ULBService.getCurrentTenantId();
    const [showToast, setShowToast] = useState(null);
    const [canSubmit, setCommitState] = useState(false);
    const { data: applicationDetails, isLoading } = Digit.Hooks.tl.useApplicationDetail(t, tenantId, applicationNumber);
    const stateId = Digit.ULBService.getStateId();

    const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
    const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", false);

    const { data: Reciept_data, isLoading: reciept_loading } = Digit.Hooks.useRecieptSearch(
        {
            tenantId: stateId,
            businessService: "TL",
            consumerCodes: applicationDetails?.applicationData?.applicationNumber,
            isEmployee: false,
        },
        { enabled: applicationDetails?.applicationData?.applicationNumber ? true : false }
    );

    useEffect(() => {
        setMutationHappened(false);
        clearSuccessData();
    }, []);

    const closeToast = () => {
        setShowToast(null);
    };

    const onDownloadAck = async () => {
        const File = { fileStoreId: Reciept_data?.Payments?.[0]?.fileStoreId };
        Digit.Utils.downloadEgovPDF("TL/Renewal_Acknowledgement", { ...applicationDetails?.applicationData }, tenantId ? tenantId : stateId);
    }

    const printReciept = async () => {
        const tenantId = Digit.ULBService.getCurrentTenantId();
        const state = Digit.ULBService.getStateId();
        const payments = await Digit.PaymentService.getReciept(tenantId, "TL", { consumerCodes: applicationDetails?.applicationData?.applicationNumber });
        let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };
        if (!payments.Payments[0]?.fileStoreId) {
            response = await Digit.PaymentService.generatePdf(state, { Payments: payments.Payments }, "tradelicense-receipt");
        }
        const fileStore = await Digit.PaymentService.printReciept(state, response?.filestoreIds[0]);
        window.open(fileStore[response?.filestoreIds[0]], "_blank");
    };

    if (!applicationDetails?.applicationData?.applicationNumber) {
        return <Loader />
    }

    return (
        <div>
            <Header>{t("TL_RENEW_APPLICATION_HEADER_LABEL")}</Header>
            <Card>
                <CardHeader>{t("TL_APPLICATION_SUBMITTED_SUCCESSFULLY")}</CardHeader>
                <CardText>
                    {t("TL_RENEW_APPLICATION_SUCCESS_MESSAGE", {
                        applicationNumber: applicationDetails?.applicationData?.applicationNumber,
                        financialYear: applicationDetails?.applicationData?.financialYear
                    })}
                </CardText>
                {!reciept_loading && Reciept_data?.Payments?.length > 0 && <ActionBar style={{ backgroundColor: "white" }}>
                    <SubmitBar label={t("TL_DOWNLOAD_RECEIPT")} onSubmit={printReciept} />
                </ActionBar>}
                {!reciept_loading && !(Reciept_data?.Payments?.length > 0) && <ActionBar style={{ backgroundColor: "white" }}>
                    <SubmitBar label={t("TL_DOWNLOAD_ACK_FORM")} onSubmit={onDownloadAck} />
                </ActionBar>}
            </Card>
        </div>
    );
};

export default ReNewApplication;
