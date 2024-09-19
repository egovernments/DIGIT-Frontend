import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Button, CardText, Dropdown, ErrorMessage, PopUp, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";
const CampaignDetails = ({onSelect,props:customProps,...props}) => {
  const {campaignType:campaignTypeSession,disease:diseaseSession,distributionStrat:distributionStratSession} = customProps?.sessionData?.CAMPAIGN_DETAILS?.[customProps?.name] || {}
  const { dispatch,state } = useMyContext();
  const [executionCount, setExecutionCount] = useState(0);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const [campaignType, setCampaignType] = useState(campaignTypeSession);
  const [disease, setDisease] = useState(
    diseaseSession
      ? diseaseSession
      : {
          code: "MALARIA",
        }
  );
  const [distributionStrat, setDistributionStrat] = useState(distributionStratSession);
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-PROJECT-TYPES", [{ name: "projectTypes" }], {
    select: (data) => {
      let projectOptions = data?.["HCM-PROJECT-TYPES"]?.projectTypes;
      projectOptions = Digit.Utils.microplan.filterUniqueByKey(projectOptions, "code").map((row) => {
        return {
          ...row,
          i18nKey: Digit.Utils.locale.getTransformedLocale(`CAMPAIGN_TYPE_${row.code}`),
        };
      });
      return {
        campaignTypes: projectOptions,
        diseases: [
          {
            code: "MALARIA",
          },
        ],
        // distributionStrategies: data?.["HCM-PROJECT-TYPES"]?.projectTypes?.[0]?.distributionStrategy,
        distributionStrategies:state?.resourceDistributionStrategy
      };
    },
  },
  {schemaCode:"ProjectType"}
);
  

  useEffect(() => {
    onSelect(customProps.name,{
      distributionStrat,disease,campaignType
    })
  }, [distributionStrat,disease,campaignType]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, {
        distributionStrat,disease,campaignType
      });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  if(isLoading){
    return <Loader />
  }

  return (
    <React.Fragment>
        <Header>{t(`HCM_CAMPAIGN_DETAILS_HEADER`)}</Header>
        <p className="description-type">{t(`HCM_CAMPAIGN_DETAILS_DESC`)}</p>
        <LabelFieldPair>
          <div className="campaign-type" style={{ minWidth: "17rem" }}>
            <span>{`${t("HCM_DISEASE_TYPE")}`}</span>
            <span className="mandatory-span">*</span>
          </div>
          <Dropdown
            style={{ width: "40rem", paddingBottom: "1rem" }}
            // variant={error ? "error" : ""}
            t={t}
            option={data?.diseases}
            optionKey={"code"}
            selected={disease}
            select={(value) => {
              setDisease(value);
            }}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <div className="campaign-type" style={{ minWidth: "17rem" }}>
            <span>{`${t("HCM_CAMPAIGN_TYPE_OF")}`}</span>
            <span className="mandatory-span">*</span>
          </div>
          <Dropdown
            style={{ width: "40rem", paddingBottom: "1rem" }}
            // variant={error ? "error" : ""}
            t={t}
            option={data?.campaignTypes}
            optionKey={"i18nKey"}
            selected={campaignType}
            select={(value) => {
              setCampaignType(value);
            }}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <div className="campaign-type" style={{ minWidth: "17rem" }}>
            <span>{`${t("HCM_CAMPAIGN_RESOURCE_DIST_STRAT")}`}</span>
            <span className="mandatory-span">*</span>
          </div>
          <Dropdown
            style={{ width: "40rem", paddingBottom: "1rem" }}
            // variant={error ? "error" : ""}
            t={t}
            option={data?.distributionStrategies}
            optionKey={"code"}
            selected={distributionStrat}
            select={(value) => {
              setDistributionStrat(value);
            }}
          />
        </LabelFieldPair>
    </React.Fragment>
  );
}

export default CampaignDetails