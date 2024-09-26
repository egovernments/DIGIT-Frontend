import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { InfoBannerIcon, Toast } from "@egovernments/digit-ui-components";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";



const SummaryScreen3 = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { name } = useParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const [totalFormData, setTotalFormData] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});


    const data = {
        cards: [
            {
                navigationKey: "card1",
                sections: 
                    
                        [
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
                       
                
            },{
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
                                value: totalFormData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName || "NA"

                            },
                        ],
                        // values:data32(),


                    },

                ],
                       
                
            },
            
            
            {
                navigationKey: "card2",
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
            },
            {
                navigationKey: "card2",
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
            },{
                navigationKey: "card2",
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
            },{
                navigationKey: "card2",
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
            },{
                navigationKey: "card2",
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
            },{
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
                       
                
            }, ,{
                navigationKey: "card5",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "FormulaConfiguration",
                                props: {
                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card6",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "UserAccessManagement",
                                props: {
                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card7",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "FileComponent",
                                props: {
                                    title:"Population",
                                    fileName:"file.xlsx",
                                    editHandler:()=>{},
                                    deleteHandler:()=>{},

                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card7",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "FileComponent",
                                props: {
                                    title:"Facilities",
                                    fileName:"file.xlsx",
                                    editHandler:()=>{},
                                    deleteHandler:()=>{},

                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card7",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "DataMgmtTable",
                                props: {
                                    

                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card8",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "HeaderPlusThreeInput",

                                props: {
                                    
                                    title:"GENERAL_ESTIMATION",
                                    threeInputArr:[["Number of households per boundary","Population of the boundary","Divided by","Average people HJ/H"],
                                    [ "Number of bednets per boundary","Population of the boundary","Divided by","Average people HJ/H"],
                                    [ "Number of bales per boundary","Population of the boundary","Divided by","Average people HJ/H"]

                                ]
                                    
                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card8",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "HeaderPlusThreeInput",

                                props: {
                                    
                                    title:"HOUSEHOLD_REGISTRATION_INFORMATION",
                                    threeInputArr:[["Number of hosueholds registered","Population of the boundary","Divided by","Average people HJ/H"],
                                    [ "Number of houdeholds registered per boundary","Population of the boundary","Divided by","Average people HJ/H"],
                                    [ "Number of Supervisors per Boundary","Population of the boundary","Divided by","Average people HJ/H"]

                                ]
                                    
                                },
                            },
                        ]
                       
                
            },{
                navigationKey: "card8",
                sections: 
                    
                        [
                            {
                                
                                type: "COMPONENT",
                                component: "HeaderPlusThreeInput",

                                props: {
                                    
                                    title:"CAMPAIGN_COMMODITIES",
                                    threeInputArr:[["Number of sticker rolls per boundary","Population of the boundary","Divided by","Average people HJ/H"],  ]
                                    
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
                name: "card2",
                active: true,
                code: "MICROPLAN_ASSUMPTIONS",
              },
              {
                name: "card7",
                active: true,
                code: "DATA_MGMT",
              },
              
             ,{
                name: "card5",
                active: true,
                code: "FORMULA_CONFIGURATION",
              },
              {
                name: "card6",
                active: true,
                code: "USER_ACCESS_MGMT",
              },
              {
                name: "card8",
                active: true,
                code: "COMPTESTING",
              },
              
            ],
            activeByDefault: "card2",
          },

    }
    // console.log("data",data);
    return (
        <ViewComposer data={data} />
    )
}


export default SummaryScreen3