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
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { tourSteps } from "../configs/tourSteps";
import { useMyContext } from "../utils/context";
import { Modal } from "@egovernments/digit-ui-components";
import { CloseButton, ModalHeading } from "./CommonComponents";

const page = "microplanDetails";

const MicroplanDetails = ({
  MicroplanName = "default",
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
  ...props
}) => {
  const { t } = useTranslation();
  const [microplan, setMicroplan] = useState(Digit.SessionStorage.get("microplanData")?.microplanDetails?.name);
  const { state, dispatch } = useMyContext();
  const [modal, setModal] = useState("none");

  //fetch campaign data
  const { id = "" } = Digit.Hooks.useQueryParams();
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.microplan.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        ids: [id],
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
            value: data.startDate ? Digit.DateUtils.ConvertEpochToDate(data.startDate) : t("ES_COMMON_NA"),
          },
        ];
        return campaignCard;
      },
    }
  );

  // Set TourSteps
  useEffect(() => {
    const tourData = tourSteps(t)?.[page] || {};
    if (state?.tourStateData?.name === page) return;
    dispatch({
      type: "SETINITDATA",
      state: { tourStateData: tourData },
    });
  }, []);

  useEffect(() => {
    if (checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    if (
      !microplanData?.microplanDetails ||
      !_.isEqual(
        {
          name: microplan,
        },
        microplanData.microplanDetails
      )
    )
      setModal("data-change-check");
    else updateData(true);
  }, [checkDataCompletion]);

  // UseEffect to add a event listener for keyboard
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modal]);

  const handleKeyPress = (event) => {
    // if (modal !== "upload-guidelines") return;
    if (["x", "Escape"].includes(event.key)) {
      // Perform the desired action when "x" or "esc" is pressed
      // if (modal === "upload-guidelines")
      setCheckDataCompletion("false");
      setModal("none");
    }
  };

  // check if data has changed or not
  const updateData = useCallback((check) => {
    if (checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    if (check) {
      setMicroplanData((previous) => ({
        ...previous,
        microplanDetails: {
          name: microplan,
        },
      }));
      if (!["", null, undefined].includes(microplan)) {
        setCheckDataCompletion("valid");
      } else {
        setCheckDataCompletion("invalid");
      }
    } else {
      if (!["", null, undefined].includes(microplanData?.microplanDetails?.name)) {
        setCheckDataCompletion("valid");
      } else {
        setCheckDataCompletion("invalid");
      }
    }
  }, [checkDataCompletion, microplan, microplanData, setCheckDataCompletion, setMicroplanData]);

  const cancelUpdateData = useCallback(() => {
    setCheckDataCompletion(false);
    setModal('none');
  }, [setCheckDataCompletion, setModal]);

  const onChangeMicroplanName = (e) => {
    setMicroplan(e.target.value);
  };

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
        className="microplan-campaign-detials"
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
        className="microplan-name"
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
      {modal === "data-change-check" && (
        <Modal
          popupStyles={{ width: "fit-content", borderRadius: "0.25rem" }}
          popupModuleActionBarStyles={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            padding: 0,
            width: "100%",
            padding: "0 0 1rem 1.3rem",
          }}
          popupModuleMianStyles={{ padding: 0, margin: 0, maxWidth: "31.188rem" }}
          style={{
            flex: 1,
            backgroundColor: "white",
            border: "0.063rem solid rgba(244, 119, 56, 1)",
          }}
          headerBarMainStyle={{ padding: 0, margin: 0 }}
          headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("HEADING_DATA_WAS_UPDATED_WANT_TO_SAVE")} />}
          headerBarEnd={<CloseButton clickHandler={cancelUpdateData} style={{ padding: "0.4rem 0.8rem 0 0" }} />}
          actionCancelLabel={t("YES")}
          actionCancelOnSubmit={updateData.bind(null, true)}
          actionSaveLabel={t("NO")}
          actionSaveOnSubmit={() => updateData(false)}
        >
          <div className="modal-body">
            <p className="modal-main-body-p">{t("INSTRUCTION_DATA_WAS_UPDATED_WANT_TO_SAVE")}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MicroplanDetails;
