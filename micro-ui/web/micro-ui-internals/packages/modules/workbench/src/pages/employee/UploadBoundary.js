import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";
import { CardLabel, Header, Card, LabelFieldPair, DownloadIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { CustomDropdown } from "@egovernments/digit-ui-react-components";
import BulkUpload from "../../components/BulkUpload";
import { Button } from "@egovernments/digit-ui-react-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import { SubmitBar } from "@egovernments/digit-ui-react-components";
import GenerateXlsx from "../../components/GenerateXlsx";

const UploadBoundary = () => {
  const { t } = useTranslation();
  const [selectedHierarchyType, setHierarchyType] = useState(null);
  const inputRef = useRef(null);
  const stateId = Digit.ULBService.getStateId();
  const [selectedValue, setSelectedValue] = useState(null);

  const [getData, setdata] = useState([]);

  const [filesFromBulkUpload, setFilesFromBulkUpload] = useState([]);
  const [upsertResult, setUpsertResult] = useState(null);
  const [isMutationSuccessful, setIsMutationSuccessful] = useState(false);

  console.log("employee", selectedValue);
  const hierarchyTypeDropdownConfig = {
    label: "WBH_LOC_LANG",

    type: "dropdown",
    isMandatory: false,
    disable: false,
    populators: {
      name: "hierarchyTpe",
      optionsKey: "label",
      options: [{ label: "REVENUE" }, { label: "ADMIN" }, { label: "TAX" }],
      optionsCustomStyle: { top: "2.3rem" },
      styles: { width: "50%" },
    },
  };

  const callInputClick = async (event) => {
    inputRef.current.click();
  };

  const handleHierarchyTypeChange = (selectedValue) => {
    setSelectedValue(selectedValue);
  };

  const reqCriteriaAdd = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: stateId,
        hierarchyType: selectedValue?.label,
      },
    },
    config: {
      enabled: selectedValue !== null,
    },
  };
  const { isLoading, data: hierarchyTypeData, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaAdd);

  useEffect(() => {
    if (selectedValue !== null) {
      setdata(hierarchyTypeData?.BoundaryHierarchy?.boundaryHierarchy);

      refetch();
    }
  }, [selectedValue, refetch]);

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

  // const onBulkUploadSubmit = async (file) => {
  //   try {
  //     const results = await Digit.Utils.parsingUtils.parseMultipleXlsToJson(file);
  //     const flattenedArray = results.flatMap((item) => Object.values(item));
  //     const uniqueValues = Array.from(new Set(flattenedArray));

  //     await mutation.mutate(
  //       {
  //         params: {},
  //         body: {
  //           Boundary: uniqueValues.map((value) => ({
  //             tenantId: stateId,
  //             code: value,
  //             geometry: {
  //               type: "Polygon",
  //               coordinates: [
  //                 [
  //                   [77.17291599436169, 28.56784947815504],
  //                   [70.11625206763327, 22.50321664965992],
  //                   [77.5811911123439, 13.05708693840623],
  //                   [86.42557425986286, 23.774571851935193],
  //                   [77.17291599436169, 28.56784947815504],
  //                 ],
  //               ],
  //             },
  //           })),
  //         },
  //       },
  //       {
  //         onError: () => {},
  //         onSuccess: (data, variables, context) => {
  //           if (data?.ResponseInfo?.status === "successful") {
  //             setIsMutationSuccessful(true);
  //             console.log("isMutationSuccessful updated:", isMutationSuccessful);
  //           }
  //         },
  //       }
  //     );

  //     if (isMutationSuccessful) {
  //       const dynamicParentType = Digit.Utils.workbench.generateDynamicParentType(results);
  //       const transformedData = Digit.Utils.workbench.transformBoundary(results, dynamicParentType);
  //       Object.keys(transformedData).forEach((key) => {
  //         transformedData[key].forEach(async (entry) => {
  //           await mutationHierarchy.mutate(
  //             {
  //               params: {},
  //               body: {
  //                 BoundaryRelationship: {
  //                   tenantId: stateId,
  //                   code: entry.code,
  //                   hierarchyType: selectedValue?.label,
  //                   boundaryType: key,
  //                   parent: entry.parent || null,
  //                 },
  //               },
  //             },
  //             {
  //               onError: () => {},
  //               onSuccess: () => {},
  //             }
  //           );
  //         });
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
          onError: () => {},
          onSuccess: async (data, variables, context) => {
            if (data?.ResponseInfo?.status === "successful") {
              setIsMutationSuccessful(true);

              const dynamicParentType = Digit.Utils.workbench.generateDynamicParentType(results);
              const transformedData = Digit.Utils.workbench.transformBoundary(results, dynamicParentType);
              for (const key of Object.keys(transformedData)) {
                for (const entry of transformedData[key]) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));

                  await mutationHierarchy.mutate(
                    {
                      params: {},
                      body: {
                        BoundaryRelationship: {
                          tenantId: stateId,
                          code: entry.code,
                          hierarchyType: selectedValue?.label,
                          boundaryType: key,
                          parent: entry.parent || null,
                        },
                      },
                    },
                    {
                      onError: () => {},
                      onSuccess: () => {},
                    }
                  );
                }
              }
            }
          },
        }
      );
    } catch (error) {
      console.log(error);
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
          <GenerateXlsx inputRef={inputRef} jsonData={hierarchyTypeData?.BoundaryHierarchy?.boundaryHierarchy} />
        </div>
        <BulkUpload onSubmit={onBulkUploadSubmit} />
      </Card>
    </React.Fragment>
  );
};

export default UploadBoundary;
