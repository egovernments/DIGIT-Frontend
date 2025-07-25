import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { dateChangeBoundaryConfig, dateChangeConfig } from "../../configs/dateChangeBoundaryConfig";
import { Button, AlertCard, PopUp, Toast, Tag } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import TagComponent from "../../components/TagComponent";

function UpdateDatesWithBoundaries() {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const { state } = useLocation();
  const [showPopUp, setShowPopUp] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const { isLoading: DateWithBoundaryLoading, data: DateWithBoundary } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "dateWithBoundary" }],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.dateWithBoundary?.[0]?.dateWithBoundary;
      },
    }
  );
  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

  const isMultiCycle = (data) => {
    const cycles = data?.additionalDetails?.projectType?.cycles;

    // Check if cycles exist and the number of cycles is greater than 1
    if (cycles?.length > 1) {
      return true;
    }

    // Check if any cycle has more than one delivery
    for (const cycle of cycles || []) {
      if (cycle.deliveries?.length > 1) {
        return true;
      }
    }

    return false;
  };

  const checkValid = (data) => {
    if (DateWithBoundary) {
      const temp = data?.dateWithBoundary;
      const isMultiCycles = isMultiCycle(temp?.[0]);
      const allCycleDateValid =
       isMultiCycles
          ? temp.map((i) => i?.additionalDetails?.projectType?.cycles.every((j) => j?.startDate && j?.endDate)).every((k) => k === true)
          : true;
      const allDateValid = temp.every((i) => i?.startDate && i?.endDate);

      if (isMultiCycles && allCycleDateValid && allDateValid) {
        return true;
      } else if (!isMultiCycles && allDateValid) {
        return true;
      }
      return false;
    } else if (!DateWithBoundary) {
      const isMultiCycles = isMultiCycle(data?.dateAndCycle);
      const cycleDateValid = data?.dateAndCycle?.additionalDetails?.projectType?.cycles?.every((item) => item?.startDate && item?.endDate);
      if (isMultiCycles && data?.dateAndCycle?.startDate && data?.dateAndCycle?.endDate && cycleDateValid) {
        return true;
      } else if (!isMultiCycles && data?.dateAndCycle?.startDate && data?.dateAndCycle?.endDate) {
        return true;
      }
      return false;
    }
  };
  const onSubmit = async (formData) => {
    if (DateWithBoundary) {
      if (!formData?.dateWithBoundary || !Array.isArray(formData?.dateWithBoundary) || formData?.dateWithBoundary?.length === 0) {
        setShowToast({ isError: true, label: "SELECT_BOUNDARY_LEVEL_ERROR" });
        return;
      }
    } else if (!DateWithBoundary) {
      if (!formData?.dateAndCycle) {
        setShowToast({ isError: true, label: "SELECT_DATE_CHANGE_MANDATORY_ERROR" });
        return;
      }
    }
    let isValid = checkValid(formData);
    if (!isValid) {
      setShowToast({ isError: true, label: "UPDATE_DATE_MANDATORY_FIELDS_MISSING" });
      return;
    }
    setShowPopUp(formData);
  };

  const onConfirm = async (formData) => {
    setShowPopUp(null);
    try {
      if (DateWithBoundary) {
        // updating the endDate by +1 sec and -1 sec so that backend logic for ancestor update work
        const payload = formData?.dateWithBoundary?.map((item) => {
          let itemEndDate = item?.endDate;
          let endDate = new Date(item?.endDate);
          let endSecond = endDate?.getSeconds();
          // if (endSecond < 59) {
          //   return {
          //     ...item,
          //     endDate: itemEndDate + 1000,
          //   };
          // } else {
          //   return {
          //     ...item,
          //     endDate: itemEndDate - 1000,
          //   };
          // }
        });
        // const temp = await Digit.Hooks.campaign.useProjectUpdateWithBoundary({ formData: payload });
        const temp = await Digit.Hooks.campaign.useProjectUpdateWithBoundary({ formData: formData?.dateWithBoundary });
        // setShowToast({ isError: false, label: "DATE_UPDATED_SUCCESSFULLY" });
        history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}`, {
          message: t("ES_CAMPAIGN_DATE_CHANGE_WITH_BOUNDARY_SUCCESS"),
          // text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXTKK"),
          // info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXTKK"),
          actionLabel: t("HCM_DATE_CHANGE_VIEW_SUCCESS_RESPONSE_ACTION"),
          actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
        });
      } else {
        const url = getProjectServiceUrl();
        const res = await Digit.CustomService.getResponse({
          url: `${url}/v1/_update`,
          body: {
            Projects: [formData?.dateAndCycle],
            isCascadingProjectDateUpdate: true,
          },
        });
        // setShowToast({ isError: false, label: "DATE_UPDATED_SUCCESSFULLY" });
        history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}`, {
          message: t("ES_CAMPAIGN_DATE_CHANGE_SUCCESS"),
          // text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXTKK"),
          // info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXTKK"),
          actionLabel: t("HCM_DATE_CHANGE_SUCCESS_RESPONSE_ACTION"),
          actionLink: `/${window.contextPath}/employee/campaign/setup-campaign?id=${id}&preview=true&action=false&actionBar=true&key=16&summary=true`,
        });
      }
    } catch (error) {
      setShowToast({ isError: true, label: error?.response?.data?.Errors?.[0]?.message ? error?.response?.data?.Errors?.[0]?.message : error });
    }
  };
  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    return;
  };

  return (
    <div>
       <TagComponent campaignName={campaignName} />  
      <FormComposerV2
        label={t("CAMPAIGN_UPDATE_DATE_SUBMIT")}
        config={
          DateWithBoundary
            ? dateChangeBoundaryConfig?.map((config) => {
                return {
                  ...config,
                };
              })
            : dateChangeConfig?.map((config) => {
                return {
                  ...config,
                };
              })
        }
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 0 }}
        noBreakLine={true}
        className="date-update"
        cardClassName={"date-update-card"}
        onFormValueChange={onFormValueChange}
        actionClassName={"dateUpdateAction"}
        noCardStyle={true}
      />
      <AlertCard
        className={"infoClass"}
        populators={{
          name: "infocard",
        }}
        variant="default"
        style={{ marginBottom: "1.5rem", marginTop: "1.5rem", marginLeft: "0rem", maxWidth: "100%" }}
        additionalElements={[
          <span style={{ color: "#505A5F" }}>{t(`UPDATE_DATE_CHANGE_INFO_TEXT1`)}</span>,
          <span style={{ color: "#505A5F" }}>{t(`UPDATE_DATE_CHANGE_INFO_TEXT2`)}</span>,
        ]}
        label={"Info"}
        headerClassName={"headerClassName"}
      />
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("ES_CAMPAIGN_CHANGE_DATE_CONFIRM")}
          children={[]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("NO")}
              onClick={() => {
                setShowPopUp(null);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("YES")}
              onClick={() => {
                onConfirm(showPopUp);
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
      {showToast && (
        <Toast
          type={showToast?.isError ? "error" : "success"}
          // error={showToast?.isError}
          label={t(showToast?.label)}
          isDleteBtn={"true"}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default UpdateDatesWithBoundaries;
