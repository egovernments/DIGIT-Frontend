import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import * as Icons from "@egovernments/digit-ui-svg-components";
import { FileUploader } from "react-drag-drop-files";
import { convertJsonToXlsx } from "../../utils/jsonToExcelBlob";
import { parseXlsxToJsonMultipleSheets } from "../../utils/exceltojson";
import { ModalWrapper } from "../../components/Modal";
import { checkForErrorInUploadedFileExcel } from "../../utils/excelValidations";
import { geojsonPropetiesValidation, geojsonValidations } from "../../utils/geojsonValidations";
import JSZip from "jszip";
import { SpatialDataPropertyMapping } from "../../components/resourceMapping";
import shp from "shpjs";
import { JsonPreviewInExcelForm } from "../../components/JsonPreviewInExcelForm";
import { ButtonType1, ButtonType2, ModalHeading } from "../../components/ComonComponents";
import { Loader, Toast } from "@egovernments/digit-ui-components";

const Upload = ({
  MicroplanName = "default",
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
}) => {
  const { t } = useTranslation();

  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [
    { name: "UploadConfiguration" },
    { name: "UIConfiguration" },
    { name: "Schemas" },
  ]);

  // States
  const [editable, setEditable] = useState(true);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modal, setModal] = useState("none");
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [dataPresent, setDataPresent] = useState(false);
  const [dataUpload, setDataUpload] = useState(false);
  const [loaderActivation, setLoderActivation] = useState(false);
  const [fileData, setFileData] = useState();
  const [toast, setToast] = useState();
  const [uploadedFileError, setUploadedFileError] = useState();
  const [fileDataList, setFileDataList] = useState({});
  const [validationSchemas, setValidationSchemas] = useState([]);
  const [template, setTemplate] = useState([]);
  const [resourceMapping, setResourceMapping] = useState([]);
  const [previewUploadedData, setPreviewUploadedData] = useState();
  const [uploadGuideLines, setUploadGuideLines] = useState();

  //fetch campaign data
  const { id = "" } = Digit.Hooks.useQueryParams();
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.microplan.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        id,
      },
    },
    {
      enabled: !!id,
    }
  );

  // request body for boundary hierarchy api
  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        hierarchyType: campaignData?.hierarchyType,
      },
    },
    config: {
      enabled: !!campaignData?.hierarchyType,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.map((item) => item?.boundaryType) || {};
      },
    },
  };
  const { isLoading: ishierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // UseEffect for checking completeness of data before moveing to next section
  useEffect(() => {
    if (!fileDataList || checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    const valueList = fileDataList ? Object.values(fileDataList) : [];
    if (valueList.length !== 0 && fileDataList.Population?.error === null) setCheckDataCompletion("valid");
    else setCheckDataCompletion("invalid");
  }, [checkDataCompletion]);

  // UseEffect to store current data
  useEffect(() => {
    if (!fileDataList || !setMicroplanData) return;
    setMicroplanData((previous) => ({ ...previous, upload: fileDataList }));
  }, [fileDataList]);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (microplanData && microplanData.upload) {
      setFileDataList(microplanData.upload);
    }

    if (pages) {
      const previouspage = pages[currentPage?.id - 1];
      if (previouspage?.checkForCompleteness && !microplanData?.status?.[previouspage?.name]) setEditable(false);
      else setEditable(true);
    }
  }, []);

  // UseEffect to add a event listener for keyboard
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modal]);

  const handleKeyPress = (event) => {
    if (modal !== "upload-guidelines") return;
    if (event.key === "x" || event.key === "Escape") {
      // Perform the desired action when "x" or "esc" is pressed
      if (modal === "upload-guidelines") setModal("none");
    }
  };

  // Effect to update sections and selected section when data changes
  useEffect(() => {
    if (data) {
      let uploadSections = data["hcm-microplanning"]["UploadConfiguration"];
      let schemas = data["hcm-microplanning"]["Schemas"];
      let UIConfiguration = data["hcm-microplanning"]["UIConfiguration"];
      if (UIConfiguration) {
        const uploadGuideLinesList = UIConfiguration.find((item) => item.name === "uploadGuideLines").UploadGuideLineInstructions;
        setUploadGuideLines(uploadGuideLinesList);
      }
      if (schemas) setValidationSchemas(schemas);
      if (uploadSections) {
        setSelectedSection(uploadSections.length > 0 ? uploadSections[0] : null);
        setSections(uploadSections);
      }
    }
  }, [data]);

  // Memoized section options to prevent unnecessary re-renders
  const sectionOptions = useMemo(() => {
    if (!sections) return [];
    return sections.map((item) => (
      <UploadSection key={item.id} item={item} selected={selectedSection.id === item.id} setSelectedSection={setSelectedSection} />
    ));
  }, [sections, selectedSection]);

  // Handler for when a file type is selected for uplaod
  const selectFileTypeHandler = (e) => {
    if (selectedSection && selectedSection.UploadFileTypes) {
      setSelectedFileType(selectedSection.UploadFileTypes.find((item) => item.id === e.target.name));
      setModal("upload-modal");
      return;
    }
    setToast({
      state: "error",
      message: t("ERROR_UNKNOWN"),
    });
    setLoderActivation(false);
    return;
  };

  // Memoized section components to prevent unnecessary re-renders
  const sectionComponents = useMemo(() => {
    if (!sections) return;
    return sections.map((item) => (
      <UploadComponents
        key={item.id}
        item={item}
        selected={selectedSection.id === item.id}
        uploadOptions={item.UploadFileTypes}
        selectedFileType={selectedFileType ? selectedFileType : {}}
        selectFileTypeHandler={selectFileTypeHandler}
      />
    ));
  }, [sections, selectedSection, selectedFileType]);

  // Close model click handler
  const closeModal = () => {
    setResourceMapping([]);
    setModal("none");
  };

  // handler for show file upload screen
  const UploadFileClickHandler = (download = false) => {
    if (download) {
      downloadTemplate(campaignType, selectedFileType.id, selectedSection.id, setToast, template);
    }
    setModal("none");
    setDataUpload(true);
  };

  // Effect for updating current session data in case of section change
  useEffect(() => {
    if (selectedSection) {
      let file = fileDataList?.[`${selectedSection.id}`];
      if (file && file?.file && file?.resourceMapping) {
        setSelectedFileType(selectedSection.UploadFileTypes.find((item) => item?.id === file?.fileType));
        setUploadedFileError(file?.error);
        setFileData(file);
        setDataPresent(true);
      } else {
        resetSectionState();
      }
    } else {
      resetSectionState();
    }
  }, [selectedSection]);

  const resetSectionState = () => {
    setUploadedFileError(null);
    setSelectedFileType(null);
    setDataPresent(false);
    setResourceMapping([]);
    setDataUpload(false);
  };
  // const mobileView = Digit.Utils.browser.isMobile() ? true : false;

  // Function for handling upload file event
  const UploadFileToFileStorage = async (file) => {
    // const response =  await Digit.UploadServices.Filestorage("engagement", file, Digit.ULBService.getStateId());
    try {
      // setting loader
      setLoderActivation(true);
      let check;
      let fileDataToStore;
      let error;
      let response;
      let callMapping = false;
      // Checking if the file follows name convention rules
      if (!validateNamingConvention(file, selectedFileType["namingConvention"], setToast, t)) {
        setLoderActivation(false);
        return;
      }

      let schemaData;
      if (selectedFileType.id !== "Shapefiles") {
        // Check if validation schema is present or not
        schemaData = getSchema(campaignType, selectedFileType.id, selectedSection.id, validationSchemas);
        if (!schemaData) {
          setToast({
            state: "error",
            message: t("ERROR_VALIDATION_SCHEMA_ABSENT"),
          });
          setLoderActivation(false);
          return;
        }
      }

      // Handling different filetypes
      switch (selectedFileType.id) {
        case "Excel":
          // let response = handleExcelFile(file,schemaData);
          try {
            response = await handleExcelFile(file, schemaData);
            check = response.check;
            error = response.error;
            fileDataToStore = response.fileDataToStore;
            if (check === true) {
              setToast({ state: "success", message: t("FILE_UPLOADED_SUCCESSFULLY") });
            } else if (response.toast) {
              setToast(response.toast);
            } else {
              setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
            }
            if (response.interruptUpload) {
              setLoderActivation(false);
              return;
            }
          } catch (error) {
            setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
            handleValidationErrorResponse(t("ERROR_UPLOADED_FILE"));
          }
          break;
        case "Geojson":
          try {
            response = await handleGeojsonFile(file, schemaData);
            file = new File([file], file.name, { type: "application/geo+json" });
            if (response.check == false && response.stopUpload) {
              setLoderActivation(false);
              setToast(response.toast);
              return;
            }
            check = response.check;
            error = response.error;
            fileDataToStore = response.fileDataToStore;
            callMapping = true;
          } catch (error) {
            setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
            handleValidationErrorResponse(t("ERROR_UPLOADED_FILE"));
          }
          break;
        case "Shapefiles":
          try {
            response = await handleShapefiles(file, schemaData);
            file = new File([file], file.name, { type: "application/octet-stream" });
            check = response.check;
            error = response.error;
            fileDataToStore = response.fileDataToStore;
            callMapping = true;
          } catch (error) {
            setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
            handleValidationErrorResponse(t("ERROR_UPLOADED_FILE"));
          }
          break;
        default:
          setToast({
            state: "error",
            message: t("ERROR_UNKNOWN_FILETYPE"),
          });
          setLoderActivation(false);
          return;
      }
      let filestoreId;
      if (!error && !callMapping) {
        try {
          const filestoreResponse = await Digit.UploadServices.Filestorage("microplan", file, Digit.ULBService.getStateId());
          if (filestoreResponse?.data?.files?.length > 0) {
            filestoreId = filestoreResponse?.data?.files[0]?.fileStoreId;
          } else {
            error = t("ERROR_UPLOADING_FILE");
            setToast({ state: "error", message: t("ERROR_UPLOADING_FILE") });
            setFileData((previous) => ({ ...previous, error }));
            setUploadedFileError(error);
          }
        } catch (errorData) {
          error = t("ERROR_UPLOADING_FILE");
          setToast({ state: "error", message: t("ERROR_UPLOADING_FILE") });
          setUploadedFileError(error);
          handleValidationErrorResponse(t("ERROR_UPLOADING_FILE"));
        }
      }
      let resourceMappingData;
      if (!error && selectedFileType.id == "Excel" ) {
        if(schemaData?.schema?.required)
        resourceMappingData = [...schemaData?.schema?.required,...hierarchy].map((item) => ({
          filestoreId,
          mappedFrom: t(item),
          mappedTo: item,
        }));
      }
      // creating a fileObject to save all the data collectively
      let fileObject = {
        id: `${selectedSection.id}`,
        fileName: file.name,
        section: selectedSection.id,
        fileType: selectedFileType.id,
        data: fileDataToStore,
        file,
        error: error ? error : null,
        filestoreId,
        resourceMapping: resourceMappingData,
      };

      setFileData(fileObject);
      setFileDataList((prevFileDataList) => ({ ...prevFileDataList, [fileObject.id]: fileObject }));
      // Digit.SessionStorage.set(fileObject.id, fileObject);
      if (error === undefined && callMapping) setModal("spatial-data-property-mapping");
      setDataPresent(true);
      setLoderActivation(false);
    } catch (error) {
      setUploadedFileError("ERROR_UPLOADING_FILE");
      setLoderActivation(false);
    }
  };

  const handleExcelFile = async (file, schemaData) => {
    // Converting the input file to json format
    let result = await parseXlsxToJsonMultipleSheets(file);
    if (result && result.error) {
      return {
        check: false,
        interruptUpload: true,
        error: result.error,
        fileDataToStore: {},
        toast: { state: "error", message: t("ERROR_CORRUPTED_FILE") },
      };
    }

    // Running Validations for uploaded file
    let response = await checkForErrorInUploadedFileExcel(result, schemaData.schema, t);
    if (!response.valid) setUploadedFileError(response.message);
    let error = response.message;
    let check = response.valid;
    // Converting the file to preserve the sequence of columns so that it can be stored
    let fileDataToStore = await parseXlsxToJsonMultipleSheets(file, { header: 1 });
    return { check, error, fileDataToStore };
  };
  const handleGeojsonFile = async (file, schemaData) => {
    // Reading and checking geojson data
    const data = await readGeojson(file, t);
    if (!data.valid) {
      return { check: false, stopUpload: true, toast: data.toast };
    }
    // Running geojson validaiton on uploaded file
    let response = geojsonValidations(data.geojsonData, schemaData.schema, t);
    if (!response.valid) setUploadedFileError(response.message);
    let check = response.valid;
    let error = response.message;
    let fileDataToStore = data.geojsonData;
    return { check, error, fileDataToStore };
  };
  const handleShapefiles = async (file, schemaData) => {
    // Reading and validating the uploaded geojson file
    let response = await readAndValidateShapeFiles(file, t, selectedFileType["namingConvention"]);
    if (!response.valid) {
      setUploadedFileError(response.message);
      setToast(response.toast);
    }
    let check = response.valid;
    let error = response.message;
    let fileDataToStore = response.data;
    return { check, error, fileDataToStore };
  };

  // Reupload the selected file
  const reuplaodFile = () => {
    setResourceMapping([]);
    setFileData(undefined);
    setDataPresent(false);
    setUploadedFileError(null);
    setDataUpload(false);
    setSelectedFileType(null);
    closeModal();
  };

  // Function for creating blob out of data
  const dataToBlob = () => {
    let blob;
    switch (fileData.fileType) {
      case "Excel":
        blob = fileData.file;
        break;
      case "Shapefiles":
      case "Geojson":
        if (!fileData || !fileData.data) {
          setToast({
            state: "error",
            message: t("ERROR_DATA_NOT_PRESENT"),
          });
          return;
        }
        // Extract keys from the first feature's properties
        const keys = Object.keys(fileData.data.features[0].properties);
        // Extract corresponding values for each feature
        const values = fileData.data.features.map((feature) => {
          return keys.map((key) => feature.properties[key]);
        });
        // Group keys and values into the desired format
        const result = { [fileData.fileName]: [keys, ...values] };
        blob = convertJsonToXlsx(result, { skipHeader: true });
        break;
    }
    return blob;
  };

  // Download the selected file
  const downloadFile = () => {
    let blob = dataToBlob();
    // Crating a url object for the blob
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Forming a name for downloaded file
    const fileNameParts = fileData.fileName.split(".");
    fileNameParts.pop();
    fileNameParts.push("xlsx");
    fileNameParts.join(".");

    //Downloading the file
    link.download = fileNameParts.join(".");
    link.click();
    URL.revokeObjectURL(url);
  };

  // delete the selected file
  const deleteFile = () => {
    setResourceMapping([]);
    setFileDataList((previous) => {
      let temp = _.cloneDeep(previous);
      delete temp[fileData.id];
      return temp;
    });
    setFileData(undefined);
    setDataPresent(false);
    setUploadedFileError(null);
    setDataUpload(false);
    setSelectedFileType(null);
    closeModal();
  };

  // Function for handling the validations for geojson and shapefiles after mapping of properties
  const validationForMappingAndDataSaving = async () => {
    try {
      setLoderActivation(true);
      const schemaData = getSchema(campaignType, selectedFileType.id, selectedSection.id, validationSchemas);
      let error;
      if (!checkForSchemaData(schemaData)) return;

      const { data, valid } = computeMappedDataAndItsValidations(schemaData);
      if (!valid) return;
      let filestoreId;
      if (!error) {
        filestoreId = await saveFileToFileStore();
      }
      let resourceMappingData;
      if (filestoreId) {
        resourceMappingData = resourceMapping.map((item) => ({ ...item, filestoreId }));
      }
      setResourceMapping([]);
      let fileObject = _.cloneDeep(fileData);
      fileObject = { ...fileData, mappedData: data, resourceMapping: resourceMappingData, error: error ? error : null, filestoreId };
      setFileData(fileObject);
      setFileDataList((prevFileDataList) => ({ ...prevFileDataList, [fileObject.id]: fileObject }));
      setToast({ state: "success", message: t("FILE_UPLOADED_SUCCESSFULLY") });
      setLoderActivation(false);
    } catch (error) {
      setUploadedFileError(t("ERROR_UPLOADING_FILE"));
      setToast({ state: "error", message: t("ERROR_UPLOADING_FILE") });
      setLoderActivation(false);
      handleValidationErrorResponse(t("ERROR_UPLOADING_FILE"));
    }
  };
  const saveFileToFileStore = async () => {
    try {
      const filestoreResponse = await Digit.UploadServices.Filestorage("microplan", fileData.file, Digit.ULBService.getStateId());
      if (filestoreResponse?.data?.files?.length > 0) {
        return filestoreResponse?.data?.files[0]?.fileStoreId;
      } else {
        error = t("ERROR_UPLOADING_FILE");
        setToast({ state: "error", message: t("ERROR_UPLOADING_FILE") });
        setResourceMapping([]);
        setUploadedFileError(error);
      }
    } catch (error) {
      error = t("ERROR_UPLOADING_FILE");
      handleValidationErrorResponse(error);
      setResourceMapping([]);
      return;
    }
  };
  const computeMappedDataAndItsValidations = (schemaData) => {
    const data = computeGeojsonWithMappedProperties(t);
    const response = geojsonPropetiesValidation(data, schemaData.schema, t);
    if (!response.valid) {
      handleValidationErrorResponse(response.message);
      return { data: data, valid: response.valid };
    }
    return { data: data, valid: response.valid };
  };

  const handleValidationErrorResponse = (error) => {
    const fileObject = fileData;
    fileObject.error = error;
    setFileData((previous) => ({ ...previous, error }));
    setFileDataList((prevFileDataList) => ({ ...prevFileDataList, [fileData.id]: fileObject }));
    setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
    if (error) setUploadedFileError(error);
    setLoderActivation(false);
  };

  const checkForSchemaData = (schemaData) => {
    if(resourceMapping?.length===0){
      setToast({ state: "warning", message: t("WARNING_INCOMPLETE_MAPPING") });
      setLoderActivation(false);
      return false;
    }
    
    if (!schemaData || !schemaData.schema || !schemaData.schema["required"]) {
      setToast({ state: "error", message: t("ERROR_VALIDATION_SCHEMA_ABSENT") });
      setLoderActivation(false);
      return;
    }

    let columns = [...schemaData?.schema?.["required"], ...hierarchy];
    const resourceMappingLength = resourceMapping.filter((e) => !!e?.mappedFrom ).length;
    if (columns.length !== resourceMappingLength) {
      setToast({ state: "warning", message: t("WARNING_INCOMPLETE_MAPPING") });
      setLoderActivation(false);
      return false;
    }
    setModal("none");
    return true;
  };

  const computeGeojsonWithMappedProperties = (t) => {
    const newFeatures = fileData.data["features"].map((item) => {
      let newProperties = {};

      resourceMapping.forEach((e) => {
        newProperties[t(e["mappedTo"])] = item["properties"][e["mappedFrom"]];
      });
      item["properties"] = newProperties;
      return item;
    });
    let data = fileData.data;
    data["features"] = newFeatures;
    return data;
  };

  // Handler for checing file extension and showing errors in case it is wrong
  const onTypeErrorWhileFileUpload = () => {
    if (selectedFileType.id === "Excel") setToast({ state: "error", message: t("ERROR_EXCEL_EXTENSION") });
    if (selectedFileType.id === "Geojson") setToast({ state: "error", message: t("ERROR_GEOJSON_EXTENSION") });
    if (selectedFileType.id === "Shapefiles") setToast({ state: "error", message: t("ERROR_SHAPE_FILE_EXTENSION") });
  };

  // Cancle mapping and uplaod in case of geojson and shapefiles
  const cancelUpload = () => {
    setFileDataList({ ...fileDataList, [fileData.id]: undefined });
    setFileData(undefined);
    setDataPresent(false);
    setUploadedFileError(null);
    setDataUpload(false);
    setSelectedFileType(null);
    closeModal();
  };

  const openDataPreview = () => {
    let data;
    switch (fileData.fileType) {
      case "Excel":
        data = fileData.data;
        break;
      case "Shapefiles":
      case "Geojson":
        if (!fileData || !fileData.data) {
          setToast({
            state: "error",
            message: t("ERROR_DATA_NOT_PRESENT"),
          });
          return;
        }
        // Extract keys from the first feature's properties
        const keys = Object.keys(fileData.data.features[0].properties);
        // Extract corresponding values for each feature
        const values = fileData.data.features.map((feature) => {
          return keys.map((key) => feature.properties[key]);
        });
        // Group keys and values into the desired format
        data = { [fileData.fileName]: [keys, ...values] };
        break;
    }
    setPreviewUploadedData(data);
  };

  if (isCampaignLoading) {
    return <Loader />;
  }

  return (
    <div className={`jk-header-btn-wrapper upload-section${!editable ? " non-editable-component" : ""}`}>
      <div className="upload">
        <div className="upload-component-wrapper">
          {!dataPresent ? (
            dataUpload ? (
              <div className="upload-component">
                <FileUploadComponent
                  section={sections.filter((e) => e.id === selectedSection.id)[0]}
                  selectedSection={selectedSection}
                  selectedFileType={selectedFileType}
                  UploadFileToFileStorage={UploadFileToFileStorage}
                  onTypeError={onTypeErrorWhileFileUpload}
                  setToast={setToast}
                  template={template}
                />
              </div>
            ) : (
              <div className="upload-component">{sectionComponents}</div>
            )
          ) : (
            <div className="upload-component">
              {selectedSection != null && fileData !== null && (
                <UploadedFile
                  selectedSection={selectedSection}
                  selectedFileType={selectedFileType}
                  file={fileData}
                  ReuplaodFile={() => setModal("reupload-conformation")}
                  DownloaddFile={downloadFile}
                  DeleteFile={() => setModal("delete-conformation")}
                  error={uploadedFileError}
                  setToast={setToast}
                  template={template}
                  openDataPreview={openDataPreview}
                />
              )}
            </div>
          )}
          {!dataPresent && dataUpload && <UploadInstructions setModal={() => setModal("upload-guidelines")} t={t} />}
        </div>

        <div className="upload-section-option">{sectionOptions}</div>
      </div>

      {modal === "upload-modal" && (
        <ModalWrapper
          closeButton={true}
          selectedSection={selectedSection}
          selectedFileType={selectedFileType}
          closeModal={() => {
            closeModal();
            setSelectedFileType(null);
          }}
          LeftButtonHandler={() => UploadFileClickHandler(false)}
          RightButtonHandler={() => UploadFileClickHandler(true)}
          sections={sections}
          footerLeftButtonBody={<ButtonType1 text={t("ALREADY_HAVE_IT")} />}
          footerRightButtonBody={<ButtonType2 text={t("DOWNLOAD_TEMPLATE")} showDownloadIcon={true} />}
          header={<ModalHeading label={t("HEADING_DOWNLOAD_TEMPLATE_FOR_" + selectedSection.code + "_" + selectedFileType.code)} />}
          bodyText={t("INSTRUCTIONS_DOWNLOAD_TEMPLATE_FOR_" + selectedSection.code + "_" + selectedFileType.code)}
        />
      )}
      {modal === "delete-conformation" && (
        <ModalWrapper
          selectedSection={selectedSection}
          selectedFileType={selectedFileType}
          closeModal={closeModal}
          LeftButtonHandler={deleteFile}
          RightButtonHandler={closeModal}
          sections={sections}
          footerLeftButtonBody={<ButtonType1 text={t("YES")} />}
          footerRightButtonBody={<ButtonType1 text={t("NO")} />}
          header={<ModalHeading label={t("HEADING_DELETE_FILE_CONFIRMATION")} />}
          bodyText={t("INSTRUCTIONS_DELETE_FILE_CONFIRMATION")}
        />
      )}
      {modal === "reupload-conformation" && (
        <ModalWrapper
          selectedSection={selectedSection}
          selectedFileType={selectedFileType}
          closeModal={closeModal}
          LeftButtonHandler={reuplaodFile}
          RightButtonHandler={closeModal}
          sections={sections}
          footerLeftButtonBody={<ButtonType1 text={t("YES")} />}
          footerRightButtonBody={<ButtonType1 text={t("NO")} />}
          header={<ModalHeading label={t("HEADING_REUPLOAD_FILE_CONFIRMATION")} />}
          bodyText={t("INSTRUCTIONS_REUPLOAD_FILE_CONFIRMATION")}
        />
      )}
      {modal === "spatial-data-property-mapping" && (
        <ModalWrapper
          closeButton={true}
          popupModuleActionBarStyles={{ justifyContent: "end", padding: "1rem" }}
          popupStyles={{ width: "48.5rem" }}
          selectedSection={selectedSection}
          selectedFileType={selectedFileType}
          closeModal={cancelUpload}
          // LeftButtonHandler={reuplaodFile}
          RightButtonHandler={validationForMappingAndDataSaving}
          headerBarMainStyle={{ width: "48.5rem" }}
          sections={sections}
          // footerLeftButtonBody={<AlternateButton text={t("YES")} />}
          footerRightButtonBody={<ButtonType1 text={t("COMPLETE_MAPPING")} />}
          header={<ModalHeading label={t("HEADING_SPATIAL_DATA_PROPERTY_MAPPING")} style={{ width: "calc(100% )" }} />}
          bodyText={t("INSTRUCTION_SPATIAL_DATA_PROPERTY_MAPPING")}
          body={
            <SpatialDataPropertyMapping
              uploadedData={fileData.data}
              resourceMapping={resourceMapping}
              setResourceMapping={setResourceMapping}
              schema={getSchema(campaignType, selectedFileType.id, selectedSection.id, validationSchemas)}
              setToast={setToast}
              hierarchy={hierarchy}
              t={t}
            />
          }
        />
      )}
      {modal === "upload-guidelines" && (
        <ModalWrapper
          closeButton={true}
          popupModuleActionBarStyles={{ justifyContent: "end", padding: "1rem" }}
          popupStyles={{ width: "calc(100% - 6rem)" }}
          closeModal={closeModal}
          hideSubmit={true}
          headerBarMainStyle={{ width: "100%", margin: 0, padding: 0 }}
          header={<ModalHeading label={t("HEADING_DATA_UPLOAD_GUIDELINES")} className="upload-guidelines-header" />}
          body={<UploadGuideLines uploadGuideLines={uploadGuideLines} t={t} />}
        />
      )}
      {loaderActivation && <LoaderWithGap text={"FILE_UPLOADING"} />}
      {toast && toast.state === "success" && <Toast style={{ bottom: "5.5rem" }} label={toast.message} onClose={() => setToast(null)} />}
      {toast && toast.state === "error" && (
        <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
      )}
      {toast && toast.state === "warning" && (
        <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
      )}
      {previewUploadedData && (
        <div className="popup-wrap">
          <JsonPreviewInExcelForm sheetsData={previewUploadedData} onBack={() => setPreviewUploadedData(undefined)} onDownload={downloadFile} />
        </div>
      )}
    </div>
  );
};

