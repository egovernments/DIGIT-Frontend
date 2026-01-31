import React, { useEffect, useState, createContext, useContext } from "react";
import { checklistCreateConfig } from "../../configs/checklistCreateConfig";
import { useTranslation } from "react-i18next";
import { SummaryCardFieldPair, Toast, Card, Button, PopUp,Loader ,TextArea} from "@egovernments/digit-ui-components";
import { FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { useNavigate, useLocation } from "react-router-dom";
import MobileChecklist from "../../components/MobileChecklist";
import TagComponent from "../../components/TagComponent";
import LocalisationEditorPopup from "../../components/LocalisationEditorPopup";

const UpdateChecklist = () => {
  const { t } = useTranslation();
  const module = "hcm-checklist";
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
  const [config, setConfig] = useState(null);
  const [checklistTypeCode, setChecklistTypeCode] = useState(null);
  const [roleCode, setRoleCode] = useState(null);
  const serviceCode = `${campaignName}.${checklistType}.${role}`;
  const [searching, setSearching] = useState(true);
  const [viewData, setViewData] = useState(null);
  let locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const presentLocale = Digit?.SessionStorage.get("locale");
  const { mutateAsync } = Digit.Hooks.campaign.useUpdateChecklist(tenantId);
  const { mutateAsync: localisationMutateAsync } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, locale);
  let processedData = [];
  let checklistName = `${checklistType} ${role}`;
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [tempFormData, setTempFormData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [curActive, setCurActive] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [showLocalisationPopup, setShowLocalisationPopup] = useState(false);
  const [localisationData, setLocalisationData] = useState([]);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { languages, stateInfo } = storeData || {};
  const currentLocales = languages.map((locale) => locale.value);

  const popShow = () => {
    const pr = organizeQuestions(tempFormData);
    setPreviewData(pr);
    setShowPopUp(true);
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onFormValueChange = (ll, formData) => {
    setTempFormData(formData?.createQuestion?.questionData);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

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
      setCurActive(rawData?.ServiceDefinitions?.[0].isActive);
      setHelpText(rawData?.ServiceDefinitions?.[0]?.additionalFields?.fields?.[0]?.value?.helpText);
      let temp_data = rawData?.ServiceDefinitions?.[0]?.attributes;
      let formatted_data = temp_data.map((item) => item.additionalFields?.fields?.[0]?.value);
      let nvd = formatted_data.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
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

  useEffect(() => {
    const currentTime = new Date();
    if (viewData !== null) {
      setConfig(checklistCreateConfig(viewData, currentTime, "update"));
    }
  }, [viewData]);

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
    // Check parentOption FIRST - if a sub-question was added under an option's dependency,
    // it should go to the option's subQuestions, not the question's
    clonedQuestions.forEach((question) => {
      if (question.parentId) {
        const parentOption = optionMap.get(question.parentId);
        const parentQuestion = questionMap.get(question.parentId);

        if (parentOption) {
          parentOption.subQuestions.push(question);
        } else if (parentQuestion) {
          parentQuestion.subQuestions.push(question);
        }
      } else {
        organizedQuestions.push(question);
      }
    });

    return organizedQuestions;
  }

  const { data: searchLocalisationData, refetch } = Digit.Hooks.campaign.useSearchLocalisation({
    tenantId: tenantId,
    locale: currentLocales,
    module: module,
    isMultipleLocale: currentLocales?.length > 1 ? true : false,
    config: {
      staleTime: Infinity,
      cacheTime: Infinity,
      select: (data) => {
        return data;
      },
    },
  });

  function enrichLocalizationData(localArray, searchLocalizationData) {
    const existingCodeLocales = localArray.map((item) => `${item.code}|${item.locale}`);

    const entriesToAdd = searchLocalizationData?.filter((searchItem) => {
      const codeLocaleKey = `${searchItem.code}|${searchItem.locale}`;

      return existingCodeLocales.includes(codeLocaleKey) === false && localArray.some((localItem) => localItem.code === searchItem.code);
    });
    return [...entriesToAdd];
  }

  const LocalisationCodeUpdate = (temp) => {
    if (!temp || temp === undefined || temp === null) {
      return "";
    }
    return temp.toUpperCase().replace(/ /g, "_");
  };

  const generateCodes = (questions) => {
    const codes = {};
    const local = [];
    let activeCounters = { top: 0 }; // Track active question counts at each level

    // Precompute common values once
    let checklistTypeTemp = LocalisationCodeUpdate(checklistType);
    if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
    let roleTemp = LocalisationCodeUpdate(role);
    let helpTextCode = LocalisationCodeUpdate(helpText);

    // Add the new static entries to localization data
    local.push(
      {
        code: `${campaignName}.${checklistTypeTemp}.${roleTemp}`,
        locale: locale,
        message: `${t(checklistTypeLocal)} ${t(roleLocal)}`,
        module: "hcm-checklist",
      },
      {
        code: `${campaignName}.${checklistTypeTemp}.${roleTemp}.${helpTextCode}`,
        locale: locale,
        message: helpText || ".",
        module: "hcm-checklist",
      }
    );
    // Helper function to generate codes recursively
    const generateCode = (question, prefix, index, parentCounter = "") => {
      // Generate code regardless of isActive status
      let code = "";
      if (question.parentId === null) {
        code = `SN${index + 1}`;
        // Only increment counter for active questions
        if (question.isActive) {
          activeCounters.top += 1;
          parentCounter = String(activeCounters.top);
        }
      } else {
        code = `${prefix}.SN${index + 1}`;

        // Initialize counter for this nesting level if it doesn't exist
        const nestingKey = prefix || "root";
        if (!activeCounters[nestingKey]) {
          activeCounters[nestingKey] = 0;
        }

        // Only increment counter for active questions
        if (question.isActive) {
          activeCounters[nestingKey] += 1;
          // Build the counter string (e.g., "2.1" or "2.1.3")
          parentCounter = parentCounter + "." + activeCounters[nestingKey];
        }
      }

      codes[question.id] = code;

      let moduleChecklist = "hcm-checklist";
      let checklistTypeTemp = LocalisationCodeUpdate(checklistType);
      let roleTemp = LocalisationCodeUpdate(role);
      if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;

      // Format the final string with the code (generate for all questions)
      let formattedString = `${campaignName}.${checklistTypeTemp}.${roleTemp}.${code}`;

      // Only add message with numbering for active questions
      if (question.isActive) {
        const msg = `${parentCounter}) ${String(question.title)}`;
        const obj = {
          code: formattedString,
          message: String(msg),
          module: moduleChecklist,
          locale: locale,
        };
        local.push(obj);
      }

      // Process options
      if (question.options) {
        question.options.forEach((option, optionIndex) => {
          const optionval = option.label;
          const upperCaseString = optionval.toUpperCase();
          const transformedString = upperCaseString.replace(/ /g, "_");

          if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
          let formattedStringTemp = `${campaignName}.${checklistTypeTemp}.${roleTemp}.${transformedString}`;

          // Generate codes for options regardless of question's active status
          const obj = {
            code: formattedStringTemp,
            message: String(optionval),
            module: moduleChecklist,
            locale: locale,
          };
          local.push(obj);

          // Process subquestions under options
          if (option.subQuestions) {
            const optionNestingKey = `${code}.${transformedString}`;
            activeCounters[optionNestingKey] = 0;

            option.subQuestions.forEach((subQuestion, subQuestionIndex) => {
              generateCode(subQuestion, `${code}.${transformedString}`, subQuestionIndex, question.isActive ? parentCounter : "");
            });
          }
        });
      }

      // Process direct subquestions
      if (question.subQuestions) {
        // Reset counter for this level of subquestions
        activeCounters[code] = 0;

        question.subQuestions.forEach((subQuestion, subQuestionIndex) => {
          generateCode(subQuestion, code, subQuestionIndex, question.isActive ? parentCounter : "");
        });
      }
    };

    // Process all top-level questions
    questions.forEach((question, index) => {
      if (question.parentId === null) {
        generateCode(question, "", index);
      }
    });

    return { codes: codes, local: local };
  };

  function getFilteredLocaleEntries(quesArray, localeArray, helpText = "") {
    const messages = new Set();
    let activeCount = 0;

    if (helpText?.trim()) {
      messages.add(helpText.trim());
    }

    function traverseQuestions(questions, prefix = "") {
      questions.forEach((question, qIndex) => {
        if (!question?.isActive) return;

        const currentPrefix = prefix ? `${prefix}.${qIndex + 1}` : `${++activeCount}`;
        const formattedPrefix = `${currentPrefix}) `;

        if (question.title) messages.add(formattedPrefix + question.title.trim());
        if (question.helpText) messages.add(question.helpText.trim());

        if (Array.isArray(question.options)) {
          question.options.forEach((option) => {
            if (option.label) messages.add(option.label.trim());

            if (Array.isArray(option.subQuestions)) {
              traverseQuestions(option.subQuestions, currentPrefix);
            }
          });
        }

        if (Array.isArray(question.subQuestions)) {
          traverseQuestions(question.subQuestions, currentPrefix);
        }
      });
    }

    traverseQuestions(quesArray);

    const filteredLocales = localeArray.filter((entry) => messages.has(entry.message?.trim()));

    return filteredLocales;
  }

  function freshMessage(currentLocalisationData, enrichedArray) {
    const common = enrichedArray.filter((enrichedItem) => {
      const match = currentLocalisationData.find((localItem) => {
        const localeMessage = localItem[enrichedItem.locale]; // e.g., en_IN
        return localItem.code === enrichedItem.code && localItem.module === enrichedItem.module && localeMessage === enrichedItem.message;
      });
      return match !== undefined;
    });

    setLocalisationData(common);

    return common;
  }

  // Helper function remains unchanged as it already handles both active and inactive questions
  function createQuestionObject(item, tenantId, idCodeMap) {
    let labelsArray = [];
    if (item?.options) {
      labelsArray = item.options.map((option) => {
        const optionval = option?.label || "";
        const upperCaseString = optionval.toUpperCase();
        return upperCaseString.replace(/ /g, "_");
      });
    }
    if (String(item?.type?.code) === "SingleValueList") {
      labelsArray.push("NOT_SELECTED");
    }

    const questionObject = {
      id: item.id,
      tenantId: tenantId,
      code: idCodeMap[item.id],
      dataType: String(item?.type?.code),
      values: String(item?.type?.code) === "SingleValueList" || String(item?.type?.code) === "MultiValueList" ? labelsArray : null,
      required: item?.isRequired,
      isActive: item?.isActive,
      reGex: item?.isRegex ? item?.regex?.regex : null,
      order: item?.key,
      additionalFields: {
        schema: "serviceDefinition",
        version: 1,
        fields: [
          {
            key: crypto.randomUUID(), // Using crypto.randomUUID() for a unique key
            value: item,
          },
        ],
      },
    };

    return questionObject;
  }

  // Recursive function to traverse the question array and its nested subquestions
  function transformQuestions(questions, tenantId, idCodeMap) {
    const result = [];

    questions.forEach((question) => {
      // Create the main question object
      const questionObject = createQuestionObject(question, tenantId, idCodeMap);
      result.push(questionObject);

      // Handle subQuestions
      if (question.subQuestions && question.subQuestions.length > 0) {
        const subQuestions = transformQuestions(question.subQuestions, tenantId, idCodeMap);
        result.push(...subQuestions);
      }

      // Handle options with subQuestions
      if (question.options && question.options.length > 0) {
        question.options.forEach((option) => {
          if (option.subQuestions && option.subQuestions.length > 0) {
            const optionSubQuestions = transformQuestions(option.subQuestions, tenantId, idCodeMap);
            result.push(...optionSubQuestions);
          }
        });
      }
    });

    return result;
  }
  let uniqueLocal;

  const payloadData = (data) => {
    data.forEach((question) => {
      if (question.type.code === "Short Answer") {
        question.type.code = "String";
        delete question.options;
      }
    });

    processedData = organizeQuestions(data);
    let { codes, local } = generateCodes(processedData);
    // let codes = generateCodes(processedData);
    let final_payload = transformQuestions(processedData, tenantId, codes);

    const fp = final_payload.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id || t.code === value.code));
    uniqueLocal = local.filter((value, index, self) => index === self.findIndex((t) => JSON.stringify(t.code) === JSON.stringify(value.code)));
    let checklistTypeTemp = checklistType.toUpperCase().replace(/ /g, "_");
    let roleTemp = role.toUpperCase().replace(/ /g, "_");
    if (checklistTypeCode) checklistTypeTemp = checklistTypeCode;
    let code_of_checklist = `${campaignName}.${checklistTypeTemp}.${roleTemp}`;
    return {
      tenantId: tenantId,
      // code: role,
      code: code_of_checklist,
      isActive: curActive,
      attributes: fp,
      additionalFields: {
        schema: "serviceDefinition",
        version: 1,
        fields: [
          {
            key: crypto.randomUUID(), // Using crypto.randomUUID() for a unique key
            value: {
              name: checklistName,
              type: checklistType,
              role: role,
              helpText: helpText,
            },
          },
        ],
      },
    };
  };

  const onSubmit = async (formData, flag = 0, preview = null, translations) => {
    let payload;
    if (flag === 1) {
      payload = payloadData(preview);
    } else {
      payload = payloadData(formData?.createQuestion?.questionData);
    }
    let allLocalisations = [...uniqueLocal, ...translations].filter(
      (value, index, self) => index === self.findIndex((t) => t.code === value.code && t.locale === value.locale)
    );
    setSubmitting(true);
    try {
      const groupedByLocale = allLocalisations.reduce((acc, entry) => {
        acc[entry.locale] = acc[entry.locale] || [];
        acc[entry.locale].push(entry);
        return acc;
      }, {});

      // Process each locale group
      for (const [localeCode, entries] of Object.entries(groupedByLocale)) {
        const result = await localisationMutateAsync(entries);
        if (!result.success) {
          setShowToast({ label: "LOCALIZATION_FAILED_PLEASE_TRY_AGAIN", isError: "true" });
          return;
        }
      }

      // Proceed to create checklist
      const data = await mutateAsync(payload);

      if (data.success) {
        // Replace with your actual condition
        refetch();
        navigate(`/${window.contextPath}/employee/campaign/response?isSuccess=${true}`, {
          state: {
            message: "ES_CHECKLIST_UPDATE_SUCCESS_RESPONSE",
            preText: "ES_CHECKLIST_UPDATE_SUCCESS_RESPONSE_PRE_TEXT",
            // actionLabel: "HCM_CONFIGURE_APP_RESPONSE_ACTION",
            actionLink: `/${window.contextPath}/employee/campaign/checklist/search?name=${campaignName}&campaignId=${campaignId}&projectType=${projectType}&campaignNumber=${campaignNumber}`,
            secondaryActionLabel: "MY_CAMPAIGN",
            secondaryActionLink: `/${window?.contextPath}/employee/campaign/my-campaign-new`,
          },
        });
      } else {
        setShowToast({ label: "CHECKLIST_UPDATE_FAILED", isError: "true" });
      }
    } catch (error) {
      // Handle error scenario
      setShowToast({ label: "CHECKLIST_UPDATE_FAILED", isError: "true" });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (showToast !== null) {
      setShowPopUp(false);
    }
  }, [showToast]);

  const name = t(`${checklistTypeLocal}`) + " " + t(`${roleLocal}`);
  const fieldPairs = [
    { label: "CHECKLIST_ROLE", value: roleLocal },
    { label: "TYPE_OF_CHECKLIST", value: checklistTypeLocal },
    { label: "CAMPAIGN_NAME", value: campaignName },
    // { label: "CHECKLIST_HELP_TEXT", value: helpText }
    // { label: "CHECKLIST_NAME", value: name}
  ];

  if (isLoading || !searchLocalisationData || searchLocalisationData?.length === 0) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  return (
    <div>
      {/* {submitting && <Loader />} */}
      {!submitting && (
        <div>
          <TagComponent campaignName={campaignName} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "Roboto Condensed",color:"#0b4b66" }}>{t("UPDATE_CHECKLIST")}</h2>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                icon="Preview"
                variation="secondary"
                label={t("PREVIEW_CHECKLIST")}
                title={t("PREVIEW_CHECKLIST")}
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
              heading={t("CHECKLIST_PREVIEW")}
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
                  label={t("CLOSE")}
                  title={t("CLOSE")}
                  onClick={() => {
                    setShowPopUp(false);
                  }}
                />,
                <Button
                  type={"button"}
                  size={"large"}
                  variation={"primary"}
                  label={t("CONFIRM_CHECKLIST_CONFIGURATION")}
                  title={t("CONFIRM_CHECKLIST_CONFIGURATION")}
                  onClick={() => {
                    const processed = organizeQuestions(tempFormData);
                    const { local: generatedLocal } = generateCodes(processed);
                    const currentLocalisationData = getFilteredLocaleEntries(processed, generatedLocal);
                    const enrichedArray = enrichLocalizationData(generatedLocal, searchLocalisationData);
                    const fresh = freshMessage(currentLocalisationData, enrichedArray);
                    setShowLocalisationPopup(true);
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
              <div style={{ display: "flex" ,gap:"1.5rem"}}>
                <div style={{ width: "20%", fontWeight: "500"}}>{t("CHECKLIST_HELP_TEXT")}</div>
                <TextArea
                  disabled={false}
                  className="tetxinput-example"
                  // type={"text"}
                  name={t("CHECKLIST_HELP_TEXT")}
                  value={helpText}
                  onChange={(event) => setHelpText(event.target.value)}
                  placeholder={t("CHECKLIST_HELP_TEXT_PALCEHOLDER")}
                />
              </div>
            }
          </Card>
          <div style={{ height: "1rem" }}></div>
          {!isLoading && (
            <FormComposerV2
              showMultipleCardsWithoutNavs={true}
              label={t("UPDATE_CHECKLIST")}
              config={config}
              onSubmit={popShow}
              fieldStyle={{ marginRight: 0 }}
              noBreakLine={true}
              onFormValueChange={onFormValueChange}
              actionClassName={"checklistCreate"}
              noCardStyle={true}
            />
          )}
          {showToast && (
            <Toast type={showToast?.isError ? "error" : "success"} label={t(showToast?.label)} isDleteBtn={"true"} onClose={() => closeToast()} />
          )}
          {showLocalisationPopup && (
            <PopUp
              className="localisation-popup-container"
              heading={t("ADD_TRANSLATIONS")}
              onClose={() => setShowLocalisationPopup(false)}
              onOverlayClick={() => setShowLocalisationPopup(false)}
            >
              <LocalisationEditorPopup
                locales={currentLocales.filter((local) => local !== locale)}
                currentLocale={locale}
                languages={languages.filter((item) => item.value !== locale)}
                localisationData={localisationData}
                onSave={(translations) => {
                  onSubmit(null, 1, tempFormData, translations);
                }}
                onClose={() => setShowLocalisationPopup(false)}
              />
            </PopUp>
          )}
        </div>
      )}
      <div style={{ height: "2rem" }}></div>
    </div>
  );
};

export default UpdateChecklist;
