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

  const [totalFormData,setTotalFormData] = Digit.Hooks.useSessionStorage("MICROPLAN_DATA", {});

 const data3=()=>{
  let values=[];
  let campaignDetails=totalFormData.CAMPAIGN_DETAILS.campaignDetails;
  for(let k in campaignDetails){
    values.push({
      key:String(k),
      value:String(campaignDetails[k].code)
    })
  }
  return values

  
 }
  
  const reqCriteria = [
    {
      title: t("MICROPLAN_DETAILS"),
      cards: [
        {
          sections: [
            {
              type: "DATA",
              sectionHeader: { value: "", inlineStyles: { marginTop: "1rem", marginBottom: "1rem" } },
              cardHeader: { value: "", inlineStyles: {} },
              values: [
                {
                  key: "Campaign disease0",
                  value: "Malaria1",
                },
                {
                  key: "Campaign type0",
                  value: "ITIN0",
                },
                {
                  key: "Resource distribution strategy0",
                  value: "House-House0",
                },
              ],
            },
          ]
        },
        {
          sections: [

            {
              type: "DATA",
              sectionHeader: { value: "Name of microplan0", inlineStyles: { marginTop: "1rem", marginBottom: "1rem" } },
              // cardHeader:{value:"Card 1",inlineStyles:{}},
              values: [
                {
                  key: "Name of microplan0",
                  value: "Moz-Malaria-Bednet-Campaign-June20241",
                },

              ],
            },



          ],
        },

      ],
      apiResponse: {},
      additionalDetails: {}


    },
    {

      title: t("MICROPLAN_DETAILS1"),

      cards: [
        {
          sections: [
            {
              type: "DATA",
              sectionHeader: { value: "", inlineStyles: { marginTop: "1rem", marginBottom: "1rem" } },
              cardHeader: { value: "", inlineStyles: {} },
              values: [
                {
                  key: "Campaign disease1",
                  value: "Malaria1",
                },
                {
                  key: "Campaign type1",
                  value: "ITIN1",
                },
                {
                  key: "Resource distribution strategy1",
                  value: "House-House1",
                },
              ],
            },
          ]
        },
        {
          sections: [

            {
              type: "DATA",
              sectionHeader: { value: "Name of microplan1", inlineStyles: { marginTop: "1rem", marginBottom: "1rem" } },
              // cardHeader:{value:"Card 1",inlineStyles:{}},
              values: [
                {
                  key: "Name of microplan1",
                  value: "Moz-Malaria-Bednet-Campaign-June20241",
                },

              ],
            },



          ],
        },
      ],
      apiResponse: {},
      additionalDetails: {}


    },
    {
      title: t("MICROPLAN_DETAILS2"),

      cards: [
        {
          sections: [
            {
              cardHeader: { value: "Campaign_details", inlineStyles: {} },

              type: "COMPONENT",
              component: "SummaryMicroplanDetails",
              props: {
              },
            },
          ]
        }
      ]
    },
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
              // values: [
              //   {
              //     key: "Campaign Disease",
              //     value: "malaria",
              //   },
              //   {
              //     key: "Campaign Type",
              //     value: "ITIN",
              //   },
              //   {
              //     key: "Resource distribution strategy",
              //     // value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
              //     value: "House-House"
              //   },
              values: data3(),

              // ],
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
                  key: "Name of microplan",
                  value: "Moz-Malaria--Bednet-Campaign",
                },

              ],
            },

          ],
        },
      ]
    },
    {
      title: t("MICROPLAN_DETAILS4"),

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

          ]},{
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
                  isMandatory:true
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
              cardHeader: { value: "Campaign_details", inlineStyles: {} },

              type: "COMPONENT",
              component: "DataMgmt",
              props: {
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
        <ViewComposer data={reqData} />
      </div>
    </>

  )
}

export default SummaryScreen