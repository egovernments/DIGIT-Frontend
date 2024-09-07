

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import {  Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";



const SorView = ()=>{
  
    const {t} = useTranslation()
    const history = useHistory()
    
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const reqCriteria= {
          url: "/mdms-v2/v2/_search",
          params: {
            tenantId:tenantId,
            limit:10,
            offset: 0,
          },
          body:{
            apiOperation:"SEARCH",
            MdmsCriteria:{
                tenantId,
                
            }
          },
          config:{
            select:(data)=>{
               const response = data?.mdms?.[0].data
               return {
                cards:[
                    {   
                        name:"basicInformation",
                        sections:[
                            {
                               type:"DATA",
                               name:"basicInformation",
                               cardHeader:{ value:t("Basic Information"), inlineStyles: {marginTop:0, fontSize:"1.5rem"}},
                               values:[
                                {
                                   key:"Name",
                                   value:response?.name?  response?.name : t("NA")
                                },
                                {
                                    key:"Description",
                                    value:response?.description?  response?.description : t("NA")
                                },
                                {
                                    key:"Executing Department",
                                    value:response?.executingDepartment?  response?.executingDepartment : t("NA")
                                },
                                {
                                    key:"Workflow Status",
                                    value:response?.wfStatus?  response?.wfStatus : t("NA")
                                },
                                {
                                    key:"Proposal Date",
                                    value:response?.proposalDate?  response?.proposalDate : t("NA")
                                },
                                {
                                    key:"Status",
                                    value:response?.status?  response?.status : t("NA")
                                }
                               ],

                            },
                        ],
                    },
                    {
                        name:"address",
                        sections:[
                            {
                                type:"DATA",
                                name:"address",
                                cardHeader:{ value:t("Address Details"), inlineStyles: {marginTop:0, fontSize:"1.5rem"}},
                                values:[

                                    {
                                        key:"Latitide",
                                        value:response?.address?.latitude? response?.address?.latitude : t("NA")
                                    },
                                    {
                                        key:"Longitude",
                                        value:response?.address?.longitude?  response?.address?.longitude : t("NA")
                                    },
                                    {
                                        key:"City",
                                        value:response?.address?.city? response?.address?.city : t("NA")
                                    },
                                 ],
                            },
                        ],
                    },

                    {
                        name:"estimateDetails",
                        sections:[
                            {
                                type:"DATA",
                                name:"estimateDetails",
                                cardHeader: {value:t("Estimate Details"), inlineStyles: {marginTop:0, fontSize:"1.5rem"}},
                                values:[
                                    {
                                        key:"Name",
                                        value:response?.estimateDetails?.[0]?.name?  response?.estimateDetails?.[0]?.name : t("NA")
                                    },
                                    {
                                        Key:"Description",
                                        value:response?.estimateDetails?.[0]?.description?  response?.estimateDetails?.[0]?.description : t("NA")
                                    },
                                    {
                                        Key:"Amount Details",
                                        value:response?.estimateDetails?.[0]?.amountDetail?.[0]?.amount ? response?.estimateDetails?.[0]?.amountDetail?.[0]?.amount : t("NA")
                                    }
                                ]
                            },
                        ],
                    }
                ]
              }
            }
        }
    }



    const {isLoading, data} = Digit.Hooks.useCustomAPIHook(reqCriteria);
  
    if (isLoading) {
        return <Loader />;
      }
            

      return (
        <>
         <div style={{display:"flex", justifyContent:"space-between"}}>
            <Header className="summary-header">{t("ESTIMATE_DETAILS")}</Header>
         </div>
         <div className="campaign-summary-container">
            <ViewComposer data={data}  />
         </div>
        
        </>
      )      
}


  
export default SorView