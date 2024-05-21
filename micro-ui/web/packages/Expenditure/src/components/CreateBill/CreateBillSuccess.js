import React from 'react'
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";


const CreateBillSuccess = ({isSuccess}) => {
    const {t} = useTranslation()

    return (
        <Card>
            <Banner 
                successful={isSuccess}
                message={`${isSuccess ? t("EXP_BILL_CREATION_SUCCESS") : t("EXP_BILL_CREATION_FAILURE")}`}
                info={`${isSuccess ? t("EXP_BILL_ID") : ""}`}
                applicationNumber={`${isSuccess ? "Bill/2021-22/09/0001" : ""}`}
                whichSvg={`${isSuccess ? "tick" : null}`}
            />

            {isSuccess && <CardText>{t("EXP_BILL_CREATION_SUCCESS_MESSAGE")}</CardText>}

            <ActionBar>
                <Link to={`/${window.contextPath}/employee`}>
                    <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
                </Link>
            </ActionBar>
        </Card>
    )
}

export default CreateBillSuccess