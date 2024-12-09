import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { EditIcon, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Loader,Header } from "@egovernments/digit-ui-components";
const SummaryScreen = ({ props: customProps }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const campaignDetails = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails;
  const microplanDetails = customProps?.sessionData?.MICROPLAN_DETAILS?.microplanDetails;
  const assumptionsForm = customProps?.sessionData?.ASSUMPTIONS_FORM?.assumptionsForm;
  const hypothesisValues = customProps?.sessionData?.HYPOTHESIS?.Assumptions?.assumptionValues;
  if (!customProps?.sessionData) {
    return <Loader />;
  }
  const [setupCompleted, setSetupCompleted] = useState(false); // State to track setup completion
  const urlParams = Digit.Hooks.useQueryParams();
  
  useEffect(() => {
    // Assume `setup-completed` is a boolean value in your customProps
    const setupComp = urlParams["setup-completed"] ? urlParams["setup-completed"] : false;


    setSetupCompleted(setupComp);
  }, [urlParams]);
  const data = {
    cards: [
      {
        navigationKey: "card1",
        cardStyle:"view-campaign-details-card",
        sections: [
          {
            type: "DATA",
            cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "2rem" } },
            values: [
              {
                key: t("CAMPAIGN_TYPE"),
                value: t(Digit.Utils.locale.getTransformedLocale(`CAMPAIGN_TYPE_` + campaignDetails?.campaignType?.code)) || "NA",
              },
              {
                key: t("CMAPAIGN_DISEASE"),
                value: t(campaignDetails?.disease?.code) || t("NA"),
              },
              {
                key: t("RESOURCE_DISTRIBUTION_STRATEGY"),
                value: t(campaignDetails?.distributionStrat?.resourceDistributionStrategyCode) || t("NA"),
              },
            ],
            inlineStyles: {
              marginBottom: "0rem",
            },
          },
        ],
      },
      {
        navigationKey: "card1",
        cardStyle:"view-campaign-details-card",
        sections: [
          {
            type: "DATA",
            cardHeader: { value: t("Name of microplan"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
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
        noCardStyle: "true",
        sections: [
          {
            type: "COMPONENT",
            component: "AssumptionsList",
            props: {
              customProps: customProps,
              setupCompleted: setupCompleted

            },
          },
        ],
      },
      customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData
        ? {
          navigationKey: "card9",
          noCardStyle: "true",
          sections: [
            {
              type: "COMPONENT",
              component: "CampaignBoundary",
              noCardStyle: true,
              props: {
                customProps: customProps,
                setupCompleted: setupCompleted

              },
            },
          ],
        }
        : {},
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
                isMandatory: true,
              },
            ],
          },
        ],
      },
      {
        navigationKey: "card5",
        noCardStyle: "true",
        sections: [
          {
            type: "COMPONENT",
            component: "FormulaConfigScreen",
            props: {
              customProps,
              setupCompleted: setupCompleted

            },
          },
        ],
      },
      {
        navigationKey: "card7",
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "DataMgmtComponent",
            noCardStyle: true,
            props: {
              customProps: customProps,
              setupCompleted: setupCompleted

            },
          },
        ],
      },
      {
        navigationKey: "card6",
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            noCardStyle: true,
            component: "UserAccessMgmt",
            props: {
              customProps: customProps,
              setupCompleted: setupCompleted

            },
          },
        ],
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
        {
          name: "card5",
          active: true,
          code: "FormulaConfigScreen",
        },
        {
          name: "card6",
          active: true,
          code: "USER_ACCESS_MGMT",
        },
      ],
      activeByDefault: "card1",
    },
  };

  return (
  <>
  <Header>
    {t("SUMMARY_SCREEN")}
  </Header>
  <ViewComposer data={data} />
  </>
  );
};

export default SummaryScreen;
