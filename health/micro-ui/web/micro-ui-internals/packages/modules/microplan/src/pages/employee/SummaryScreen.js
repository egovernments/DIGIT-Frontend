import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Header, Loader, ViewComposer } from "@egovernments/digit-ui-react-components";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SummaryScreen = () => {

  const { t } = useTranslation();
  const history = useHistory();
  const { name } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
 

  const reqCriteria = [
    {
    url: "/mdms-v2/v2/_search",
    params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
    body: {
      apiOperation: "SEARCH",
      MdmsCriteria: {
        tenantId,
        filters: {
          "name": name
        }
      },
    },
    config: {
      select: (data) => {
        const response = data?.mdms?.[0].data;
        return {
          cards: [
            {
              sections: [
                {
                  type: "DATA",
                  sectionHeader: { value: "", inlineStyles: { marginTop: "1rem", marginBottom: "1rem" } },
                  cardHeader: { value: "", inlineStyles: {} },
                  values: [
                    {
                      key: "Campaign disease",
                      value: "Malaria",
                    },
                    {
                      key: "Campaign type",
                      value: "ITIN",
                    },
                    {
                      key: "Resource distribution strategy",
                      value: "House-House",
                    },
                  ],
                },
              ]
            },
            {
              sections: [

                {
                  type: "DATA",
                  sectionHeader: { value: "Name of microplan", inlineStyles: { marginTop: "1rem", marginBottom: "1rem" } },
                  // cardHeader:{value:"Card 1",inlineStyles:{}},
                  values: [
                    {
                      key: "Name of microplan",
                      value: "Moz-Malaria-Bednet-Campaign-June2024",
                    },

                  ],
                },



              ],
            },
          ],
          apiResponse: {},
          additionalDetails: {}
        }
      },
    },
  },
  {
    url: "/project-factory/v1/project-type/search",
    params: {
      tenantId: tenantId,
      limit: 10,
      offset: 0,
    },
    body: {
      apiOperation: "SEARCH",
      MdmsCriteria: {
        tenantId,
        filters: {
          "name": name
        }
      },
    },
    config: {
      select: (data) => {
        const response = data?.mdms?.[0].data;
        return {
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
        }
      },
    },
  }
];

const [reqData,setReqData]=useState(reqCriteria?.[0]);


const [reqTab, setReqTab] = useState(
  reqCriteria?.map((Item, index) => ({ key: index,  active: index === 0 ? true : false }))
);


const { isLoading, data} = Digit.Hooks.useCustomAPIHook(reqData);

console.log(data)


  if (isLoading) {
    return <Loader />;
  }
 
  const onTabChange = (n) => {
    console.log("n",n);
    setReqTab((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false }))); //setting tab enable which is being clicked
    setReqData(reqCriteria?.[n]);// as per tab number filtering the config
    console.log("req",n,reqCriteria?.[n]);
    debugger;
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header className="summary-header">{t("ESTIMATE DETAILS")}</Header>
      </div>
      
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
    </>

  )
}

export default SummaryScreen