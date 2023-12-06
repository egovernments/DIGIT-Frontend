import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";
import { CardLabel, Header, Card, LabelFieldPair, DownloadIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { CustomDropdown } from "@egovernments/digit-ui-react-components";
import BulkUpload from "../../components/BulkUpload";
import { Button } from "@egovernments/digit-ui-react-components";
import GenerateXlsx from "../../components/GenerateXlsx";
import { useHistory } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-react-components";

const UploadBoundary = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const stateId = Digit.ULBService.getStateId();
  const [selectedValue, setSelectedValue] = useState(null);
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);

  const callInputClick = async (event) => {
    inputRef.current.click();
  };

  const handleCreateNewHierarchyType = () => {
    history.push(`/${window?.contextPath}/employee/workbench/create-boundary-hierarchy-type`);
  };

  const handleHierarchyTypeChange = (selectedValue) => {
    setSelectedValue(selectedValue);
  };

  const reqCriteriaBoundaryHierarchySearch = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: stateId,
      },
    },
    config: {
      enabled: true,
    },
  };
  const { data: hierarchyTypeData } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryHierarchySearch);

  const filteredXlsxData = hierarchyTypeData?.BoundaryHierarchy?.filter((item) => {
    return item.hierarchyType === selectedValue?.hierarchyType;
  });

  const reqCriteriaBoundaryAdd = {
    url: `/boundary-service/boundary/_create`,
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaBoundaryAdd);

  const reqCriteriaBoundaryHierarchyAdd = {
    url: `/boundary-service/boundary-relationships/_create`,
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };

  const mutationHierarchy = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaBoundaryHierarchyAdd);

  const formattedHierarchyTypes = hierarchyTypeData?.BoundaryHierarchy?.map((item) => ({ hierarchyType: item.hierarchyType }));

  const hierarchyTypeDropdownConfig = {
    label: "WBH_LOC_LANG",

    type: "dropdown",
    isMandatory: false,
    disable: false,
    populators: {
      name: "hierarchyType",
      optionsKey: "hierarchyType",
      options: formattedHierarchyTypes,
      optionsCustomStyle: { top: "2.3rem" },
      styles: { width: "50%" },
    },
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const onBulkUploadSubmit = async (file) => {
    try {
      const results = await Digit.Utils.parsingUtils.parseMultipleXlsToJson(file);
      const flattenedArray = results.flatMap((item) => Object.values(item));
      const uniqueValues = Array.from(new Set(flattenedArray));

      await mutation.mutate(
        {
          params: {},
          body: {
            Boundary: uniqueValues.map((value) => ({
              tenantId: stateId,
              code: value,
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [77.17291599436169, 28.56784947815504],
                    [70.11625206763327, 22.50321664965992],
                    [77.5811911123439, 13.05708693840623],
                    [86.42557425986286, 23.774571851935193],
                    [77.17291599436169, 28.56784947815504],
                  ],
                ],
              },
            })),
          },
        },
        {
          onError: (resp) => {
            let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            resp?.response?.data?.Errors?.map((err, idx) => {
              if (idx === resp?.response?.data?.Errors?.length - 1) {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
              } else {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
              }
            });
            setShowToast({ label, isError: true });
            closeToast();
          },
          onSuccess: async (data) => {
            if (data?.ResponseInfo?.status === "successful") {
              const dynamicParentType = Digit.Utils.workbench.generateDynamicParentType(results);
              const transformedData = Digit.Utils.workbench.transformBoundary(results, dynamicParentType);

              // Show loading toast while API calls are in progress
              setShowToast({ label: "Loading..." });

              // Use Promise.all to wait for all API calls to complete
              await Promise.all(
                Object.keys(transformedData).map(async (key) => {
                  for (const entry of transformedData[key]) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    await mutationHierarchy.mutate(
                      {
                        params: {},
                        body: {
                          BoundaryRelationship: {
                            tenantId: stateId,
                            code: entry.code,
                            hierarchyType: selectedValue?.hierarchyType,
                            boundaryType: key,
                            parent: entry.parent || null,
                          },
                        },
                      },
                      {
                        onError: () => {},
                        onSuccess: (resp) => {
                          console.log("ressss", resp);
                        },
                      }
                    );
                  }
                })
              );

              // All API calls are done, show final success toast
              setShowToast({ label: `${t("WBH_LOC_UPSERT_SUCCESS")}` });
              closeToast();
            }
          },
        }
      );
    } catch (error) {
      console.log("error", error);
      let label = `${t("WBH_LOC_UPSERT_FAIL")}: `;

      setShowToast({ label, isError: true });
    }
  };

  return (
    <React.Fragment>
      <Header className="works-header-search">{t("WBH_UPLOAD_BOUNDARY")}</Header>
      <Card className="workbench-create-form">
        <Header className="digit-form-composer-sub-header">{t("WBH_UPLOAD_BOUNDARY")}</Header>

        <LabelFieldPair style={{ alignItems: "flex-start", paddingLeft: "1rem" }}>
          <CardLabel style={{ marginBottom: "0.4rem", fontWeight: "700" }}>{t("WBH_HIERARCHY_TYPE")}</CardLabel>
          <CustomDropdown
            t={t}
            config={hierarchyTypeDropdownConfig.populators}
            onChange={handleHierarchyTypeChange}
            type={hierarchyTypeDropdownConfig.type}
            disable={hierarchyTypeDropdownConfig?.disable}
          />
        </LabelFieldPair>
        <LabelFieldPair style={{ alignItems: "flex-start", paddingLeft: "1rem" }}>
          <CardLabel style={{ marginBottom: "0.4rem", fontSize: "1.25rem", fontStyle: "Italic" }}>{t("WBH_UNABLE_TO_FIND_HIERARCHY_TYPE")}</CardLabel>
          <Button
            label={t("WBH_CREATE_HIERARCHY")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: ".692rem", width: ".692rem" }} fill="#F47738" />}
            type="button"
            className="workbench-download-template-btn"
            onButtonClick={handleCreateNewHierarchyType}
            style={{ fontSize: "1rem" }}
          />
        </LabelFieldPair>
      </Card>
      <Card className="workbench-create-form">
        <div className="workbench-bulk-upload">
          <Header className="digit-form-composer-sub-header">{t("WBH_LOC_BULK_UPLOAD_XLS")}</Header>
          <Button
            label={t("WBH_DOWNLOAD_TEMPLATE")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
            type="button"
            className="workbench-download-template-btn"
            isDisabled={!selectedValue}
            onButtonClick={callInputClick}
          />
          <GenerateXlsx inputRef={inputRef} jsonData={filteredXlsxData} />
        </div>
        <BulkUpload onSubmit={onBulkUploadSubmit} />
        {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
      </Card>
    </React.Fragment>
  );
};

export default UploadBoundary;
