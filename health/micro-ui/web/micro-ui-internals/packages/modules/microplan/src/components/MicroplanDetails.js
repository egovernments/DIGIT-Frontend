import React, { Fragment, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardSubHeader,
  CardSectionHeader,
  StatusTable,
  Row,
  Loader,
  CardLabel,
  TextInput,
  LoaderWithGap,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { InfoCard, Modal, Toast, FieldV1,LabelFieldPair} from "@egovernments/digit-ui-components";
import { Card as CardNew, ViewCard } from "@egovernments/digit-ui-components";

const MicroplanDetails = ({ onSelect, props: customProps, ...props }) => {
  const { t } = useTranslation();
  const { state, dispatch } = useMyContext();
  const [microplan, setMicroplan] = useState(
    customProps?.sessionData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName
      ? customProps?.sessionData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName
      : Digit.Utils.microplanv1.generateCampaignString(customProps.sessionData, t)
  );
  const [executionCount, setExecutionCount] = useState(0);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  //const [isFreezed, setIsFreezed] = useState(campaignId && microplanId ? true : false);
  const campaignData = customProps?.sessionData?.CAMPAIGN_DETAILS?.campaignDetails;
  const campaignCard = [
    {
      label: t("HCM_CAMPAIGN_DISEASE"),
      value: campaignData?.disease ? campaignData?.disease?.code : t("ES_COMMON_NA"),
    },
    {
      label: t(`CAMPAIGN_TYPE`),
      value: campaignData?.campaignType
        ? t(Digit.Utils.locale.getTransformedLocale(`CAMPAIGN_TYPE_${campaignData?.campaignType?.code}`))
        : t("ES_COMMON_NA"),
    },
    {
      label: t(`HCM_CAMPAIGN_RESOURCE_DIST_STRAT`),
      value: campaignData?.distributionStrat
        ? t(Digit.Utils.locale.getTransformedLocale(`${campaignData?.distributionStrat?.resourceDistributionStrategyCode}`))
        : t("ES_COMMON_NA"),
    },
  ];

  const onChangeMicroplanName = (e) => {
    setMicroplan(e.target.value);
  };

  useEffect(() => {
    onSelect(customProps.name, {
      microplanName: microplan,
    });
  }, [microplan]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, {
        microplanName: microplan,
      });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() => {
    setMicroplan(
      customProps?.sessionData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName
        ? customProps?.sessionData?.MICROPLAN_DETAILS?.microplanDetails?.microplanName
        : Digit.Utils.microplanv1.generateCampaignString(customProps.sessionData, t)
    );
  }, [customProps?.sessionData]);

  return (
    <>
      <ViewCard
        className="microplan-deatils-view-card"
        header={""}
        layout={1}
        sections={[
          {
            cardType: "primary",
            fieldPairs: campaignCard.map((row) => ({
              inline: true,
              label: row?.label,
              value: row?.value,
            })),
            header: t("CAMPAIGN_DETAILS"),
            subHeader: "",
            type: "DATA",
          },
        ]}
        style={{}}
        type="primary"
      />
      <CardNew
        style={{
          marginTop: "1.5rem",
        }}
        className="microplan-name"
      >
        <CardSubHeader>{t("NAME_YOUR_MP")}</CardSubHeader>
        <p style={{ margin: "0rem" }}>{t("MP_FOOTER")}</p>
        <LabelFieldPair style={{ marginBottom: "0rem" }}>
          <CardLabel className={"microplan-details-label"} style={{ width: "20%" }}>
            {`${t("NAME_OF_MP")}  `} <span className="mandatory-span"> *</span>
          </CardLabel>
          <div style={{ width: "80%", maxWidth: "960px", height: "fit-content" }}>
            {/* <TextInput
              t={t} 
              style={{ width: "100%", margin: 0 }}
              type={"text"}
              isMandatory={false}
              name="name"
              value={microplan}
              onChange={onChangeMicroplanName}
              placeholder={t("MICROPLAN_NAME_INPUT_PLACEHOLDER")}
              disable={isFreezed}
            /> */}
            <FieldV1
              type="text"
              // error={error?.message ? t(error?.message) : ""}
              // style={{ width: "40rem", marginBottom: "0" }}
              populators={{ name: "microplanName" }}
              placeholder={t("MICROPLAN_NAME_INPUT_PLACEHOLDER")}
              value={microplan}
              onChange={onChangeMicroplanName}
             // disabled={isFreezed}
            />
          </div>
        </LabelFieldPair>
      </CardNew>

      <InfoCard
        label={t("MICROPLAN_NAMING_CONVENTION")}
        style={{ marginTop: "1.5rem", width: "100%", maxWidth: "unset" }}
        additionalElements={[
          <div className="microplan-naming-conventions">
            {state?.MicroplanNamingConvention?.[0]?.data?.map((item, index) => (
              <div key={`container-${item}`} className="microplan-naming-convention-instruction-list-container">
                <p key={`number-${index}`} className="microplan-naming-convention-instruction-list number">
                  {t(index + 1)}.
                </p>
                <p key={`text-${index}`} className="microplan-naming-convention-instruction-list text">
                  {t(item)}
                </p>
              </div>
            ))}
          </div>,
        ]}
      />
    </>
  );
};

export default MicroplanDetails;
