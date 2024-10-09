import React, { Fragment, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardSubHeader,
  CardSectionHeader,
  StatusTable,
  Row,
  Loader,
  LabelFieldPair,
  CardLabel,
  TextInput,
  LoaderWithGap,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../utils/context";
import { InfoCard, Modal, Toast, FieldV1 } from "@egovernments/digit-ui-components";

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
  const [isFreezed, setIsFreezed] = useState(campaignId && microplanId ? true : false);
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

  return (
    <>
      <Card
        style={{
          margin: "1rem 0 1rem 0",
          padding: "1.5rem 1.5rem 2.5rem 1.5rem",
        }}
        className="microplan-campaign-detials"
      >
        <CardSubHeader style={{ marginBottom: "0.5rem" }}>{t("CAMPAIGN_DETAILS")}</CardSubHeader>

        <StatusTable style={{ paddingLeft: "0" }}>
          {campaignCard?.length > 0 &&
            campaignCard?.map((row, idx) => {
              return (
                <Row
                  key={idx}
                  label={row?.label}
                  text={row?.value}
                  rowContainerStyle={{ margin: "0", padding: "0", height: "2.4rem", justifyContent: "flex-start" }}
                  className="border-none"
                  last={idx === campaignCard?.length - 1}
                />
              );
            })}
        </StatusTable>
      </Card>

      <Card
        style={{
          margin: "1.5rem 0 1rem 0",
          padding: "1.5rem 1.5rem 1.5rem 1.5rem",
        }}
        className="microplan-name"
      >
        <CardSubHeader style={{ marginBottom: "1.5rem" }}>{t("NAME_YOUR_MP")}</CardSubHeader>
        <p style={{ marginBottom: "1.5rem" }}>{t("MP_FOOTER")}</p>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "500", display: "flex", alignItems: "center", margin: 0 }}>
            {`${t("NAME_OF_MP")}  `} <p style={{ color: "red", margin: 0, paddingLeft: "0.15rem" }}> *</p>
          </CardLabel>
          <div style={{ width: "100%", maxWidth: "960px", height: "fit-content" }}>
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
              disabled={isFreezed}
            />
          </div>
        </LabelFieldPair>
      </Card>

      <InfoCard
        label={t("MICROPLAN_NAMING_CONVENTION")}
        style={{ margin: "1.5rem 1rem 0 0", width: "100%", maxWidth: "unset" }}
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
