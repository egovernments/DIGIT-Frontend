import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ViewBillsMenu = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const billsConfigs = {
        path : `/${window.contextPath}/employee/expenditure/view-bills/bills`,
        view : [
            {
                key : 'PO',
                label : t("EXP_VIEW_PO_BILLS")
            },
            {
                key : 'WO',
                label : t("EXP_VIEW_WO_BILLS")
            },
            {
                key : 'SHG',
                label : t("EXP_VIEW_SHG_BILLS")
            }
        ]
    }

    const handleBillMenu = (billType) => {
        history.push({
            pathname : billsConfigs?.path,
            state : {
                billType : billType?.key
            }
        });
    }

    return (
        <React.Fragment>
            {
                billsConfigs?.view?.map((billType)=>(
                    <div key={billType?.key} onClick={()=>handleBillMenu(billType)} className="bills-menu-options">{billType.label}</div>
                ))
            }
        </React.Fragment>
    )
}

export default ViewBillsMenu;