// Component for rendering individual section option
const UploadSection = ({ item, selected, setSelectedSection }) => {
  const { t } = useTranslation();
  // Handle click on section option
  const handleClick = () => {
    setSelectedSection(item);
  };

  return (
    <div className={` ${selected ? "upload-section-options-active" : "upload-section-options-inactive"}`} onClick={handleClick}>
      <div className="icon">
        <CustomIcon Icon={Icons[item.iconName]} height="26" color={selected ? "rgba(244, 119, 56, 1)" : "rgba(214, 213, 212, 1)"} />
      </div>
      <p>{t(item.code)}</p>
    </div>
  );
};

const UploadInstructions = ({ setModal, t }) => {
  return (
    <div className="information">
      <div className="information-heading">
        <CustomIcon Icon={Icons["Info"]} color={"rgba(52, 152, 219, 1)"} />
        <p>{t("INFO")}</p>
      </div>
      <div className="information-description">
        <p>{t("INFORMATION_DESCRIPTION")}</p>
        <div className="link-wrapper">
          {t("REFER")} &nbsp;
          <div className="link" onClick={setModal}>
            {t("INFORMATION_DESCRIPTION_LINK")}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for rendering individual upload option
const UploadComponents = ({ item, selected, uploadOptions, selectedFileType, selectFileTypeHandler }) => {
  const { t } = useTranslation();
  const title = item.code;

  // Component for rendering individual upload option container
  const UploadOptionContainer = ({ item, selectedFileType, selectFileTypeHandler }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
      <div
        key={item.id}
        className="upload-option"
        style={selectedFileType.id === item.id ? { border: "2px rgba(244, 119, 56, 1) solid", color: "rgba(244, 119, 56, 1)" } : {}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CustomIcon
          key={item.id}
          Icon={Icons[item.iconName]}
          width={"2.5rem"}
          height={"3rem"}
          color={selectedFileType.id === item.id || isHovered ? "rgba(244, 119, 56, 1)" : "rgba(80, 90, 95, 1)"}
        />
        <p>{t(item.code)}</p>
        <button
          className={selectedFileType && selectedFileType.id === item.id ? "selected-button" : "select-button"}
          type="button"
          id={item.id}
          name={item.id}
          onClick={selectFileTypeHandler}
        >
          {selectedFileType.id === item.id && (
            <CustomIcon Icon={Icons["TickMarkBackgroundFilled"]} height={"2.5rem"} color={"rgba(255, 255, 255, 1)"} />
          )}
          {selectedFileType.id === item.id ? t("SELECTED") : t("SELECT")}
        </button>
      </div>
    );
  };

  return (
    <div key={item.id} className={`${selected ? "upload-component-active" : "upload-component-inactive"}`}>
      <div>
        <div className="heading">
          <h2>{t(`HEADING_UPLOAD_DATA_${title}`)}</h2>
        </div>

        <p>{t(`INSTRUCTIONS_DATA_UPLOAD_OPTIONS_${title}`)}</p>
      </div>
      <div className={selectedFileType.id === item.id ? " upload-option-container-selected" : "upload-option-container"}>
        {uploadOptions &&
          uploadOptions.map((item) => (
            <UploadOptionContainer key={item.id} item={item} selectedFileType={selectedFileType} selectFileTypeHandler={selectFileTypeHandler} />
          ))}
      </div>
    </div>
  );
};

// Component for uploading file
const FileUploadComponent = ({ selectedSection, selectedFileType, UploadFileToFileStorage, section, onTypeError, setToast, template }) => {
  if (!selectedSection || !selectedFileType) return <div></div>;
  const { t } = useTranslation();
  let types;
  section["UploadFileTypes"].forEach((item) => {
    if (item.id === selectedFileType.id) types = item.fileExtension;
  });
  return (
    <div key={selectedSection.id} className="upload-component-active">
      <div>
        <div className="heading">
          <h2>{t(`HEADING_FILE_UPLOAD_${selectedSection.code}_${selectedFileType.code}`)}</h2>
          <div
            className="download-template-button"
            onClick={() => downloadTemplate(campaignType, selectedFileType.id, selectedSection.id, setToast, template)}
          >
            <div className="icon">
              <CustomIcon color={"rgba(244, 119, 56, 1)"} height={"24"} width={"24"} Icon={Icons.FileDownload} />
            </div>
            <p>{t("DOWNLOAD_TEMPLATE")}</p>
          </div>
        </div>
        <p>{t(`INSTRUCTIONS_FILE_UPLOAD_FROM_TEMPLATE_${selectedSection.code}`)}</p>
        <FileUploader handleChange={UploadFileToFileStorage} label={"idk"} onTypeError={onTypeError} multiple={false} name="file" types={types}>
          <div className="upload-file">
            <CustomIcon Icon={Icons.FileUpload} width={"2.5rem"} height={"3rem"} color={"rgba(177, 180, 182, 1)"} />
            <div className="browse-text-wrapper">
              {t(`INSTRUCTIONS_UPLOAD_${selectedFileType.code}`)}&nbsp;<div className="browse-text">{t("INSTRUCTIONS_UPLOAD_BROWSE_FILES")}</div>
            </div>
          </div>
        </FileUploader>
      </div>
    </div>
  );
};

// Component to display uploaded file
const UploadedFile = ({
  selectedSection,
  selectedFileType,
  file,
  ReuplaodFile,
  DownloaddFile,
  DeleteFile,
  error,
  setToast,
  template,
  openDataPreview,
}) => {
  const { t } = useTranslation();
  return (
    <div key={selectedSection.id} className="upload-component-active">
      <div>
        <div className="heading">
          <h2>{t(`HEADING_FILE_UPLOAD_${selectedSection.code}_${selectedFileType.code}`)}</h2>
          <div
            className="download-template-button"
            onClick={() => downloadTemplate(campaignType, selectedFileType.id, selectedSection.id, setToast, template)}
          >
            <div className="icon">
              <CustomIcon color={"rgba(244, 119, 56, 1)"} height={"24"} width={"24"} Icon={Icons.FileDownload} />
            </div>
            <p>{t("DOWNLOAD_TEMPLATE")}</p>
          </div>
        </div>
        <p>{t(`INSTRUCTIONS_FILE_UPLOAD_FROM_TEMPLATE_${selectedSection.code}`)}</p>

        <div className="uploaded-file" onDoubleClick={openDataPreview}>
          <div className="uploaded-file-details">
            <div>
              <CustomIcon Icon={Icons.File} width={"48"} height={"48"} color="rgba(80, 90, 95, 1)" />
            </div>
            <p>{file.fileName}</p>
          </div>
          <div className="uploaded-file-operations">
            <div className="button" onClick={ReuplaodFile}>
              <CustomIcon Icon={Icons.FileUpload} width={"1.5rem"} height={"1.5rem"} color={"rgba(244, 119, 56, 1)"} />
              <p>{t("Reupload")}</p>
            </div>
            <div className="button" onClick={DownloaddFile}>
              <CustomIcon Icon={Icons.FileDownload} width={"1.5rem"} height={"1.5rem"} color={"rgba(244, 119, 56, 1)"} />
              <p>{t("Download")}</p>
            </div>
            <div className="button deletebutton" onClick={DeleteFile}>
              <CustomIcon Icon={Icons.Trash} width={"0.8rem"} height={"1rem"} color={"rgba(244, 119, 56, 1)"} />
              <p>{t("DELETE")}</p>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="file-upload-error-container">
          <div className="heading">
            <CustomIcon Icon={Icons.Error} width={"24"} height={"24"} color="rgba(212, 53, 28, 1)" />
            <p>{t("ERROR_UPLOADED_FILE")}</p>
          </div>
          <div className="body">
            <p>{t(error)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Function for checking the uploaded file for nameing conventions
const validateNamingConvention = (file, namingConvention, setToast, t) => {
  const regx = new RegExp(namingConvention);
  if (regx && !regx.test(file.name)) {
    setToast({
      state: "error",
      message: t("ERROR_NAMING_CONVENSION"),
    });
    return false;
  }
  return true;
};

// Function for reading ancd checking geojson data
const readGeojson = async (file, t) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geoJSONData = JSON.parse(e.target.result);
        const trimmedGeoJSONData = trimJSON(geoJSONData);
        resolve({ valid: true, geojsonData: trimmedGeoJSONData });
      } catch (error) {
        resolve({ valid: false, toast: { state: "error", message: t("ERROR_INCORRECT_FORMAT") } });
      }
    };
    reader.onerror = function (error) {
      resolve({ valid: false, toast: { state: "error", message: t("ERROR_CORRUPTED_FILE") } });
    };

    reader.readAsText(file);
  });
};

