import React, { Fragment, useState,useEffect } from "react";
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
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const MicroplanDetails = (
  {MicroplanName = "default",
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,...props}
) => {
  const { t } = useTranslation();
  const [microplan, setMicroplan] = useState(Digit.SessionStorage.get("microplanData")?.microplanDetails?.name);

  //fetch campaign data
  const { id = "" } = Digit.Hooks.useQueryParams();
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.microplan.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        id,
      },
    },
    {
      enabled: !!id,
      select: (data) => {
        const campaignCard = [
          {
            label: t("CAMPAIGN_NAME"),
            value: data?.campaignName ? data?.campaignName : t("ES_COMMON_NA"),
          },
          {
            label: t(`CAMPAIGN_TYPE`),
            value: data?.projectType ? t(`CAMPAIGN_TYPE_${data?.projectType}`) : t("ES_COMMON_NA"),
          },
          {
            label: t(`CAMPAIGN_BENEFICIARY_TYPE`),
            value: data?.additionalDetails?.beneficiaryType
              ? t(`CAMPAIGN_BENEFICIARY_TYPE${data?.additionalDetails?.beneficiaryType}`)
              : t("ES_COMMON_NA"),
          },
          {
            label: t("CAMPAIGN_DATE"),
            value: data.campaignDetails.startDate ? Digit.DateUtils.ConvertEpochToDate(data.campaignDetails.startDate) : t("ES_COMMON_NA"),
          },
        ];
        return campaignCard;
      },
    }
  );

  useEffect(() => {
    if ( checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    if(microplan!==""){
      setCheckDataCompletion("valid")
    }
    else setCheckDataCompletion("invalid");
  }, [checkDataCompletion]);

  const onChangeMicroplanName = (e) => {
    setMicroplan(e.target.value)
    setMicroplanData((previous) => ({ ...previous, microplanDetails: {
      name:e.target.value
    } }));
  }


  if (isCampaignLoading) {
    return <Loader />;
  }

  return (
    <>
      <Card
        style={{
          margin: "1rem",
          padding: "2rem 0 1rem 1.5rem",
        }}
      >
        <CardSectionHeader
          style={{
            margin: "0 0 1rem 0",
          }}
        >
          {t("CAMPAIGN_DETAILS")}
        </CardSectionHeader>

        <StatusTable>
          {campaignData?.length > 0 &&
            campaignData?.map((row, idx) => {
              return (
                <Row
                  key={idx}
                  label={row?.label}
                  text={row?.value}
                  rowContainerStyle={{ margin: "0", height: "3rem", justifyContent: "flex-start" }}
                  className="border-none"
                  last={idx === campaignData?.length - 1}
                />
              );
            })}
        </StatusTable>
      </Card>
      <Card
        style={{
          margin: "1rem",
          padding: "2rem 0 0 1.5rem",
        }}
      >
        <CardSubHeader>{t("NAME_YOUR_MP")}</CardSubHeader>
        <p>{t("MP_FOOTER")}</p>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "500", display: "flex", alignItems: "center" }}>
            {`${t("NAME_OF_MP")}  `} <p style={{ color: "red" }}> *</p>
          </CardLabel>
          <div style={{ width: "100%", maxWidth: "960px", marginTop: "1rem" }}>
            <TextInput
              t={t}
              style={{ width: "60%" }}
              type={"text"}
              isMandatory={false}
              name="name"
              value={microplan}
              onChange={onChangeMicroplanName}
              // {...(validation = {
              //   isRequired: true,
              //   pattern: "^[a-zA-Z-.`' ]*$",
              //   type: "tel",
              //   title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
              // })}
              disable={false}
            />
          </div>
        </LabelFieldPair>
      </Card>
    </>
  );
};

export default MicroplanDetails;
