import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { convertEpochToDate } from "../../../../libraries/src/utils/pt";
import PropertyDocuments from "../../../templates/ApplicationDetails/components/PropertyDocuments";

const ViewSubProjectsDetails = ({subProjects}) => {
    const {t} = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
    const [rows, setRows] = useState(subProjects[0]);
    const columns = [
        {label : t('WORKS_SNO'), isMandatory : false },
        {label : t('WORKS_NAME_OF_SUB_PROJECT'), isMandatory : true },
        {label : t('WORKS_ESTIMATED_AMOUNT'), isMandatory : false },
        {label : t('WORKS_PROJECT_TYPE'), isMandatory : true },
        {label : t('WORKS_SUB_PROJECT_TYPE'), isMandatory : false },
        {label : t('WORKS_WORK_NATURE'), isMandatory : false },
        {label : t('WORKS_PROJECT_START_DATE'), isMandatory : false },
        {label : t('WORKS_PROJECT_END_DATE'), isMandatory : false },
        {label : t('WORKS_MODE_OF_ENTRUSTMENT'), isMandatory : false },
        {label : t('WORKS_WARD'), isMandatory : false },
        {label : t('WORKS_LOCALITY'), isMandatory : false },
        {label : t('ES_COMMON_ULB'), isMandatory : false },
        {label : t('WORKS_GEO_LOCATION'), isMandatory : false },
        {label : t('WORKS_UPLOAD_DOCS'), isMandatory : false },
    ];

        
    const getStyles = (type) => {
        if(type === "upload") {
            return { "minWidth": "20rem", "padding" : "20px 18px" };
        }
        if(type === "SNO") {
            return { "minWidth": "2rem", "padding" : "20px 18px" };
        }
        if(type === "PROJECT_NAME") {
            return { "minWidth": "20rem", "padding" : "20px 18px" };
        }
        if(type === "DATE") {
            return { "minWidth": "20rem", "padding" : "20px 18px" };
        }
        return { "minWidth": "20rem", "padding" : "20px 18px" };
    }

    const renderHeader = () => {
        return columns?.map((column, index) => {
            if(column.label === t("WORKS_SNO")) {
                return <th key={index} style={getStyles("SNO")} >{column?.label}</th>
            }
            return <th key={index} style={getStyles()} >{column?.label}</th>
        })
    }

    const renderBody = () => {
        let i = 0
        return rows.map((subProject, index) => {
            i++;
            return <tr key={index} style={{ "height": "50%" }}>
                <td style={getStyles('SNO')}>{i}</td>
                <td style={getStyles('PROJECT_NAME')} >
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.name)}</p>
                    </div>
                </td>
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.estimatedAmount)}</p>
                    </div>
                </td>
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(`WORKS_PROJECT_TYPE_${subProject?.type}`)}</p>
                    </div>
                </td>  
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(`ES_COMMON_${subProject?.subType}`)}</p>
                    </div>
                </td>
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.natureOfWork)}</p>
                    </div>
                </td>
                <td style={getStyles("DATE")}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{convertEpochToDate(subProject?.startDate)}</p>
                    </div>
                </td>  
                <td style={getStyles("DATE")}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{convertEpochToDate(subProject?.endDate)}</p>
                    </div>
                </td> 
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.modeOfEntrustment)}</p>
                    </div>
                </td>   
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.ward)}</p>
                    </div>
                </td> 
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(`${headerLocale}_ADMIN_${subProject?.locality}`)}</p>
                    </div>
                </td>  
                <td style={getStyles()}>
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.ulb)}</p>
                    </div>
                </td> 
                <td style={getStyles()} >
                    <div className='field' style={{ "width": "100%" }} >
                        <p>{t(subProject?.geoLocation)}</p>
                    </div>
                </td>
                <td style={getStyles("upload")}>
                    <div className='field' style={{ "width": "100%" }} >
                        <PropertyDocuments documents={subProject?.uploadedDocuments} />
                    </div>
                </td> 
            </tr>
        })
    }

    return <>
        <div className="sub-project-table-wrapper no-padding">
            <table className='table sub-work-table project-details-table'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </div>
    </>
}

export default ViewSubProjectsDetails;