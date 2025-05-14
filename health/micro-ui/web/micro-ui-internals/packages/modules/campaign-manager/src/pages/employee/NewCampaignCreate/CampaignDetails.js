import { Button, HeaderComponent, Footer, Loader, Tag , Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment , useState } from "react";
import { useHistory } from "react-router-dom";
import { ViewComposer } from "@egovernments/digit-ui-react-components";
import { OutpatientMed, AdUnits, GlobeLocationPin, Groups, ListAltCheck, UploadCloud } from "@egovernments/digit-ui-svg-components";
import { transformUpdateCreateData } from "../../../utils/transformUpdateCreateData";
const CampaignDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const [showToast, setShowToast] = useState(null);
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();

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
              buttonLabel: t("HCM_MOBILE_APP_BUTTON"),
              navLink: `app-modules?campaignNumber=${campaignData?.campaignNumber}`,
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
              icon: <UploadCloud />,
              disabled: campaignData?.boundaries?.length <= 0
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
      enable: false,
    },
  };

  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);

  const onsubmit = async () => {
    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: transformUpdateCreateData({ campaignData }),
        config: {
          enable: true,
        },
      },
      {
        onSuccess: async (result) => {
          setShowToast({ key: "success", label: t("HCM_CAMPAIGN_CREATE_SUCCESS") });
          // setTimeout(() => {
          //   history.push(
          //     `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${result?.CampaignDetails?.campaignNumber}&tenantId=${result?.CampaignDetails?.tenantId}`
          //   );
          // }, 2000);
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
        <HeaderComponent className={"date-header"}>{campaignData?.campaignName}</HeaderComponent>
        <Tag label={campaignData?.campaignName} showIcon={false} className={"campaign-view-tag"} type={"warning"} stroke={true}></Tag>
        <Tag
          label={campaignData?.deliveryRules?.[0]?.cycles?.length > 1 ? t("HCM_MULTIROUND") : t("HCM_INDIVIDUAL")}
          showIcon={false}
          className={"campaign-view-tag"}
          type={"monochrome"}
          stroke={true}
        ></Tag>
      </div>
      <div className="dates">{week}</div>
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
            isDisabled={campaignData?.boundaries?.length === 0 || campaignData?.deliveryRules?.length === 0 || campaignData?.resources?.length === 0}
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
