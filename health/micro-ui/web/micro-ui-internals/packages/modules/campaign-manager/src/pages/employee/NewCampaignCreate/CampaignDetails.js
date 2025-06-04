import { Button, HeaderComponent, Footer, Loader, Tag, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { OutpatientMed, AdUnits, GlobeLocationPin, Groups, ListAltCheck, UploadCloud, Edit } from "@egovernments/digit-ui-svg-components";
import { transformUpdateCreateData } from "../../../utils/transformUpdateCreateData";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import getMDMSUrl from "../../../utils/getMDMSUrl";

const CampaignDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const AppConfigSchema = "SimpleAppConfiguration";
  const [showToast, setShowToast] = useState(null);
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const url = getMDMSUrl(true);

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

  const reqCriteriaMDMSBaseTemplateSearch = {
    url: `${url}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`,
        isActive: true,
        filters: {
          project: campaignNumber,
        },
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: productTypeLoading, data: modulesData } = Digit.Hooks.useCustomAPIHook(reqCriteriaMDMSBaseTemplateSearch);

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
              buttonLabel: campaignData?.boundaries?.length > 0 ? t("HCM_EDIT_BOUNDARY_BUTTON") : t("HCM_SELECT_BOUNDARY_BUTTON"),
              navLink: `setup-campaign?key=5&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&isDraft=true`,
              type: campaignData?.boundaries?.length > 0 ? "secondary" : "primary",
              icon: <GlobeLocationPin />,
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
              buttonLabel: campaignData?.deliveryRules?.[0]?.cycles?.length > 0 ? t("HCM_EDIT_DELIVERY_BUTTON") : t("HCM_DELIVERY_BUTTON"),
              navLink: `setup-campaign?key=7&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&isDraft=true`,
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
              buttonLabel:  modulesData?.mdms?.length > 0 ? t("HCM_MOBILE_APP_BUTTON_EDIT") :  t("HCM_MOBILE_APP_BUTTON"),
              type: modulesData?.mdms?.length > 0 ?  "secondary" : "primary",
              navLink: `app-modules?projectType=${campaignData?.projectType}&campaignNumber=${campaignData?.campaignNumber}&tenantId=${tenantId}`,
              icon: <AdUnits />,
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
              navLink: `setup-campaign?key=10&summary=false&submit=true&campaignNumber=${campaignData?.campaignNumber}&id=${campaignData?.id}&isDraft=true`,
              type: campaignData?.resources?.length > 0 ? "secondary" : "primary",
              icon: <UploadCloud fill={campaignData?.boundaries?.length <= 0 ? "#c5c5c5" : "#C84C0E"} />,
              disabled: campaignData?.boundaries?.length <= 0,
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

  const onsubmit = async () => {
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
          history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}&campaignId=${data?.CampaignDetails?.id}`, {
            message: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE"),
            text: t("ES_CAMPAIGN_CREATE_SUCCESS_RESPONSE_TEXT"),
            info: t("ES_CAMPAIGN_SUCCESS_INFO_TEXT"),
            actionLabel: "ES_CAMPAIGN_HOME",
            actionLink: `/${window.contextPath}/employee`,
          });
        },
        onError: (error, result) => {
          const errorCode = error?.response?.data?.Errors?.[0]?.description;
          setShowToast({ key: "error", label: errorCode });
        },
      }
    );
  };

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const week = `${Digit.DateUtils.ConvertTimestampToDate(campaignData?.startDate, "dd/MM/yyyy")}-${Digit.DateUtils.ConvertTimestampToDate(
    campaignData?.endDate,
    "dd/MM/yyyy"
  )}`;

  const closeToast = () => {
    setShowToast(null);
  };

  return (
    <>
      <div className="campaign-details-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <HeaderComponent className={"date-header"}>{campaignData?.campaignName}</HeaderComponent>
          <div
            className="hover"
            onClick={() => {
              history.push(`/${window.contextPath}/employee/campaign/create-campaign?key=2&editName=${true}&id=${campaignData?.id}`);
            }}
          >
            <Edit />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <Tag label={t(campaignData?.projectType)} showIcon={false} className={"campaign-view-tag"} type={"warning"} stroke={true}></Tag>
          <Tag
            label={campaignData?.deliveryRules?.[0]?.cycles?.length > 1 ? t("HCM_MULTIROUND") : t("HCM_SINGLE_ROUND")}
            showIcon={false}
            className={"campaign-view-tag"}
            type={"monochrome"}
            stroke={true}
          ></Tag>
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
            history.push(`/${window.contextPath}/employee/campaign/create-campaign?key=3&editName=${true}&id=${campaignData?.id}`);
          }}
        >
          <Edit />
        </div>
      </div>
      <div className="detail-desc">{t("HCM_VIEW_DETAILS_DESCRIPTION")}</div>
      <div className="campaign-summary-container">
        <ViewComposer data={data} />
      </div>
      <Footer
        actionFields={[
          <Button
            icon="CheckCircleOutline"
            label={t("HCM_CREATE_CAMPAIGN")}
            onClick={onsubmit}
            isDisabled={campaignData?.boundaries?.length === 0 || campaignData?.deliveryRules?.length === 0}
            type="button"
            variation="primary"
            // className={"create-campaign-disable"}
          />,
        ]}
        maxActionFieldsAllowed={5}
        setactionFieldsToRight={true}
      />
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
