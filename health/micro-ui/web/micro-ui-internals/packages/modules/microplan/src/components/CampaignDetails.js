import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Button, CardText, Dropdown, ErrorMessage, PopUp, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";
const CampaignDetails = ({onSelect,props}) => {
  const { dispatch,state } = useMyContext();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const [campaignType, setCampaignType] = useState(Digit.SessionStorage.get("microplanData")?.campaignDetails?.campaignType);
  const [disease, setDisease] = useState(
    Digit.SessionStorage.get("microplanData")?.campaignDetails?.disease
      ? Digit.SessionStorage.get("microplanData")?.campaignDetails?.disease
      : {
          code: "MALARIA",
        }
  );
  const [distributionStrat, setDistributionStrat] = useState(Digit.SessionStorage.get("microplanData")?.campaignDetails?.distributionStrat);
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-PROJECT-TYPES", [{ name: "projectTypes" }], {
    select: function (params) {
      debugger
    }
  },
  {schemaCode:"ProjectType"}
);

debugger
  useEffect(() => {
    onSelect(props.name,{
      distributionStrat,disease,campaignType
    })
  }, [distributionStrat,disease,campaignType]);

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