// Function to recursively trim leading and trailing spaces from string values in a JSON object
const trimJSON = (jsonObject) => {
  if (typeof jsonObject !== "object") {
    return jsonObject; // If not an object, return as is
  }

  if (Array.isArray(jsonObject)) {
    return jsonObject.map((item) => trimJSON(item)); // If it's an array, recursively trim each item
  }

  const trimmedObject = {};
  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      const value = jsonObject[key];
      // Trim string values, recursively trim objects
      trimmedObject[key.trim()] = typeof value === "string" ? value.trim() : typeof value === "object" ? trimJSON(value) : value;
    }
  }
  return trimmedObject;
};
// Function for reading and validating shape file data
const readAndValidateShapeFiles = async (file, t, namingConvension) => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });
    }
    const fileRegex = new RegExp(namingConvension.replace(".zip$", ".*$"));
    // File Size Check
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 2 * 1024 * 1024 * 1024; // 2 GB

    // Check if file size is within limit
    if (fileSizeInBytes > maxSizeInBytes)
      resolve({ valid: false, message: "ERROR_FILE_SIZE", toast: { state: "error", message: t("ERROR_FILE_SIZE") } });

    try {
      const zip = await JSZip.loadAsync(file);
      const isEPSG4326 = await checkProjection(zip);
      if (!isEPSG4326) {
        resolve({ valid: false, message: "ERROR_WRONG_PRJ", toast: { state: "error", message: t("ERROR_WRONG_PRJ") } });
      }
      const files = Object.keys(zip.files);
      const allFilesMatchRegex = files.every((fl) => {
        return fileRegex.test(fl);
      });
      let regx = new RegExp(namingConvension.replace(".zip$", ".shp$"));
      const shpFile = zip.file(regx)[0];
      regx = new RegExp(namingConvension.replace(".zip$", ".shx$"));
      const shxFile = zip.file(regx)[0];
      regx = new RegExp(namingConvension.replace(".zip$", ".dbf$"));
      const dbfFile = zip.file(regx)[0];

      let geojson;
      if (shpFile && dbfFile) {
        const shpArrayBuffer = await shpFile.async("arraybuffer");
        const dbfArrayBuffer = await dbfFile.async("arraybuffer");

        geojson = shp.combine([shp.parseShp(shpArrayBuffer), shp.parseDbf(dbfArrayBuffer)]);
      }
      if (shpFile && dbfFile && shxFile && allFilesMatchRegex) resolve({ valid: true, data: geojson });
      else if (!allFilesMatchRegex)
        resolve({
          valid: false,
          message: "ERROR_CONTENT_NAMING_CONVENSION",
          toast: { state: "error", data: geojson, message: t("ERROR_CONTENT_NAMING_CONVENSION") },
        });
      else if (!shpFile)
        resolve({ valid: false, message: "ERROR_SHP_MISSING", toast: { state: "error", data: geojson, message: t("ERROR_SHP_MISSING") } });
      else if (!dbfFile)
        resolve({ valid: false, message: "ERROR_DBF_MISSING", toast: { state: "error", data: geojson, message: t("ERROR_DBF_MISSING") } });
      else if (!shxFile)
        resolve({ valid: false, message: "ERROR_SHX_MISSING", toast: { state: "error", data: geojson, message: t("ERROR_SHX_MISSING") } });
    } catch (error) {
      resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });
    }
  });
};

