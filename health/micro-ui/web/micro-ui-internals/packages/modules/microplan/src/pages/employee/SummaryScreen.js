import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { InfoBannerIcon, Toast } from "@egovernments/digit-ui-components";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { noConflict } from "lodash";



const SummaryScreen = ({ props: customProps }) => {
    const { t } = useTranslation();
    const history = useHistory();

    // const [totalFormData, setTotalFormData] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});
    const campaignDetails = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails
    const microplanDetails = customProps?.sessionData?.MICROPLAN_DETAILS?.microplanDetails
    const assumptionsForm = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm
    const hypothesisValues = customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues






    const data = {
        cards: [
            {
                navigationKey: "card1",
                sections:
                    [
                        {
                            type: "DATA",
                            cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, marginBottom: "0.5rem", fontSize: "1.5rem" } },
                            cardSecondaryAction: (
                                <div className="campaign-preview-edit-container" onClick={() => { }}>
                                    <span>{t(`CAMPAIGN_EDIT`)}</span>
                                    <EditIcon />
                                </div>
                            ),
                            values: [
                                {
                                    key: t("CAMPAIGN_TYPE"),
                                    // value: totalFormData.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code || "NA",
                                    value: campaignDetails?.campaignType?.code || "NA",

                                },
                                {
                                    key: t("CMAPAIGN_DISEASE"),
                                    // value: totalFormData.CAMPAIGN_DETAILS?.campaignDetails?.disease?.code || "NA",
                                    value: campaignDetails?.disease?.code || "NA",

                                },
                                {
                                    key: t("RESOURCE_DISTRIBUTION_STRATEGY"),
                                    // value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
                                    // value: totalFormData.CAMPAIGN_DETAILS?.campaignDetails?.distributionStrat?.resourceDistributionStrategyCode || "NA",
                                    value: campaignDetails?.distributionStrat?.resourceDistributionStrategyCode || "NA",

                                },

                            ],
                            inlineStyles: {
                                marginBottom: "0rem",
                            },
                            // values: data31(),


                        },
                    ]
            },
            {
                navigationKey: "card1",
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
                                // value: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName || "NA",
                                value: microplanDetails?.microplanName || "NA",


                            },
                        ],
                        // values:data32(),


                    },

                ],


            },
            {
                navigationKey: "card2",
                sections:
                    [
                        {

                            type: "COMPONENT",
                            component: "AssumptionsList",
                            props: {
                                customProps: customProps
                            },
                        },
                    ]


            },

            {
                navigationKey: "card9",
                noCardStyle:"true",
                sections:

                    [
                        {

                            type: "COMPONENT",
                            component: "CampaignBoundary",
                            noCardStyle:true,
                            props: {
                                customProps: customProps

                            },
                        },
                    ]


            },



            {
                navigationKey: "card3",
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


            },
            // {
            //     navigationKey: "card5",
            //     sections: 

            //             [
            //                 {

            //                     type: "COMPONENT",
            //                     component: "FormulaConfiguration",
            //                     props: {
            //                     },
            //                 },
            //             ]


            // },
            // {
            //     navigationKey: "card6",
            //     sections: 

            //             [
            //                 {

            //                     type: "COMPONENT",
            //                     component: "UserAccessManagement",
            //                     props: {
            //                     },
            //                 },
            //             ]


            // },
            {
                navigationKey: "card7",
                sections:

                    [
                        {

                            type: "COMPONENT",
                            component: "FileComponent",
                            noCardStyle:true,
                            props: {
                                title: "Population",
                                fileName: "file.xlsx",
                                editHandler: () => { },
                                deleteHandler: () => { },

                            },
                        },
                    ]


            }, {
                navigationKey: "card7",
                sections:

                    [
                        {

                            type: "COMPONENT",
                            noCardStyle:true,
                            component: "FileComponent",
                            props: {
                                title: "Facilities",
                                fileName: "file.xlsx",
                                editHandler: () => { },
                                deleteHandler: () => { },

                            },
                        },
                    ]


            }, {
                navigationKey: "card7",
                sections:

                    [
                        {

                            type: "COMPONENT",
                            noCardStyle:true,
                            component: "DataMgmtTable",
                            props: {


                            },
                        },
                    ]


            },
            // type: "COMPONENT",
            //                     component: "FormulaSection",

            //                     props: {

            //                         title:"GENERAL_ESTIMATION",
            //                         threeInputArr:[["Number of households per boundary","Population of the boundary","Divided by","Average people HJ/H"],
            //                         [ "Number of bednets per boundary","Population of the boundary","Divided by","Average people HJ/H"],
            //                         [ "Number of bales per boundary","Population of the boundary","Divided by","Average people HJ/H"]

            //                     ]

            //                     },
            {
                navigationKey: "card8",
                noCardStyle:true,
                sections:

                    [
                        {

                            type: "COMPONENT",
                            noCardStyle:true,
                            component: "FormulaConfigScreen",

                            props: {

                                customProps: customProps



                            },
                        },
                    ]


            },

        ],
        horizontalNav: {
            showNav: true,
            configNavItems: [


                {
                    name: "card1",
                    active: true,
                    code: "MICROPLAN_DETAILS",
                },
                {
                    name: "card9",
                    active: true,
                    code: "CAMPAIGN_BOUNDARY",
                },
                {
                    name: "card7",
                    active: true,
                    code: "DATA_MGMT",
                },


                {
                    name: "card2",
                    active: true,
                    code: "MICROPLAN_ASSUMPTIONS",
                },


                //  ,{
                //     name: "card5",
                //     active: true,
                //     code: "FORMULA_CONFIGURATION",
                //   },
                //   {
                //     name: "card6",
                //     active: true,
                //     code: "USER_ACCESS_MGMT",
                //   },
                {
                    name: "card8",
                    active: true,
                    code: "FORMULA_CONFIGURATION",
                },

            ],
            activeByDefault: "card8",
        },

    }

    return (
        <ViewComposer data={data} />
    )
}


export default SummaryScreen