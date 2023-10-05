import React, { Fragment, useCallback, useMemo, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { CloseSvg, SearchForm, Table, Card, SearchAction, PopUp, DetailsCard, Loader, Toast,CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";



const ViewProjects = ({ tenantId = "pb.amritsar", data = {}, onSubmit = () => {}, isLoading = false, resultOk = true }) => {

    data = [[], []]
    const history = useHistory()
    const { t } = useTranslation()

    
    // const convertEpochToDate = (dateEpoch) => {
    //     if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    //         return "NA";
    //     }
    //     const dateFromApi = new Date(dateEpoch);
    //     let month = dateFromApi.getMonth() + 1;
    //     let day = dateFromApi.getDate();
    //     let year = dateFromApi.getFullYear();
    //     month = (month > 9 ? "" : "0") + month;
    //     day = (day > 9 ? "" : "0") + day;
    //     return `${day}/${month}/${year}`;
    // };

    // const GetCell = (value) => <span className="cell-text">{value}</span>;

    const propsMobileInboxCards = useMemo(() => {
        // if (data?.display) {
        //     return [];
        // }
        if (isLoading) {
            return [];
        }
        return data?.map((row) => ({
            // [t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")]: row?.user?.name ? t(`${row?.user?.name}`) : "NA",
            // [t("ABG_COMMON_TABLE_COL_BILL_DATE")]: GetCell(convertEpochToDate(row?.billDate)),
            // [t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")]: GetCell(row?.totalAmount || "NA"),
            // [t("ABG_COMMON_TABLE_COL_STATUS")]: GetCell(row?.status || "NA"),
            [t("ATM_PROJECT_NAME")]: "NA",
            [t("ATM_WIN_CODE")]: "NA",
            [t("ATM_ENGG_INCHARGE")]: "NA",
            [t("ATM_START_DATE")]: "NA",
            [t("REGISTER_STATUS")]: "NA",
        }));
    }, [data]);

    return (
        <React.Fragment> 
            {!isLoading && resultOk && (
                <div>
                <DetailsCard
                    {...{
                        handleSelect: (e) => {},
                        handleDetailCardClick: (state) => { 
                            history.push(`/${window.contextPath}/employee/attendencemgmt/view-project/`, { state }) },
                        data: propsMobileInboxCards,
                        serviceRequestIdKey: t("ATM_PROJECT_NAME"),
                        t,
                        showCitizenInfoLabel: true,
                        submitButtonLabel: t("ATM_ENROLL_WAGE_SEEKER")
                    }
                }
                />
                    {/* <CitizenInfoLabel
                        style={{ margin: " 2rem 8px", padding: "10px", backgroundColor: "#FFE2B5", borderRadius: "0.25rem" }}
                        textStyle={{ color: "#CC7B2F" }}
                        info={t("ATM_INFO_LABEL")}
                        text={t(`ATM_INFO_TEXT`)}
                        fill={"#CC7B2F"}
                    /> */}
                </div>
                   
            )}
            

            
        </React.Fragment>
    );
};

export default ViewProjects;