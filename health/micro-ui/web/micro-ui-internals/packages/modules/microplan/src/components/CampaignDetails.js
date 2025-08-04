import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Button, CardText, Dropdown, ErrorMessage, PopUp, MultiSelectDropdown, LabelFieldPair } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context";
import { Card as CardNew } from "@egovernments/digit-ui-components";

let globalRenderCount = 0;
const CampaignDetails = React.memo(({ onSelect, props: customProps, ...props }) => {
  const { campaignType: campaignTypeSession, disease: diseaseSession, distributionStrat: distributionStratSession } =
    customProps?.sessionData?.CAMPAIGN_DETAILS?.[customProps?.name] || {};
  const { dispatch, state } = useMyContext();
  const [executionCount, setExecutionCount] = useState(0);
  const { t } = useTranslation();
  const tenantId = useMemo(() => Digit.ULBService.getStateId(), []);
  let hasVisitedOnce = false;
  const [initialLoading, setInitialLoading] = useState(!hasVisitedOnce);
  const [campaignType, setCampaignType] = useState(campaignTypeSession);
  const [disease, setDisease] = useState(
    diseaseSession
      ? diseaseSession
      : {
        code: "MALARIA",
      }
  );
  const [distributionStrat, setDistributionStrat] = useState(distributionStratSession);

  useEffect(() => {
    globalRenderCount += 1;
    if (globalRenderCount == 1 && !(campaignTypeSession === undefined)) {
      setInitialLoading(false);
      setTimeout(() => {
        globalRenderCount = 0;
      }, 1000);
    }
    if (globalRenderCount > 2 && !hasVisitedOnce) {
      setInitialLoading(false);
      setTimeout(() => {
        globalRenderCount = 0;
        hasVisitedOnce = true;
      }, 1000);
    }
  }, []);
  useEffect(() => {
    setCampaignType(campaignTypeSession);
    setDisease(diseaseSession ? diseaseSession : { code: "MALARIA" });
    setDistributionStrat(distributionStratSession);
  }, [campaignTypeSession, diseaseSession, distributionStratSession]);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const [isFreezed, setIsFreezed] = useState(campaignId && microplanId ? true : false);
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      select: (data) => {
        let projectOptions = data?.["HCM-PROJECT-TYPES"]?.projectTypes;
        projectOptions = Digit.Utils.microplanv1.filterUniqueByKey(projectOptions, "code").map((row) => {
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
          distributionStrategies: state?.ResourceDistributionStrategy,
        };
      },
    },
    { schemaCode: "ProjectType" }
  );

  const campaignTypeOptions = useMemo(() => {
    return state?.MicroplanCampaignTypes?.map((item) => item.code) || [];
  }, [state?.MicroplanCampaignTypes]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, {
        distributionStrat,
        disease,
        campaignType,
      });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  const handleSelect = useCallback(() => {
    onSelect(customProps.name, {
      distributionStrat,
      disease,
      campaignType,
    });
  }, [onSelect, customProps.name, distributionStrat, disease, campaignType]);

  useEffect(() => {
    handleSelect();
  }, [handleSelect]);

  const filteredCampaignTypes = useMemo(() => {
    return data?.campaignTypes?.filter((campaign) =>
      campaignTypeOptions?.includes(campaign.code)
    );
  }, [data?.campaignTypes, campaignTypeOptions]);

  if (initialLoading || isLoading) {
    return <Loader />;
  }

  return (
    <CardNew style={{ gap: "1.5rem" }}>
      <Header styles={{ marginBottom: "0rem" }}>{t(`HCM_CAMPAIGN_DETAILS_HEADER`)}</Header>
      <p className="campaign-details-description">{t(`HCM_CAMPAIGN_DETAILS_DESC`)}</p>
      <LabelFieldPair style={{ marginBottom: "0rem" }}>
        <div className="campaign-type-label-pair" style={{ minWidth: "20%" }}>
          <span className="campaign-type-label">{`${t("HCM_DISEASE_TYPE")}`}</span>
          <span className="mandatory-span">*</span>
        </div>
        <Dropdown
          style={{ width: "40rem" }}
          // variant={error ? "error" : ""}
          t={t}
          option={data?.diseases}
          optionKey={"code"}
          selected={disease}
          select={(value) => {
            setDisease(value);
          }}
          disabled={isFreezed}
        />
      </LabelFieldPair>
      <LabelFieldPair style={{ marginBottom: "0rem" }}>
        <div className="campaign-type-label-pair" style={{ minWidth: "20%" }}>
          <span className="campaign-type-label">{`${t("HCM_CAMPAIGN_TYPE_OF")}`}</span>
          <span className="mandatory-span">*</span>
        </div>
        <Dropdown
          style={{ width: "40rem" }}
          // variant={error ? "error" : ""}
          t={t}
          option={filteredCampaignTypes}
          optionKey={"i18nKey"}
          selected={campaignType}
          select={(value) => {
            setCampaignType(value);
          }}
          disabled={isFreezed}
        />
      </LabelFieldPair>
      <LabelFieldPair style={{ marginBottom: "0rem" }}>
        <div className="campaign-type-label-pair" style={{ minWidth: "20%" }}>
          <span className="campaign-type-label">{`${t("HCM_CAMPAIGN_RESOURCE_DIST_STRAT")}`}</span>
          <span className="mandatory-span">*</span>
        </div>
        <Dropdown
          style={{ width: "40rem" }}
          // variant={error ? "error" : ""}
          t={t}
          option={data?.distributionStrategies}
          optionKey={"resourceDistributionStrategyCode"}
          selected={distributionStrat}
          select={(value) => {
            setDistributionStrat(value);
          }}
          disabled={isFreezed}
        />
      </LabelFieldPair>
    </CardNew>
  );
});

export default CampaignDetails;
