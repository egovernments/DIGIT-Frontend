import React from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposerV2 } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { updateSessionUtils } from "../../utils/updateSessionUtils";
const configs = {
  label: "SAVED_MICROPLANS",
  type: "search",
  apiDetails: {
    serviceName: "/plan-service/config/_search",
    requestParam: {},
    requestBody: {},
    minParametersForSearchForm: 0,
    masterName: "commonUiConfig",
    moduleName: "SearchMicroplan",
    tableFormJsonPath: "requestBody.PlanConfigurationSearchCriteria.pagination",
    searchFormJsonPath: "requestBody.PlanConfigurationSearchCriteria",
  },
  sections: {
    search: {
      uiConfig: {
        type: "search",
        typeMobile: "filter",
        headerLabel: "SAVED_MICROPLANS",
        headerStyle: null,
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 0,
        // "showFormInstruction": "TQM_SEARCH_HINT",
        defaultValues: {
          name: "",
          status: "",
        },
        fields: [
          {
            label: "MICROPLAN_NAME",
            type: "text",
            isMandatory: false,
            disable: false,
            populators: {
              name: "name",
              style: {
                marginBottom: "0px",
              },
            },
          },
          {
            label: "MICROPLAN_STATUS",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "status",
              optionsKey: "status",
              optionsCustomStyle: {
                top: "2.3rem",
              },
              mdmsConfig: {
                masterName: "MicroplanStatus",
                moduleName: "hcm-microplanning",
                localePrefix: "MICROPLAN_STATUS",
              },
            },
          },
        ],
      },
      label: "",
      children: {},
      show: true,
      // "labelMobile": "TQM_INBOX_SEARCH"
    },
    searchResult: {
      uiConfig: {
        columns: [
          {
            label: "MICROPLAN_NAME",
            jsonPath: "name",
          },
          {
            label: "MICROPLAN_STATUS",
            jsonPath: "status",
            prefix: "MICROPLAN_STATUS_COLUMN_",
            translate: true,
          },
          {
            label: "CAMPAIGNS_ASSIGNED",
            jsonPath: "CampaignDetails.campaignName",
          },
          {
            label: "CAMPAIGN_DATE",
            jsonPath: "CampaignDetails.campaignDetails.startDate",
            additionalCustomization: true,
          },
        ],
        showActionBarMobileCard: true,
        actionButtonLabelMobileCard: "TQM_VIEW_RESULTS",
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "PlanConfiguration",
        tableClassName: "table pqm-table",
        noColumnBorder: true,
        rowClassName: "table-row-mdms table-row-mdms-hover",
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
  persistFormData: true,
  showAsRemovableTagsInMobile: false,
  customHookName: "microplan.useSavedMicroplans",
};
const sampleObj = {
  "microplanDetails": {
      "name": "test"
  },
  "status": {
      "MICROPLAN_DETAILS": true,
      "UPLOAD_DATA": true,
      "HYPOTHESIS": true,
      "FORMULA_CONFIGURATION": true
  },
  "currentPage": {
      "id": 4,
      "name": "MAPPING",
      "component": "Mapping",
      "checkForCompleteness": false
  },
  "upload": {
      "Population": {
          "id": "Population",
          "fileName": "Population.xlsx",
          "section": "Population",
          "fileType": "Excel",
          "data": {
              "Angonia": [
                  [
                      "Country",
                      "Provincia",
                      "boundaryCode",
                      "targetPopulation",
                      "targetHouseholds",
                      "lat",
                      "long"
                  ],
                  [
                      "Mozambique",
                      null,
                      "MZ",
                      null,
                      341340332,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZT",
                      46412000,
                      42186187,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN",
                      46412000,
                      3739603,
                      3,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN001",
                      36375,
                      24354,
                      1,
                      30
                  ],
                  [
                      "Mozambique",
                      "EMILIA DAUSSE",
                      "MZTAN002",
                      16219,
                      14146,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "MATEUS S. MUTEMBA",
                      "MZTAN003",
                      52740,
                      14761,
                      30,
                      21
                  ],
                  [
                      "Mozambique",
                      "FRANCISCO MANYANGA",
                      "MZTAN004",
                      28371,
                      3291,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "JOSINA MACHEL",
                      "MZTAN005",
                      35055,
                      4471,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "CAMPIRU",
                      "MZTAN006",
                      145235,
                      46412000,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "MPEREQUEZA",
                      "MZTAN007",
                      22206,
                      20470,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "NATCHOLI",
                      "MZTAN008",
                      52928,
                      11843,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "NAMALINDI",
                      "MZTAN009",
                      39467,
                      3366,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "CHIPHOLE SEDE",
                      "MZTAN010",
                      88625,
                      5026,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "CHICUDO",
                      "MZTAN011",
                      34386,
                      23892,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "CHIPHOLE 1",
                      "MZTAN012",
                      19853,
                      12943,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "NSEQUE",
                      "MZTAN013",
                      29806,
                      22687,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "MPAMTA 1",
                      "MZTAN014",
                      33403,
                      11788,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "THINDI",
                      "MZTAN015",
                      45798,
                      2732,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "MPANTA 2",
                      "MZTAN016",
                      51131,
                      40199,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "RINZI",
                      "MZTAN017",
                      14764,
                      14591,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Nsendesa",
                      "MZTAN018",
                      34478,
                      2646,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Mulale1",
                      "MZTAN019",
                      19211,
                      16459,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Mulale2",
                      "MZTAN020",
                      75771,
                      42439,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN021",
                      34026,
                      18693,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN022",
                      20162,
                      1304,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN023",
                      34960,
                      34815,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN024",
                      14161,
                      11062,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN025",
                      19157,
                      1464,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN026",
                      13564,
                      3404,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN027",
                      29002,
                      25891,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN028",
                      33458,
                      20997,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN029",
                      86846,
                      48845,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN030",
                      88816,
                      79558,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN031",
                      28960,
                      16705,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN032",
                      27921,
                      3699,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN033",
                      84152,
                      21821,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN034",
                      50681,
                      39102,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN035",
                      54257,
                      6700,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN036",
                      15380,
                      5193,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN037",
                      123840,
                      17528,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN038",
                      111469,
                      63301,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN039",
                      4424,
                      3235,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN040",
                      11024,
                      6139,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN041",
                      53091,
                      19660,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN042",
                      7391,
                      3106,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN043",
                      11370,
                      8197,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN044",
                      85287,
                      17967,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN045",
                      55284,
                      24331,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN046",
                      310186,
                      76733,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN047",
                      172384,
                      13014,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN048",
                      756476,
                      452994,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN049",
                      284370,
                      5952,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN050",
                      292904,
                      140796,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN051",
                      49361,
                      10250,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN052",
                      94765,
                      53196,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN053",
                      50450,
                      36833,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN054",
                      45713,
                      30742,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN055",
                      111796,
                      93919,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN056",
                      70608,
                      42159,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN057",
                      20743,
                      5721,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN058",
                      49036,
                      9913,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN059",
                      25350,
                      6056,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN060",
                      72235,
                      52521,
                      30,
                      30
                  ],
                  [
                      "Mozambique",
                      "Tete",
                      "MZTAN061",
                      29313,
                      20855,
                      30,
                      30
                  ]
              ]
          },
          "file": {},
          "error": null,
          "resourceMapping": [
              {
                  "mappedFrom": "Boundary code",
                  "mappedTo": "boundaryCode"
              },
              {
                  "mappedFrom": "Target Population",
                  "mappedTo": "targetPopulation"
              },
              {
                  "mappedFrom": "Target Households",
                  "mappedTo": "targetHouseholds"
              },
              {
                  "mappedFrom": "Lat",
                  "mappedTo": "lat"
              },
              {
                  "mappedFrom": "Long",
                  "mappedTo": "long"
              },
              {
                  "mappedFrom": "Country",
                  "mappedTo": "Country"
              },
              {
                  "mappedFrom": "Provincia",
                  "mappedTo": "Provincia"
              }
          ]
      }
  },
  "hypothesis": [
      {
          "id": 0,
          "key": "NO_OF_PEOPLE_PER_HOUSEHOLD",
          "value": 100
      }
  ],
  "ruleEngine": [
      {
          "id": 1,
          "output": "NO_OF_BEDNET_REQUIRED",
          "input": "targetPopulation",
          "operator": "DEVIDED_BY",
          "assumptionValue": "NO_OF_PEOPLE_PER_HOUSEHOLD"
      }
  ]
}
const SavedMicroplans = () => {
  const history = useHistory()
  const { t } = useTranslation();

  const onClickRow = async (row) => {
    try {
      //here compute the sessionObject based on the row?.original data and then re-route
      const computedSession = await updateSessionUtils.computeSessionObject(row.original)
      debugger
      Digit.SessionStorage.set("microplanData", computedSession);
      history.push(`/${window.contextPath}/employee/microplanning/create-microplan?id=${row?.original?.id}`);
    } catch (error) {
        console.log("An error occured in SavedMicroplan onClickRow",error.message)
    }
  };

  const savedMircoplanSession = Digit.Hooks.useSessionStorage("SAVED_MICROPLAN_SESSION", {});

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(configs?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposerV2
          configs={configs}
          browserSession={savedMircoplanSession}
          additionalConfig={{
            resultsTable: {
              onClickRow,
            },
          }}
        ></InboxSearchComposerV2>
      </div>
    </React.Fragment>
  );
};

export default SavedMicroplans;