// Function for projections check in case of shapefile data
const checkProjection = async (zip) => {
  const prjFile = zip.file(/.prj$/i)[0];
  if (!prjFile) {
    return "absent";
  }

  const prjText = await prjFile.async("text");

  if (prjText.includes("GEOGCS") && prjText.includes("WGS_1984") && prjText.includes("DATUM") && prjText.includes("D_WGS_1984")) {
    return "EPSG:4326";
  } else {
    return false;
  }
};

// Function to handle the template download
const downloadTemplate = (campaignType, type, section, setToast, Templates) => {
  try {
    // Find the template based on the provided parameters
    const schema = getSchema(campaignType, type, section, Templates);

    if (!schema) {
      // Handle if template is not found
      setToast({ state: "error", message: "Template not found" });
      return;
    }
    const template = {
      sheet: [schema.schema.required],
    };
    const blob = convertJsonToXlsx(template, { skipHeader: true });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    setToast({ state: "error", message: t("ERROR_DOWNLOADING_TEMPLATE") });
  }
};

// get schema for validation
const getSchema = (campaignType, type, section, schemas) => {
  return schemas.find((schema) => {
    if (!schema.campaignType) {
      return schema.type === type && schema.section === section;
    }
    return schema.campaignType === campaignType && schema.type === type && schema.section === section;
  });
};

// Uplaod GuideLines
const UploadGuideLines = ({ uploadGuideLines, t }) => {
  return (
    <div className="guidelines">
      <p className="sub-heading">{t("PREREQUISITES")}</p>
      <div className="instruction-list">
        {t("INSTRUCTION_PREREQUISITES_1")}&nbsp;
        <a className="link" href="https://help.sap.com/docs/SAP_BW4HANA/107a6e8a38b74ede94c833ca3b7b6f51/ff09575df3614f3da5738ea14e72b703.html">
          {t("INSTRUCTION_PREREQUISITES_LINK")}
        </a>
      </div>
      <p className="instruction-list ">{t("INSTRUCTION_PREREQUISITES_2")}</p>
      <p className="sub-heading padtop">{t("PROCEDURE")}</p>
      {uploadGuideLines.map((item, index) => (
        <div className="instruction-list-container">
          <p key={index} className="instruction-list number">
            {t(index + 1)}.
          </p>
          <p key={index} className="instruction-list text">
            {t(item)}
          </p>
        </div>
      ))}
    </div>
  );
};

const CustomIcon = (props) => {
  if (!props.Icon) return null;
  return <props.Icon fill={props.color} {...props} />;
};

export default Upload;
