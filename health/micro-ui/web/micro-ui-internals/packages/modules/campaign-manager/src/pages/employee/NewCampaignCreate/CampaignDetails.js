import { Button, HeaderComponent, Footer, Loader, Tag, Toast, PopUp } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { OutpatientMed, AdUnits, GlobeLocationPin, Groups, ListAltCheck, UploadCloud, Edit } from "@egovernments/digit-ui-svg-components";
import { transformUpdateCreateData } from "../../../utils/transformUpdateCreateData";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import getMDMSUrl from "../../../utils/getMDMSUrl";
import { downloadExcelWithCustomName } from "../../../utils";
import { convertEpochToNewDateFormat } from "../../../utils/convertEpochToNewDateFormat";
import QRButton from "../../../components/CreateCampaignComponents/QRButton";
export const HCMCONSOLE_APPCONFIG_MODULENAME = "FormConfig";


function transformCampaignData(inputObj = {}) {
  console.log("inputObj",inputObj);
  const deliveryRule = inputObj.deliveryRules?.[0] || {};
  const deliveryResources = deliveryRule.resources || [];

  const cycleDataArray = inputObj.additionalDetails?.cycleData?.cycleData || [];
  const cycle = cycleDataArray?.[0] || {};
  const configure = inputObj.additionalDetails?.cycleData?.cycleConfgureDate || {};

  return {
    HCM_CAMPAIGN_TYPE: {
      projectType: {
        ...deliveryRule,
        resources: Array.isArray(deliveryResources)
          ? deliveryResources.map(r => ({
              name: r?.name || '',
              productVariantId: r?.productVariantId ||null,
              isBaseUnitVariant: r?.isBaseUnitVariant || false
            }))
          : []
      }
    },
    HCM_CAMPAIGN_NAME: {
      campaignName: inputObj?.campaignName || ''
    },
    HCM_CAMPAIGN_DATE: {
      campaignDates: {
        startDate: formatIsoDate(cycle?.fromDate),
        endDate: formatIsoDate(cycle?.toDate)
      }
    },
    HCM_CAMPAIGN_CYCLE_CONFIGURE: {
      cycleConfigure: {
        cycleConfgureDate: configure,
        cycleData: cycleDataArray
      }
    },
    HCM_CAMPAIGN_DELIVERY_DATA: {
      deliveryRule: [] 
    },
    HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA: {
      boundaryType: {
        selectedData: inputObj?.boundaries || []
      }
    },
    HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA: {
      uploadBoundary: {
        uploadedFile: [],
        isSuccess: false
      }
    },
    HCM_CAMPAIGN_UPLOAD_FACILITY_DATA: {
      uploadFacility: {
        uploadedFile: [],
        isSuccess: false
      }
    },
    HCM_CAMPAIGN_UPLOAD_USER_DATA: {
      uploadUser: {
        uploadedFile: [],
        isSuccess: false
      }
    }
  };
}

function formatIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  return dateStr.split('T')[0]; // returns "YYYY-MM-DD"
}



const CampaignDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const AppConfigSchema = HCMCONSOLE_APPCONFIG_MODULENAME;
  const [showToast, setShowToast] = useState(null);
  const isDraft = searchParams.get("draft");
  const [showQRPopUp, setShowQRPopUp] = useState(false);
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const url = getMDMSUrl(true);

  // useEffect(() => {
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  //   window.Digit.SessionStorage.del("HCM_CAMPAIGN_UPDATE_FORM_DATA");
  // }, []);

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => {
        return data?.CampaignDetails?.[0];
      },
    },
  };

  const { isLoading, data: campaignData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {
    if (campaignData) {
      sessionStorage.setItem("HCM_CAMPAIGN_NUMBER", JSON.stringify({ id: campaignData?.id, campaignNumber: campaignNumber }));
    }
  }, [campaignData]);

  useEffect(() => {
    if (!campaignData) return;

    const cycleConfig = campaignData?.deliveryRules?.[0];
    const cycles = cycleConfig?.cycles || [];

    const formattedCycleData = cycles.map((cycle, idx) => ({
      key: idx + 1,
      fromDate: new Date(cycle?.startDate).toISOString(),
      toDate: new Date(cycle?.endDate).toISOString(),
    }));

    const cycleConfgureDate = {
      cycle: cycles.length,
      deliveries: cycles?.[0]?.deliveries?.length || 0,
      isDisable: cycleConfig?.IsCycleDisable !== undefined ? cycleConfig.IsCycleDisable : false
    };

    const campaignSessionData = {
      CampaignType: { code: campaignData?.projectType },
      CampaignName: campaignData?.campaignName,
      DateSelection: {
        startDate: Digit.DateUtils.ConvertEpochToDate(campaignData?.startDate)?.split("/")?.reverse()?.join("-"),
        endDate: Digit.DateUtils.ConvertEpochToDate(campaignData?.endDate)?.split("/")?.reverse()?.join("-"),
      },
      additionalDetails: {
        cycleData: formattedCycleData,
        cycleConfgureDate: cycleConfgureDate,
      },
      startDate: campaignData?.startDate,
      endDate: campaignData?.endDate,
      projectType: campaignData?.projectType,
      deliveryRules: campaignData?.deliveryRules,
      id: campaignData?.id,
    };
      
     const tranformedManagerUploadData= transformCampaignData(campaignData);
    console.log("tranformedDAta", tranformedManagerUploadData)
    Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_DATA", campaignSessionData);
     Digit.SessionStorage.set("HCM_ADMIN_CONSOLE_UPLOAD_DATA", tranformedManagerUploadData);
  }, [campaignData]);


  const { data: modulesData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: AppConfigSchema,
        // filter: `[?(@.project=='${campaignNumber}')].name`,
        filter: `[?(@.project=='${campaignNumber}')].version`,
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.[AppConfigSchema];
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.AppConfigSchema` }
  );

  let hasVersionGreaterThanOne = false;

  if (modulesData) {
    hasVersionGreaterThanOne = modulesData?.some((version) => version > 1);
  }

  const data = {
    cards: [
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_BOUNDARY_SELECT_HEADING"),
              desc: t("HCM_SELECT_BOUNDARY_DESC"),
              buttonLabel:
                campaignData?.status === "created" || campaignData?.parentId
                  ? t("HCM_UPDATE_BOUNDARIES")
                  : campaignData?.boundaries?.length > 0
                    ? t("HCM_EDIT_BOUNDARY_BUTTON")
                    : t("HCM_SELECT_BOUNDARY_BUTTON"),
              navLink:
                campaignData?.status === "created" || campaignData?.parentId
                  ? `update-campaign?key=1&parentId=${campaignData?.id}&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}`
                  : `setup-campaign?key=5&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&draft=${isDraft}&isDraft=true`,
              type: campaignData?.boundaries?.length > 0 || campaignData?.parentId ? "secondary" : "primary",
              icon: <GlobeLocationPin fill={"#c84c0e"} />,
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_DELIVERY_HEADING"),
              desc: t("HCM_DELIVERY_DESC"),
              buttonLabel:
                campaignData?.status === "created" || campaignData?.parentId
                  ? t("HCM_EDIT_DELIVERY_DATES")
                  : campaignData?.deliveryRules?.[0]?.cycles?.length > 0
                    ? t("HCM_EDIT_DELIVERY_BUTTON")
                    : t("HCM_DELIVERY_BUTTON"),
              navLink:
                campaignData?.status === "created" || campaignData?.parentId
                  ? `update-dates-boundary?id=${campaignData?.id}&campaignName=${campaignData?.campaignName}&projectId=${campaignData?.projectId}&campaignNumber=${campaignData?.campaignNumber}`
                  : `setup-campaign?key=7&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&draft=${isDraft}&isDraft=true&projectType=${campaignData?.projectType}`,
              type: campaignData?.deliveryRules?.[0]?.cycles?.length > 0 ? "secondary" : "primary",
              icon: <OutpatientMed />,
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_MOBILE_APP_HEADING"),
              desc: t("HCM_MOBILE_APP_DESC"),
              buttonLabel: hasVersionGreaterThanOne ? t("HCM_MOBILE_APP_BUTTON_EDIT") : t("HCM_MOBILE_APP_BUTTON"),
              // buttonLabel: modulesData?.length > 0 ? t("HCM_MOBILE_APP_BUTTON_EDIT") : t("HCM_MOBILE_APP_BUTTON"),
              // type: modulesData?.length > 0 ? "secondary" : "primary",
              type: hasVersionGreaterThanOne ? "secondary" : "primary",
              navLink: `app-modules?projectType=${campaignData?.projectType}&campaignNumber=${campaignData?.campaignNumber}&tenantId=${tenantId}`,
              icon: <AdUnits fill={campaignData?.status === "created" && campaignData?.startDate < Date.now() ? "#c5c5c5" : "#C84C0E"} />,
              disabled: (campaignData?.status === "created" || campaignData?.parentId) && campaignData?.startDate < Date.now(),
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_UPLOAD_DATA_HEADING"),
              desc: t("HCM_UPLOAD_DATA_DESC"),
              buttonLabel: campaignData?.resources?.length > 0 ? t("HCM_EDIT_UPLOAD_DATA_BUTTON") : t("HCM_UPLOAD_DATA_BUTTON"),
              navLink: `upload-screen?key=1&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}`,
              // navLink: `setup-campaign?key=10&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&draft=${isDraft}&isDraft=true`,
              type: campaignData?.resources?.length > 0 ? "secondary" : "primary",
              icon: <UploadCloud fill={campaignData?.boundaries?.length <= 0 || campaignData?.status === "created" ? "#c5c5c5" : "#C84C0E"} />,
              disabled: campaignData?.boundaries?.length <= 0 || campaignData?.status === "created" || campaignData?.parentId,
            },
          },
        ],
      },
      {
        noCardStyle: true,
        sections: [
          {
            type: "COMPONENT",
            component: "ViewDetailComponent",
            noCardStyle: true,
            props: {
              headingName: t("HCM_CHECKLIST_HEADING"),
              desc: t("HCM_CHECKLIST_DESC"),
              buttonLabel: t("HCM_CHECKLIST_BUTTON"),
              navLink: `checklist/search?name=${campaignData?.campaignName}&campaignId=${campaignData?.id}&projectType=${campaignData?.projectType}&campaignNumber=${campaignData?.campaignNumber}`,
              icon: <ListAltCheck />,
            },
          },
        ],
      },
    ],
  };

  const reqUpdate = {
    url: `/project-factory/v1/project-type/update`,
    params: {},
    body: {},
    config: {
      enabled: false,
    },
  };

  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  const validateCampaignDates = (cycles, campaignData) => {

    // Sort the cycles by startDate to find the first and last
    const sortedCycles = [...cycles].sort((a, b) => a.startDate - b.startDate);

    const firstCycleStart = sortedCycles[0]?.startDate;
    const lastCycleEnd = sortedCycles[sortedCycles.length - 1]?.endDate;

    const campaignStart = campaignData?.startDate;
    const campaignEnd = campaignData?.endDate;

    if (campaignStart <= firstCycleStart && campaignEnd >= lastCycleEnd) {
      return true;
    } else return false;
  };

  const onsubmit = async () => {
    const valideDates = validateCampaignDates(campaignData?.deliveryRules?.[0]?.cycles, campaignData);
    if (!valideDates) {
      setShowToast({ key: "error", label: "INVALID_DATES" });
      return;
    }
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: transformUpdateCreateData({ campaignData }),
        config: {
          enabled: true,
        },
      },
      {
        onSuccess: async (data) => {
          history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}&campaignId=${data?.CampaignDetails?.campaignNumber}`, {
            message: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE"),
            text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXT"),
            info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXT"),
            actionLabel: "ES_CAMPAIGN_HOME",
            actionLink: `/${window.contextPath}/employee`,
            secondaryActionLabel: "MY_CAMPAIGNS",
            secondaryActionLink: `/${window?.contextPath}/employee/campaign/my-campaign-new`,
          });
        },
        onError: (error, result) => {
          console.log("error", error);
          const errorCode = error?.response?.data?.Errors?.[0]?.description;
          setShowToast({ key: "error", label: t(errorCode) });
        },
      }
    );
  };

  const onDownloadCredentails = async (data) => {

    try {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const responseTemp = await Digit.CustomService.getResponse({
        url: `/project-factory/v1/data/_download`,
        params: {
          tenantId: tenantId,
          campaignId: campaignData?.id,
          type: "userCredential",
          hierarchyType: campaignData?.hierarchyType
        },
      });

      const response = responseTemp?.GeneratedResource?.map((i) => i?.fileStoreid);

      if (response?.[0]) {
        downloadExcelWithCustomName({
          fileStoreId: response[0],
          customName: "userCredential",
        });
      } else {
        console.error("No file store ID found for user credentials");
      }
    } catch (error) {
      console.error("Error downloading user credentials:", error);
    }
  };

  const onDownloadApp = () => {
    setShowQRPopUp(true);
  };

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const week = `${convertEpochToNewDateFormat(campaignData?.startDate)} - ${convertEpochToNewDateFormat(campaignData?.endDate)}`;

  const closeToast = () => {
    setShowToast(null);
  };

  return (
    <>
      <div className="campaign-details-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <HeaderComponent className={"date-header"}>{campaignData?.campaignName}</HeaderComponent>
          {campaignData?.status !== "created" && (
            <div
              className="hover"
              onClick={() => {
                history.push(
                  `/${window.contextPath}/employee/campaign/create-campaign?key=2&editName=${true}&id=${campaignData?.id}&draft=${isDraft}`
                );
              }}
            >
              <Edit />
            </div>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <Tag label={t(campaignData?.projectType)} showIcon={false} className={"campaign-view-tag"} type={"warning"} stroke={true}></Tag>
          {campaignData?.deliveryRules?.[0]?.cycles?.length >= 1 && (
            <Tag
              label={campaignData?.deliveryRules?.[0]?.cycles?.length > 1 ? t("HCM_MULTIROUND") : t("HCM_SINGLE_ROUND")}
              showIcon={false}
              className={"campaign-view-tag"}
              type={"monochrome"}
              stroke={true}
            />
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div className="dates">{week}</div>
        <div
          className="hover"
          style={{
            height: "20px",
            width: "20px",
            alignSelf: "self-end",
          }}
          onClick={() => {
            if (campaignData?.status === "created") {
              history.push(
                `/${window.contextPath}/employee/campaign/update-dates-boundary?id=${campaignData?.id}&campaignName=${campaignData?.campaignName}&campaignNumber=${campaignData?.campaignNumber}`
              );
            } else {
              history.push(`/${window.contextPath}/employee/campaign/create-campaign?key=3&editName=${true}&id=${campaignData?.id}&draft=${isDraft}`);
            }
          }}
        >
          <Edit width={"18"} height={"18"} />
        </div>
      </div>
      <div className="detail-desc">{t("HCM_VIEW_DETAILS_DESCRIPTION")}</div>
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
      <Footer
        actionFields={
          campaignData?.status !== "created" && !campaignData?.parentId
            ? [
              <Button
                icon="CheckCircleOutline"
                label={t("HCM_CREATE_CAMPAIGN")}
                onClick={onsubmit}
                isDisabled={
                  campaignData?.boundaries?.length === 0 ||
                  campaignData?.deliveryRules?.length === 0 ||
                  campaignData?.resources?.length === 0 ||
                  // modulesData?.length === 0
                  !hasVersionGreaterThanOne
                }
                type="button"
                variation="primary"
              />,
            ]
            : [
              <Button
                icon="CloudDownload"
                label={t("HCM_DOWNLOAD_CREDENTIALS")}
                onClick={() => onDownloadCredentails(campaignData)}
                type="button"
                variation="primary"
              />,
              <Button icon="CloudDownload" label={t("HCM_DOWNLOAD_APP")} onClick={onDownloadApp} type="button" variation="primary" />,
            ]
        }
        maxActionFieldsAllowed={5}
        setactionFieldsToRight={true}
      />
      {showQRPopUp && <QRButton setShowQRPopUp={setShowQRPopUp} />}
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default CampaignDetails;
