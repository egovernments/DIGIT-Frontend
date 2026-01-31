import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";
import { CardLabel, Header, Card, LabelFieldPair, DownloadIcon, Button, CustomDropdown } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import BulkUpload from "../../components/BulkUpload";
import GenerateXlsx from "../../components/GenerateXlsx";
import { useHistory } from "react-router-dom";
import XLSX from "xlsx";
import { COLOR_FILL } from "../../utils/contants";

const UploadBoundary = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedValue, setSelectedValue] = useState(null);
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);
  const [success , setSuccess] = useState(false);

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

  const simplifiedData = filteredXlsxData?.[0]?.boundaryHierarchy.map((item) => item.boundaryType);

  const modifiedHierarchy = simplifiedData?.map(ele => t((`${selectedValue?.hierarchyType}_${ele}`).toUpperCase()));

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

  const requestCriteriaBulkUpload = {
    url: "/project-factory/v1/data/_create",
    params: {},
    body: {
      ResourceDetails: {},
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(requestCriteriaBulkUpload);

  const validateHeaderRow = (headerRow) => {
    const expectedHeaders = modifiedHierarchy;

    // Check each header in the headerRow against the corresponding header in expectedHeaders
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i] !== expectedHeaders[i]) {
        const boundary = t(`HCM_${headerRow[i].replace(/\s+/g, '_').toUpperCase()}`);
        if(boundary === t("HCM_BOUNDARY_CODE")){
          continue;
        }
        return false;
      }
    }
    // All headers match
    return true;
  };

  const validateExcel = (selectedFile) => {
    return new Promise((resolve, reject) => {
      // Check if a file is selected
      if (!selectedFile) {
        reject(t("HCM_FILE_UPLOAD_ERROR"));
        return;
      }

      // Read the Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Assuming your columns are in the first sheet
          const sheet = workbook.Sheets[workbook.SheetNames[0]];

          const columnsToValidate = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
          })[0];

          if (validateHeaderRow(columnsToValidate)) {
            resolve(true);
          } else {
            const label = "HCM_FILE_VALIDATION_ERROR";
            setShowToast({ type: "error", label });
            closeToast();
          }
        } catch (error) {
          console.log("error", error);
          reject("HCM_FILE_UNAVAILABLE");
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    });
  };

  const onBulkUploadSubmit = async (file) => {
    // Validate the header row
    const validate = await validateExcel(file[0]);
    if (!validateExcel(file[0])) {
      return;
    }
    try {
      const module = "HCM";
      const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, file, tenantId);
      await mutation.mutate(
        {
          params: {},
          body: {
            ResourceDetails: {
              tenantId: tenantId,
              type: "boundary",
              fileStoreId: fileStoreIds?.[0]?.fileStoreId,
              action: "create",
              hierarchyType: selectedValue?.hierarchyType,
              additionalDetails: {},
            },
          },
        },
        {
          onSuccess: () => {
            setShowToast({ label: `${t("WBH_CAMPAIGN_CREATED")}` });
            closeToast();
            setSuccess(true);
            setSelectedValue(null);
          },
          onError: (resp) => {
            let label = `${t("WBH_BOUNDARY_CREATION_FAIL")}: `;
            resp?.response?.data?.Errors?.map((err, idx) => {
              if (idx === resp?.response?.data?.Errors?.length - 1) {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
              } else {
                label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
              }
            });
            setShowToast({ label, type: "error" });
            closeToast();
          },
        }
      );
    } catch (error) {
      let label = `${t("WBH_BOUNDARY_UPSERT_FAIL")}: `;
      setShowToast({ label, type: "error" });
      closeToast();
    }
  };

  return (
    <React.Fragment>
      <Header className="works-header-search">{t("HCM_UPLOAD_BOUNDARY")}</Header>
      <Card className="workbench-create-form">
        <Header className="digit-form-composer-sub-header">{t("WBH_HIERARCHY_DETAILS")}</Header>

        <LabelFieldPair style={{ alignItems: "flex-start", paddingLeft: "1rem" }}>
          <CardLabel style={{ marginBottom: "0.4rem", fontWeight: "700" }}>{t("WBH_HIERARCHY_TYPE")}</CardLabel>
          <CustomDropdown
            t={t}
            config={hierarchyTypeDropdownConfig.populators}
            onChange={handleHierarchyTypeChange}
            type={hierarchyTypeDropdownConfig.type}
            disable={hierarchyTypeDropdownConfig?.disable}
            value={selectedValue}
          />
        </LabelFieldPair>
        <LabelFieldPair style={{ alignItems: "flex-start", paddingLeft: "1rem" }}>
          <CardLabel style={{ marginBottom: "0.4rem", fontSize: "1.25rem", fontStyle: "Italic" }}>{t("WBH_UNABLE_TO_FIND_HIERARCHY_TYPE")}</CardLabel>
          <Button
            label={t("WBH_CREATE_HIERARCHY")}
            variation="secondary"
            icon={<DownloadIcon styles={{ height: ".692rem", width: ".692rem" }} fill={COLOR_FILL} />}
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
            icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill={COLOR_FILL} />}
            type="button"
            className="workbench-download-template-btn"
            isDisabled={!selectedValue}
            onButtonClick={callInputClick}
          />
          <GenerateXlsx inputRef={inputRef} jsonData={[modifiedHierarchy]} skipHeader={true} sheetName="Boundary Data"/>
        </div>
        <BulkUpload onSubmit={onBulkUploadSubmit} onSuccess={success} />
        {showToast && <Toast label={showToast?.label} type={showToast?.type} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
      </Card>
    </React.Fragment>
  );
};

export default UploadBoundary;
