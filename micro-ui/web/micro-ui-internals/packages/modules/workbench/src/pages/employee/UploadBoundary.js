import React, { useState, useEffect, useReducer, useMemo, useRef, useCallback } from "react";
import { CardLabel, Header, Card, LabelFieldPair, DownloadIcon , Toast , Button , CustomDropdown} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import BulkUpload from "../../components/BulkUpload";
import GenerateXlsx from "../../components/GenerateXlsx";
import { useHistory } from "react-router-dom";

const UploadBoundary = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
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

  const simplifiedData = filteredXlsxData?.[0]?.boundaryHierarchy.map((item) => item.boundaryType);

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
    url: "/project-factory/v1/data/_autoGenerateBoundaryCode",
    params: {},
    body: {
      ResourceDetails: {},
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(requestCriteriaBulkUpload);

  const onBulkUploadSubmit = async (file) => {
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
            setShowToast({ label, isError: true });
            closeToast();
          },
        }
      );
      
    } catch (error) {
      let label = `${t("WBH_BOUNDARY_UPSERT_FAIL")}: `;
      setShowToast({ label, isError: true });
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
          <GenerateXlsx inputRef={inputRef} jsonData={[simplifiedData]} skipHeader={true} />
        </div>
        <BulkUpload onSubmit={onBulkUploadSubmit} />
        {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
      </Card>
    </React.Fragment>
  );
};

export default UploadBoundary;
