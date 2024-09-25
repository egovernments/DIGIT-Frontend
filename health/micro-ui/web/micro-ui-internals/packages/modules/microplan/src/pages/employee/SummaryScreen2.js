import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, EditIcon, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { InfoBannerIcon, Toast } from "@egovernments/digit-ui-components";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";



const SummaryScreen2 = () => {



    const data = {
        cards: [
            {
                navigationKey: "card1",
                sections: 
                    
                        [
                            {
                                // navigationKey: "card1",
                                type: "COMPONENT",
                                component: "FormulaConfiguration",
                                props: {
                                },
                            },
                        ]
                       
                
            },
            {
                navigationKey: "card1",
                sections: 
                    
                        [
                            {
                                navigationKey: "card1",
                                type: "COMPONENT",
                                component: "DataMgmt",
                                props: {
                                },
                            },
                        ]
                       
                
            },
            {
                navigationKey: "card2",
                sections: 
                    
                         [
                            {
                                navigationKey: "card2",
                                type: "COMPONENT",
                                component: "DataMgmt",
                                props: {

                                },
                            },
                        ]
                        
                ,
            },
           
        ],
        horizontalNav: {
            showNav: true,
            configNavItems: [
             
                 
                    {
                      name: "card1",
                      active: true,
                      code: "HCM_TIMELINE",
                    },
                  
               
              {
                name: "card2",
                active: true,
                code: "HCM_CAMPAIGN_SETUP_DETAILS",
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


export default SummaryScreen2