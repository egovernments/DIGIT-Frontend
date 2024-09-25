import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { EditIcon } from "@egovernments/digit-ui-react-components";


const SummaryScreen = () => {

    const { t } = useTranslation();
    const history = useHistory();
    const { name } = useParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const [totalFormData, setTotalFormData] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});

    // const data31 = () => {
    //     let values = [];
    //     console.log("totalformdata", totalFormData);
    //     let campaignDetails = totalFormData.CAMPAIGN_DETAILS.campaignDetails;
    //     console.log("campaignDetails", campaignDetails);

    //     const dic = { "campaignType": "Campaign Type", "disease": "Campaign disease", "distributionStrat": "Resource distribution strategy" }
    //     for (let k in campaignDetails) {
    //         if (String(k) != "distributionStrat") {
    //             values.push({
    //                 key: dic[String(k)],
    //                 value: String(campaignDetails[k].code) || "NA"
    //             })
    //         }else{
    //             values.push({
    //                 key: dic[String(k)],
    //                 value: String(campaignDetails[k].
    //                     resourceDistributionStrategyName
    //                     ) || "NA"
    //             })

    //         }
    //     }


    //     return values


    // }

    // const data32 = () => {
    //     let values = [];
    //     // console.log("totalformdata", totalFormData);
    //     let microplanDetails = totalFormData.
    //     MICROPLAN_DETAILS
    //     .microplanDetails;
    //     console.log("mpDetails",microplanDetails);

    //     const dic = { "microplanName": "Name of microplan"}
    //     for (let k in microplanDetails) {

    //             values.push({
    //                 key: dic[String(k)],
    //                 value: String(microplanDetails[k]

    //                     ) || "NA"
    //             })


    //     }
    //     return values
    // }

    // const assumptions=[
    //     { "category": "GENERAL_ESTIMATION", "key": "key1", "value": 0 },
    //     { "category": "GENERAL_ESTIMATION", "key": "key2", "value": 0 },
    //     { "category": "GENERAL_ESTIMATION", "key": "key3", "value": 0 },
    //     { "category": "HOUSEHOLD_REGISTRATION_INFORMATION", "key": "key1", "value": 0 },
    //     { "category": "HOUSEHOLD_REGISTRATION_INFORMATION", "key": "key2", "value": 0 },
    //     { "category": "HOUSEHOLD_REGISTRATION_INFORMATION", "key": "key3", "value": 0 },
    //     { "category": "HOUSEHOLD_REGISTRATION_INFORMATION", "key": "key4", "value": 0 },
    //     { "category": "HOUSEHOLD_REGISTRATION_INFORMATION", "key": "key5", "value": 0 },
    //     { "category": "CAMPAIGN_COMMODITIES", "key": "key1", "value": 0 },
    //     { "category": "CAMPAIGN_VEHICLES", "key": "key1", "value": 0 },
    //     { "category": "CAMPAIGN_VEHICLES", "key": "key2", "value": 0 }
    //   ]


    const reqCriteria = [
        
        
        
        {
            title: t("MICROPLAN_DETAILS3"),

            cards: [
                {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: t("CAMPAIGN_TYPE"),
                                    value: totalFormData.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code || "NA",

                                },
                                {
                                    key: t("CMAPAIGN_DISEASE"),
                                    value: totalFormData.CAMPAIGN_DETAILS?.campaignDetails?.disease?.code || "NA",
                                },
                                {
                                    key: t("RESOURCE_DISTRIBUTION_STRATEGY"),
                                    // value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
                                    value: totalFormData.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode || "NA"
                                },
                            ],
                            // values: data31(),


                        },

                    ]
                }, {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("Name of microplan"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: t("NAME_OF_MICROPLAN"),
                                    value: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName || "NA"

                                },
                            ],
                            // values:data32(),


                        },

                    ],
                },
            ]
        },
        {
            title: t("MICROPLAN_DETAILS4"),

            cards: [
                {   navigationKey:"card4",
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: "Campaign Registration Process",
                                    value: "House to House",
                                },
                                {
                                    key: "Campaign Distribution Process",
                                    value: "House to House",
                                },
                                {
                                    key: "Registration & Distribution",
                                    // value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
                                    value: "Together"
                                },
                            ],
                        },

                    ]
                }, {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("General Estimation"), inlineStyles: { marginTop: 0, fontSize: "1.5rem", color: " #0B4B66" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: "Average people in a household",
                                    value: "4",
                                },
                                {
                                    key: "Number of bednets per bale",
                                    value: "50"
                                },
                                {
                                    key: "Number of people per bednet ",
                                    value: "50"
                                },
                            ],
                        },

                    ]
                }, {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("Household Registration information"), inlineStyles: { marginTop: 0, fontSize: "1.5rem", color: " #0B4B66" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: "No of days for household registration",
                                    value: "4",
                                },
                                {
                                    key: "Number of beneficiaries to be registered by a registration team per day",
                                    value: "50"
                                },
                                {
                                    key: "Number of members per household registration team ",
                                    value: "4"
                                },
                                {
                                    key: "Number of registration teams per monitor",
                                    value: "4"
                                },
                                {
                                    key: "Number of monitors per supervisor for household registration",
                                    value: "4"
                                },
                            ],
                        },

                    ],
                }, {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("Campaign commodities"), inlineStyles: { marginTop: 0, fontSize: "1.5rem", color: " #0B4B66" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: "Number of households per sticker roll",
                                    value: "20",
                                },

                            ],
                        },

                    ]
                },
                {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("Campaign vehicles"), inlineStyles: { marginTop: 0, fontSize: "1.5rem", color: " #0B4B66" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: "Capacity of vehicle 1(bales)",
                                    value: "20",
                                },
                                {
                                    key: "Capacity of vehicle 2(bales)",
                                    value: "20",
                                },


                            ],
                        },

                    ]
                }
            ]
        },
        {
            title: t("MICROPLAN_DETAILS5"),

            cards: [

                {
                    sections: [
                        {
                            type: "DATA",
                            cardHeader: { value: t("DATA_VALIDATION_RULE"), inlineStyles: { marginTop: 0, fontSize: "1.5rem", color: " #0B4B66" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: "Maximum population of a village",
                                    value: "74784784",
                                },
                                {
                                    key: "Maximum population of a village",
                                    value: "74784784",
                                },
                                {
                                    key: "Acceptable change of percentage with respect to the uploaded populatin data",
                                    value: "10%",
                                    isMandatory: true
                                },


                            ],
                        },

                    ]
                }
            ]
        },
        {
            title: t("MICROPLAN_DETAILS6"),

            cards: [
                {
                    sections: [
                        {
                            cardHeader: { value: "", inlineStyles: {} },

                            type: "COMPONENT",
                            component: "DataMgmt",
                            props: {
                            },
                        },
                    ]
                }
            ]
        },
        {
            title: t("MICROPLAN_DETAILS7"),

            cards: [
                {   navigationKey:"card5",
                    sections: [
                        {
                            cardHeader: { value: "", inlineStyles: {} },

                            type: "COMPONENT",
                            component: "FormulaConfiguration",
                            props: {
                            },
                        },
                    ]
                }
            ]
        },
        {
            title: t("MICROPLAN_DETAILS8"),

            cards: [
                {
                    sections: [
                        {
                            cardHeader: { value: "", inlineStyles: {} },

                            type: "COMPONENT",
                            component: "UserAccessManagement",
                            props: {
                                title:"hullo"
                            },
                        },
                    ]
                }
            ]
        },
        

    ];

    const [reqData, setReqData] = useState(reqCriteria?.[0]);


    const [reqTab, setReqTab] = useState(
        reqCriteria?.map((Item, index) => ({ key: index, active: index === 0 ? true : false, label: Item?.title }))
    );
    console.log("reqTAb", reqTab);

    // const { isLoading, data} = Digit.Hooks.useCustomAPIHook(reqData);

    // console.log(data)


    // if (isLoading) {
    //   return <Loader />;
    // }

    const onTabChange = (n) => {
        console.log("n", n);
        setReqTab((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false }))); //setting tab enable which is being clicked
        setReqData(reqCriteria?.[n]);// as per tab number filtering the config
        // console.log("req", n, reqData);
        // debugger;
    };
    return (
        <>
            <div className="search-tabs-container">
                <div>
                    {reqTab?.map((i, num) => (
                        <button
                            className={i?.active === true ? "search-tab-head-selected" : "search-tab-head"}
                            onClick={() => {
                                // clearSearch({});
                                onTabChange(num);
                            }}>
                            {t(i?.label)}
                        </button>
                    ))}
                </div>
            </div>

            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("CAMPAIGN DETAILS")}</Header>
      </div> */}

            <div className="campaign-summary-container">
                <ViewComposer
                    noCardStyle={true}
                    data={reqData} />
            </div>
        </>

    )
}

export default SummaryScreen