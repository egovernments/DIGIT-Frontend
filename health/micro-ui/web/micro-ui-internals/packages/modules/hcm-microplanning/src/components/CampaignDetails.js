import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast, Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { Button, CardText, Dropdown, ErrorMessage, PopUp, MultiSelectDropdown } from "@egovernments/digit-ui-components";

const CampaignDetails = ({
  MicroplanName = "default",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
  setToast,
  ...props
}) => {
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
        distributionStrategies: data?.["HCM-PROJECT-TYPES"]?.projectTypes?.[0]?.distributionStrategy,
      };
    },
  });

  const validateCampaignData = () => {
    return campaignType && disease && distributionStrat;
    return (
      Array.isArray(campaignType) &&
      campaignType.length > 0 &&
      Array.isArray(disease) &&
      disease.length > 0 &&
      Array.isArray(distributionStrat) &&
      distributionStrat.length > 0
    );
  };

  useEffect(() => {
    if (checkDataCompletion !== "true" || !setCheckDataCompletion) return;

    updateData(true);
  }, [checkDataCompletion]);

  useEffect(() => {
    setMicroplanData((previous) => ({
      ...previous,
      campaignDetails: {
        campaignType,
        disease,
        distributionStrat,
      },
    }));
  }, [campaignType, disease, distributionStrat]);

  const updateData = useCallback(
    (check) => {
      if (checkDataCompletion !== "true" || !setCheckDataCompletion) return;
      // here check if either of the fields are not present
      if (!campaignType || !disease || !distributionStrat) {
        setCheckDataCompletion("false");
        return setToast({ state: "error", message: t("MICROPLAN_PLEASE_FILL_ALL_THE_FIELDS_AND_RESOLVE_ALL_THE_ERRORS") });
      }
      if (check) {
        // setMicroplanData((previous) => ({
        //   ...previous,
        //   campaignDetails: {
        //     campaignType,
        //     disease,
        //     distributionStrat,
        //   },
        // }));
        if (campaignType && disease && distributionStrat) {
          setCheckDataCompletion("valid");
        } else {
          setCheckDataCompletion("invalid");
        }
      }
    },
    [checkDataCompletion, disease, campaignType, distributionStrat, microplanData, setCheckDataCompletion, setMicroplanData]
  );

  // useEffect(() => {
  //   debugger;
  //   // if either of these states are not there then data is incomplete
  //   if (!campaignType || !disease || !distributionStrat) {
  //     props.setCheckDataCompletion("false");
  //   }

  //   if (validateCampaignData()) {
  //     props.setCheckDataCompletion("valid");
  //   } else {
  //     props.setCheckDataCompletion("invalid");
  //   }
  // }, [campaignType, disease, distributionStrat]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Card className={"employeeCard setup-campaign-card"}>
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
      </Card>
    </React.Fragment>
  );
};

export default CampaignDetails;
