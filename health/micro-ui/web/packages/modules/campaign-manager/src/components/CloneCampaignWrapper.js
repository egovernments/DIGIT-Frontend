import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PopUp, Toast, Loader, FieldV1 } from "@egovernments/digit-ui-components";
import { useNavigate } from "react-router-dom";

const CloneCampaignWrapper = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [name, setName] = useState(`${props?.campaignName}-copy`);
  const isoDate = (d) => new Date(d).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isValidatingName, setIsValidatingName] = useState(false);

  // derive the minimum end‐date as startDate + 1 day
  const endMin = startDate
    ? isoDate(new Date(new Date(startDate).getTime() + 24 * 3600 * 1000))
    : isoDate(Date.now() + 2 * 24 * 3600 * 1000);

  const { mutate: createCampaign, isPending: isLoading } = Digit.Hooks.campaign.useCreateCampaign(tenantId);

  const handleToastClose = () => {
    setToast(null);
  };

  const fetchValidCampaignName = async (tenantId, name) => {
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/project-type/search`,
      body: {
        CampaignDetails: {
          tenantId: tenantId,
          campaignName: name,
        },
      },
    });
    return res?.CampaignDetails;
  };

  const onNextClick = async () => {
    let hasError = false;

    const nameRegexPattern = /^(?!.*[ _-]{2})(?=^[^\s_-])(?!.*[\s_-]$)(?=^[\p{L}][\p{L}0-9 _\-\(\)]{4,29}$)^.*$/u;
    // Name validation
    if (!name?.trim()) {
      setNameError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      hasError = true;
    } else if (name.length > 30) {
      setNameError({ message: "CAMPAIGN_NAME_GREATER" });
      hasError = true;
    } else if (!nameRegexPattern.test(name)) {
      setNameError({ message: "ES__REQUIRED_NAME_AND_LENGTH" });
      hasError = true;
    } else {
      setNameError(null);
    }

    // Start date validation
    if (!startDate) {
      setStartError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      hasError = true;
    } else {
      setStartError(null);
    }

    // End date validation
    if (!endDate) {
      setEndError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      hasError = true;
    } else if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      setEndError({ message: "CAMPAIGN_END_DATE_BEFORE_ERROR" });
      hasError = true;
    } else {
      setEndError(null);
    }

    if (hasError) return;
    setIsValidatingName(true);
    let temp = await fetchValidCampaignName(tenantId, name);
    if (temp.length != 0) {
      setToast({ key: "error", label: t("CAMPAIGN_NAME_ALREADY_EXIST") });
      setIsValidatingName(false);
      return;
    }
    setIsValidatingName(false);

    // Prepare modified campaign payload
    // Preserve original additionalDetails (including file upload info) and add cloneFrom
    const modifiedCampaign = {
      ...props?.row,
      campaignName: name,
      deliveryRules: [],
      parentId: null,
      isActive: true,
      campaignNumber: null,
      projectId: null,
      id: null,
      startDate: startDate ? new Date(startDate).getTime() : null,
      endDate: endDate ? new Date(endDate).getTime() : null,
      action: "draft",
      status: "drafted",
      additionalDetails: {
        ...props?.row?.additionalDetails,
        cloneFrom: props?.row?.campaignNumber,
      },
    };

    createCampaign(modifiedCampaign, {
      onSuccess: (res) => {
        if (res?.CampaignDetails?.campaignNumber) {
          setToast({
            key: "success",
            label: `${res.CampaignDetails.campaignNumber} ${t("CAMPAIGN_CREATED_SUCCESSFULLY")}`,
            type: "success",
          });
          setTimeout(() => {
            navigate(
              `/workbench-ui/employee/campaign/view-details?tenantId=${tenantId}&campaignNumber=${res.CampaignDetails.campaignNumber}`
            );
          }, 1000);
        }
      },
      onError: (err) => {
        console.error("Clone campaign error:", err);
        const errorMessage = err?.message || err?.response?.data?.Errors?.[0]?.message || "FAILED_TO_CREATE_COPY_CAMPAIGN";
        setToast({ key: "error", label: t(errorMessage), type: "error" });
      },
    });
  };

  return (
    <>
      <PopUp
        type={"default"}
        heading={t("HCM_CREATE_COPY_OF_CAMPAIGN")}
        className={"copy-campaign-popup"}
        onOverlayClick={() => props.setCampaignCopying(false)}
        onClose={() => props.setCampaignCopying(false)}
        footerChildren={[
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"large"}
            variation={"primary"}
            label={t("SUBMIT")}
            title={t("SUBMIT")}
            onClick={onNextClick}
            isDisabled={isLoading || isValidatingName}
          />
        ]}
      >
        {(isLoading || isValidatingName) && (
          <Loader className="digit-center-loader" loaderText={isValidatingName ? t("VALIDATING_CAMPAIGN_NAME") : t("CREATING_CAMPAIGN_COPY")} />
        )}
        {!isLoading && !isValidatingName && (
          <div className="container">
            <div className="card-container2">
              <div>
                {/* <HeaderComponent className={"popUp-header"}>{t("HCM_CAMPAIGN_NAME_HEADER")}</HeaderComponent> */}
                <p className="name-description">{t("HCM_CAMPAIGN_NAME_DESCRIPTION")}</p>
                <div
                  className="clone-campaign-fields-wrapper"
                  style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}
                >
                  <FieldV1
                    type="text"
                    label={t("HCM_CAMPAIGN_NAME")}
                    required={true}
                    style={{ width: "-webkit-fill-available", marginBottom: "0" }}
                    error={nameError?.message ? t(nameError.message) : ""}
                    populators={{
                      name: "campaignName",
                      error: "ES__REQUIRED_NAME_AND_LENGTH",
                      fieldPairClassName: "clonecampaign-popup-field",
                      validation: {
                        pattern: /^(?!.*[ _-]{2})(?=^[^\s_-])(?!.*[\s_-]$)(?=^[\p{L}][\p{L}0-9 _\-\(\)]{4,29}$)^.*$/u,
                      },
                    }}
                    placeholder={t("HCM_CAMPAIGN_NAME_EXAMPLE")}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <FieldV1
                    error={startError?.message ? t(startError.message) : ""}
                    label={t("CAMPAIGN_START_DATE")}
                    required={true}
                    type="date"
                    value={startDate}
                    placeholder={t("CAMPAIGN_START_DATE")}
                    populators={{
                      fieldPairClassName: "clonecampaign-popup-field",
                      validation: {
                        min: new Date(Date.now() + 86400000).toISOString().split("T")[0],
                      },
                    }}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    onChange={(d) => {
                      setStartDate(d || null);
                      if (d) setStartError(null);
                    }}
                  />
                  <FieldV1
                    error={endError?.message ? t(endError.message) : ""}
                    label={t("CAMPAIGN_END_DATE")}
                    required={true}
                    type="date"
                    value={endDate}
                    placeholder={t("CAMPAIGN_END_DATE")}
                    populators={{
                      fieldPairClassName: "clonecampaign-popup-field",
                      validation: {
                        min: endMin,
                      },
                    }}
                    min={endMin}
                    onChange={(d) => {
                      setEndDate(d || null);
                      if (d) setEndError(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </PopUp>
      {toast && (
        <Toast
          style={{ zIndex: 10001 }}
          error={toast.key}
          isDleteBtn="true"
          label={t(toast.label)}
          onClose={handleToastClose}
          type={toast?.key === "error" ? "error" : toast?.key === "info" ? "info" : toast?.key === "warning" ? "warning" : "success"}
        />
      )}
    </>
  );
};

export default CloneCampaignWrapper;
