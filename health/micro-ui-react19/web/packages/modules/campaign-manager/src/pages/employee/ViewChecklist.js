import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { SummaryCardFieldPair, Card, Button, PopUp,Loader,TextArea } from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useNavigate, useLocation } from "react-router-dom";
import MobileChecklist from "../../components/MobileChecklist";
import TagComponent from "../../components/TagComponent";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const ViewChecklist = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const role = searchParams.get("role");
  const rlt = searchParams.get("role");
  const projectType = searchParams.get("projectType");
  const campaignId = searchParams.get("campaignId");
  const roleLocal = !rlt.startsWith("ACCESSCONTROL_ROLES_ROLES_") ? "ACCESSCONTROL_ROLES_ROLES_" + rlt : rlt;
  const checklistType = searchParams.get("checklistType");
  let clt = searchParams.get("checklistType");
  const checklistTypeLocal = !clt.startsWith("HCM_CHECKLIST_TYPE_") ? "HCM_CHECKLIST_TYPE_" + clt : clt;
  const navigate = useNavigate(); // Get history object for navigation
  const serviceCode = `${campaignName}.${checklistType}.${role}`;
  const [config, setConfig] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [helpText, setHelpText] = useState("");

  const [viewData, setViewData] = useState(null);

  const [serviceDefId, setServiceDefId] = useState(null);
  const [updateDisable, setUpdateDisable] = useState(false);

  const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

  const res = {
    url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_search`,
    body: {
      ServiceDefinitionCriteria: {
        tenantId: tenantId,
        code: [serviceCode],
      },
      includeDeleted: true,
    },
  };
  const { isLoading, data: rawData, isFetching } = Digit.Hooks.useCustomAPIHook(res);

  // Process the raw data and set state in useEffect
  const [data, setData] = useState(null);

  useEffect(() => {
    if (rawData?.ServiceDefinitions?.[0]?.attributes) {
      setServiceDefId(rawData?.ServiceDefinitions?.[0]?.id);
      setHelpText(rawData?.ServiceDefinitions?.[0]?.additionalFields?.fields?.[0]?.value?.helpText);
      const temp_data = rawData?.ServiceDefinitions?.[0]?.attributes;
      const formatted_data = temp_data.map((item) => item.additionalFields?.fields?.[0]?.value);
      const nvd = formatted_data.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
      setData(nvd);
    }
  }, [rawData]);

  useEffect(() => {
    if (data) {
      data.forEach((question) => {
        if (question.type.code === "String") {
          question.type.code = "Short Answer";
        }
      });

      setViewData(data);
    }
  }, [data]);

  // Second API call - use a separate hook with conditional execution
  const [serviceResponseParam, setServiceResponseParam] = useState(null);

  useEffect(() => {
    // Only set API params when serviceDefId is available
    if (serviceDefId) {
      setServiceResponseParam({
        url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/v1/_search`,
        body: {
          ServiceCriteria: {
            tenantId: tenantId,
            serviceDefIds: [serviceDefId],
          },
        },
      });
    }
  }, [serviceDefId, tenantId]);

  // Conditionally call the hook only when params are available
  const { isLoading: secondLoading, data: secondData } = Digit.Hooks.useCustomAPIHook(
    serviceResponseParam || {} // Provide an empty object if params are not set
  );

  // Handle the update disable logic in a separate useEffect
  useEffect(() => {
    if (secondData?.Services?.[0]?.auditDetails) {
      const lastModifiedTime = secondData?.Services?.[0]?.auditDetails?.lastModifiedTime;
      if (lastModifiedTime) {
        const modifiedDate = new Date(lastModifiedTime);
        const today = new Date();
        const isToday =
          modifiedDate.getDate() === today.getDate() &&
          modifiedDate.getMonth() === today.getMonth() &&
          modifiedDate.getFullYear() === today.getFullYear();

        if (isToday) {
          setUpdateDisable(true);
        }
      }
    }
  }, [secondData]);
  function organizeQuestions(questions) {
    // Deep clone the questions to avoid mutating the original tempFormData
    const clonedQuestions = JSON.parse(JSON.stringify(questions));

    const questionMap = new Map();
    const optionMap = new Map();
    const organizedQuestions = [];

    // First pass: Populate the maps with questions and options
    clonedQuestions.forEach((question) => {
      question.subQuestions = []; // Initialize an array to hold sub-questions
      questionMap.set(question.id, question);

      if (question?.options) {
        question.options.forEach((option) => {
          option.subQuestions = []; // Initialize an array to hold sub-questions for options
          optionMap.set(option.id, option);
        });
      }
    });

    // Second pass: Link each question to its parent, whether it's a question or an option
    clonedQuestions.forEach((question) => {
      if (question.parentId) {
        const parentQuestion = questionMap.get(question.parentId);
        const parentOption = optionMap.get(question.parentId);

        if (parentQuestion) {
          parentQuestion.subQuestions.push(question);
        } else if (parentOption) {
          parentOption.subQuestions.push(question);
        }
      } else {
        organizedQuestions.push(question);
      }
    });

    return organizedQuestions;
  }

  const popShow = () => {
    const pr = organizeQuestions(viewData);
    setPreviewData(pr);
    setShowPopUp(!showPopUp);
  };

  useEffect(() => {
    const currentTime = new Date();
    if (viewData !== null) {
      setConfig(checklistCreateConfig(viewData, currentTime, "view"));
    }
  }, [viewData]);

  const fieldPairs = [
    { label: "CHECKLIST_ROLE", value: roleLocal },
    { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
    { label: "CAMPAIGN_NAME", value: campaignName },
  ];

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      <TagComponent campaignName={campaignName} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "Roboto Condensed" ,color:"#0b4b66"}}>{t(I18N_KEYS.PAGES.VIEW_CHECKLIST)}</h2>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            icon="Preview"
            variation="secondary"
            label={t(I18N_KEYS.PAGES.PREVIEW_CHECKLIST)}
            title={t(I18N_KEYS.PAGES.PREVIEW_CHECKLIST)}
            className={"hover"}
            style={{ marginTop: "10px", marginBottom: "1.5rem" }}
            // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
            onClick={popShow}
          />
        </div>
      </div>
      {showPopUp && (
        <PopUp
          className={"custom-pop-up"}
          type={"default"}
          heading={t(I18N_KEYS.PAGES.CHECKLIST_PREVIEW)}
          children={[]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <div></div>,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t(I18N_KEYS.COMMON.CLOSE)}
              title={t(I18N_KEYS.COMMON.CLOSE)}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
        >
          <MobileChecklist
            questions={previewData}
            campaignName={campaignName}
            checklistRole={t(`${roleLocal}`)}
            typeOfChecklist={t(`${checklistTypeLocal}`)}
          ></MobileChecklist>
        </PopUp>
      )}

      <Card type={"primary"} variant={"viewcard"} className={"example-view-card"}>
        {fieldPairs.map((pair, index) => (
          <div>
            <SummaryCardFieldPair
              key={index} // Provide a unique key for each item
              className="checklist-screen"
              inline
              label={t(pair.label)} // Dynamically set the label
              value={t(pair.value)} // Dynamically set the value
            />
          </div>
        ))}
        {
          <div style={{ display: "flex",gap:"1.5rem" }}>
            <div style={{ width: "20%", fontWeight: "500"}}>{t("CHECKLIST_HELP_TEXT")}</div>
            <TextArea
              disabled={true}
              className="tetxinput-example"
              // type={"text"}
              name={t(I18N_KEYS.PAGES.CHECKLIST_HELP_TEXT)}
              value={helpText}
              placeholder={t(I18N_KEYS.PAGES.CHECKLIST_HELP_TEXT_PALCEHOLDER)}
            />
          </div>
        }
      </Card>
      <div style={{ height: "1rem" }} />

      {!isLoading && (
        <FormComposerV2
          showMultipleCardsWithoutNavs={true}
          label={t("UPDATE")}
          config={config}
          onSubmit={() => {
            navigate(
              `/${window.contextPath}/employee/campaign/checklist/update?campaignName=${campaignName}&role=${role}&checklistType=${checklistType}&projectType=${projectType}&campaignId=${campaignId}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
            );
          }}
          fieldStyle={{ marginRight: 0 }}
          noBreakLine={true}
          isDisabled={updateDisable}
          actionClassName={"dateUpdateAction single-button"}
          noCardStyle={true}
        />
      )}
    </div>
  );
};

export default ViewChecklist;
