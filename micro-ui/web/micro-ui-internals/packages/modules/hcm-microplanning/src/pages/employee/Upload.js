import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "@egovernments/digit-ui-react-components";
import * as Icons from "@egovernments/digit-ui-svg-components";
import { FileUploader } from "react-drag-drop-files";
import Config from "../../configs/UploadConfiguration.json";
import excelTemplate from "../../configs/excelTemplate.json";
import { convertJsonToXlsx } from "../../utils/jsonToExcelBlob";
import { parseXlsxToJsonMultipleSheets } from "../../utils/exceltojson";
import Modal from "../../components/Modal";
import { checkForErrorInUploadedFileExcel } from "../../utils/excelValidations";
import { geojsonValidations } from "../../utils/geojsonValidations";
import schemas from "../../configs/schemas.json";
import JSZip from "jszip";
import shp from "shpjs";

const Upload = ({ MicroplanName = "default", campaignType = "SMC" }) => {
  const { t } = useTranslation();

  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "UploadConfiguration" }]);

  // States
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

  // Effect to update sections and selected section when data changes
  useEffect(() => {
    if (data) {
      // let uploadSections = data["hcm-microplanning"]["UploadConfiguration"];
      let uploadSections = Config["UploadConfiguration"];
      setSelectedSection(uploadSections.length > 0 ? uploadSections[0] : null);
      setSections(uploadSections);
    }
  }, [data]);

  // Effect to set schema
  useEffect(() => {
    setValidationSchemas(schemas.schemas);
  }, []);

  // To close the Toast after 10 seconds
  useEffect(() => {
    if (toast == undefined) return;
    const timer = setTimeout(() => {
      setToast(undefined);
    }, 10000);
    return () => clearTimeout(timer);
  }, [toast]);

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
      // const file = Digit.SessionStorage.get(`Microplanning_${selectedSection.id}`);
      let file = fileDataList[`Microplanning_${selectedSection.id}`];
      if (file && file.file) {
        setSelectedFileType(selectedSection.UploadFileTypes.find((item) => item.id === file.fileType));
        setUploadedFileError(file.error);
        setFileData(file);
        setDataPresent(true);
      } else {
        setSelectedFileType(null);
        setDataPresent(false);
      }
    } else {
      setSelectedFileType(null);
      setDataPresent(false);
    }

    setDataUpload(false);
  }, [selectedSection]);
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
            console.log(check,error, fileDataToStore)
          } catch (error) {
            setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
          }
          break;
        case "Geojson":
          try {
            response = await handleGeojsonFile(file, schemaData);
            check = response.check;
            error = response.error;
            fileDataToStore = response.fileDataToStore;
            console.log(check,error, fileDataToStore)
          } catch (error) {
            setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
          }
          break;
        case "Shapefiles":
          try {
            response = await handleShapefiles(file, schemaData);
            check = response.check;
            error = response.error;
            fileDataToStore = response.fileDataToStore;
            console.log(check,error, fileDataToStore)
          } catch (error) {
            setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
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

      // creating a fileObject to save all the data collectively
      let fileObject = {
        id: `Microplanning_${selectedSection.id}`,
        fileName: file.name,
        section: selectedSection.id,
        fileType: selectedFileType.id,
        data: fileDataToStore,
        file,
        error: error ? error : null,
      };
      setFileData(fileObject);
      setFileDataList((prevFileDataList) => ({ ...prevFileDataList, [fileObject.id]: fileObject }));
      // Digit.SessionStorage.set(fileObject.id, fileObject);
      setDataPresent(true);
      setLoderActivation(false);
      if (check) {
        setToast({ state: "success", message: t("FILE_UPLOADED_SUCCESSFULLY") });
      } else {
        setToast({ state: "error", message: t("ERROR_UPLOADED_FILE") });
      }
    } catch (error) {
      console.log(error.message);
      setUploadedFileError("ERROR_UPLOADING_FILE");
      setLoderActivation(false);
    }
  };

  const handleExcelFile = async (file, schemaData) => {
    // Converting the input file to json format
    let result = await parseXlsxToJsonMultipleSheets(file);
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
    if (data.valid == false) {
      setLoderActivation(false);
      setToast(data.toast);
      return;
    }
    // Running geojson validaiton on uploaded file
    let response = geojsonValidations(data, schemaData.schema, t);
    console.log(response);
    if (!response.valid) setUploadedFileError(response.message);
    let check = response.valid;
    let error = response.message;
    let fileDataToStore = data;
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
    setFileData(undefined);
    setDataPresent(false);
    setUploadedFileError(null);
    setDataUpload(false);
    setSelectedFileType(null);
    closeModal();
  };

  // Download the selected file
  const downloadFile = () => {
    let blob;
    switch (fileData.fileType) {
      case "Excel":
        blob = fileData.file;
        break;
      case "Shapefiles":
      case "Geojson":
        console.log(fileData);
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
        console.log(result);
        blob = convertJsonToXlsx(result, { skipHeader: true });
        break;
    }
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
  const deleteDelete = () => {
    // Digit.SessionStorage.del(fileData.id);
    setFileDataList({ ...fileDataList, [fileData.id]: undefined });
    setFileData(undefined);
    setDataPresent(false);
    setUploadedFileError(null);
    setDataUpload(false);
    setSelectedFileType(null);
    closeModal();
  };

  // Handler for checing file extension and showing errors in case it is wrong
  const onTypeErrorWhileFileUpload = () => {
    if (selectedFileType.id === "Excel") setToast({ state: "error", message: t("ERROR_EXCEL_EXTENSION") });
    if (selectedFileType.id === "Geojson") setToast({ state: "error", message: t("ERROR_GEOJSON_EXTENSION") });
    if (selectedFileType.id === "Shapefiles") setToast({ state: "error", message: t("ERROR_SHAPE_FILE_EXTENSION") });
  };

  return (
    <div className="jk-header-btn-wrapper microplanning">
      <div className="upload">
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
                DeleteDelete={() => setModal("delete-conformation")}
                error={uploadedFileError}
                setToast={setToast}
                template={template}
              />
            )}
          </div>
        )}
        <div className="upload-section-option">{sectionOptions}</div>
      </div>

      {modal === "upload-modal" && (
        <ModalWrapper
          selectedSection={selectedSection}
          selectedFileType={selectedFileType}
          closeModal={closeModal}
          LeftButtonHandler={() => UploadFileClickHandler(false)}
          RightButtonHandler={() => UploadFileClickHandler(true)}
          sections={sections}
          footerLeftButtonBody={<AlternateButton text={t("ALREDY_HAVE_IT")} />}
          footerRightButtonBody={<DownloadButton text={t("DOWNLOAD_TEMPLATE")} />}
          header={<ModalHeading label={t("HEADING_DOWNLOAD_TEMPLATE_FOR_" + selectedSection.code + "_" + selectedFileType.code)} />}
          bodyText={t("INSTRUCTIONS_DOWNLOAD_TEMPLATE_FOR_" + selectedSection.code + "_" + selectedFileType.code)}
        />
      )}
      {modal === "delete-conformation" && (
        <ModalWrapper
          selectedSection={selectedSection}
          selectedFileType={selectedFileType}
          closeModal={closeModal}
          LeftButtonHandler={deleteDelete}
          RightButtonHandler={closeModal}
          sections={sections}
          footerLeftButtonBody={<AlternateButton text={t("YES")} />}
          footerRightButtonBody={<AlternateButton text={t("NO")} />}
          header={<ModalHeading label={t("HEADING_DELETE_FILE_CONFORMATION")} />}
          bodyText={t("INSTRUCTIONS_DELETE_FILE_CONFORMATION")}
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
          footerLeftButtonBody={<AlternateButton text={t("YES")} />}
          footerRightButtonBody={<AlternateButton text={t("NO")} />}
          header={<ModalHeading label={t("HEADING_REUPLOAD_FILE_CONFORMATION")} />}
          bodyText={t("INSTRUCTIONS_REUPLOAD_FILE_CONFORMATION")}
        />
      )}
      {loaderActivation && <Loader />}
      {toast && toast.state === "success" && <Toast label={toast.message} onClose={() => setToast(null)} />}
      {toast && toast.state === "error" && <Toast label={toast.message} isDleteBtn onClose={() => setToast(null)} error />}
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
    <div className={`upload-section-options ${selected ? "upload-section-options-active" : "upload-section-options-inactive"}`} onClick={handleClick}>
      <div style={{ padding: "0 10px" }}>
        <CustomIcon Icon={Icons[item.iconName]} color={selected ? "rgba(244, 119, 56, 1)" : "rgba(214, 213, 212, 1)"} />
      </div>
      <p>{t(item.id)}</p>
    </div>
  );
};

// Component for rendering individual upload option
const UploadComponents = ({ item, selected, uploadOptions, selectedFileType, selectFileTypeHandler }) => {
  const { t } = useTranslation();
  const title = item.code;

  // Component for rendering individual upload option container
  const UploadOptionContainer = ({ item, selectedFileType, selectFileTypeHandler }) => {
    return (
      <div
        key={item.id}
        className="upload-option"
        style={selectedFileType.id === item.id ? { border: "2px rgba(244, 119, 56, 1) solid", color: "rgba(244, 119, 56, 1)" } : {}}
      >
        <CustomIcon key={item.id} Icon={Icons[item.iconName]} width={"2.5rem"} height={"3rem"} color={"rgba(244, 119, 56, 1)"} />
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
            <p className="">
              {t(`INSTRUCTIONS_UNLOAD_${selectedFileType.code}`)} <text className="browse-text">{t("INSTRUCTIONS_UNLOAD_BROWSE_FILES")}</text>
            </p>
          </div>
        </FileUploader>
      </div>
    </div>
  );
};

// Component to display uploaded file
const UploadedFile = ({ selectedSection, selectedFileType, file, ReuplaodFile, DownloaddFile, DeleteDelete, error, setToast, template }) => {
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

        <div className="uploaded-file">
          <div className="uploaded-file-details">
            <div>
              <CustomIcon Icon={Icons.File} width={"48"} height={"48"} color="rgba(80, 90, 95, 1)" />
            </div>
            <p>{file.fileName}</p>
          </div>
          <div className="uploaded-file-operations">
            <div className="button" onClick={ReuplaodFile}>
              <CustomIcon Icon={Icons.FileUpload} width={"2.5rem"} height={"2.5rem"} color={"rgba(177, 180, 182, 1)"} />
              <p>{t("Reupload")}</p>
            </div>
            <div className="button" onClick={DownloaddFile}>
              <CustomIcon Icon={Icons.FileDownload} width={"2.5rem"} height={"3rem"} color={"rgba(177, 180, 182, 1)"} />
              <p>{t("Download")}</p>
            </div>
            <div className="button deletebutton" onClick={DeleteDelete}>
              <CustomIcon Icon={Icons.Trash} width={"2.5rem"} height={"3rem"} color={"rgba(177, 180, 182, 1)"} />
              <p>{t("Delete")}</p>
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

// Wrapper for modal
const ModalWrapper = ({
  selectedSection,
  selectedFileType,
  closeModal,
  LeftButtonHandler,
  RightButtonHandler,
  sections,
  footerLeftButtonBody,
  footerRightButtonBody,
  header,
  bodyText,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      headerBarMain={header}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelOnSubmit={LeftButtonHandler}
      actionSaveOnSubmit={RightButtonHandler}
      formId="microplanning"
      popupStyles={{ width: "34rem" }}
      headerBarMainStyle={{ margin: 0, width: "34rem", overflow: "hidden" }}
      popupModuleMianStyles={{ margin: 0, padding: 0 }}
      popupModuleActionBarStyles={{ justifyContent: "space-between", padding: "1rem" }}
      style={{}}
      hideSubmit={false}
      footerLeftButtonstyle={{
        padding: 0,
        alignSelf: "flex-start",
        height: "fit-content",
        textStyles: { fontWeight: "600" },
        backgroundColor: "rgba(255, 255, 255, 1)",
        color: "rgba(244, 119, 56, 1)",
        width: "14rem",
        border: "1px solid rgba(244, 119, 56, 1)",
      }}
      footerRightButtonstyle={{
        padding: 0,
        alignSelf: "flex-end",
        height: "fit-content",
        textStyles: { fontWeight: "500" },
        backgroundColor: "rgba(244, 119, 56, 1)",
        color: "rgba(255, 255, 255, 1)",
        width: "14rem",
        boxShadow: "0px -2px 0px 0px rgba(11, 12, 12, 1) inset",
      }}
      footerLeftButtonBody={footerLeftButtonBody}
      footerRightButtonBody={footerRightButtonBody}
    >
      <div className="modal-body">
        <p className="modal-main-body-p">{bodyText}</p>
      </div>
    </Modal>
  );
};

// Function for checking the uploaded file for nameing conventions
const validateNamingConvention = (file, namingConvention, setToast, t) => {
  const regx = new RegExp(namingConvention);
  if (regx && !regx.test(file.name)) {
    setToast({
      state: "error",
      message: t("ERROR_NAMEING_CONVENSION"),
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
        resolve(geoJSONData);
      } catch (error) {
        resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });
      }
    };
    reader.readAsText(file);
  });
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
      console.log(zip);
      const allFilesMatchRegex = files.every((fl) => {
        return fileRegex.test(fl);
      });
      let regx = new RegExp(namingConvension.replace(".zip$", ".shp$"));
      const shpFile = zip.file(regx)[0];
      regx = new RegExp(namingConvension.replace(".zip$", ".shx$"));
      const shxFile = zip.file(regx)[0];
      regx = new RegExp(namingConvension.replace(".zip$", ".dbf$"));
      const dbfFile = zip.file(regx)[0];

      const shpArrayBuffer = await shpFile.async("arraybuffer");
      const dbfArrayBuffer = await dbfFile.async("arraybuffer");

      const geojson = shp.combine([shp.parseShp(shpArrayBuffer), shp.parseDbf(dbfArrayBuffer)]);
      if (shpFile && dbfFile && shxFile && allFilesMatchRegex) resolve({ valid: true, data: geojson });
      else if (!shpFile)
        resolve({ valid: false, message: "ERROR_SHP_MISSING", toast: { state: "error", data: geojson, message: t("ERROR_PARSING_FILE") } });
      else if (!dbfFile)
        resolve({ valid: false, message: "ERROR_DBF_MISSING", toast: { state: "error", data: geojson, message: t("ERROR_PARSING_FILE") } });
      else if (!shxFile)
        resolve({ valid: false, message: "ERROR_SHX_MISSING", toast: { state: "error", data: geojson, message: t("ERROR_PARSING_FILE") } });
      else if (!allFilesMatchRegex)
        resolve({ valid: false, message: "ERROR_NAMEING_CONVENSION", toast: { state: "error", data: geojson, message: t("ERROR_PARSING_FILE") } });
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
  return prjText.includes("EPSG:4326");
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

// Custom icon component
const CustomIcon = (props) => {
  if (!props.Icon) return null;
  return <props.Icon fill={props.color} style={{}} {...props} />;
};

const Close = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#0B0C0C" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick} style={{ backgroundColor: "#FFFFFF" }}>
      <Close />
    </div>
  );
};

const AlternateButton = (props) => {
  return (
    <div className="altrady-have-template-button">
      <p>{props.text}</p>
    </div>
  );
};

const DownloadButton = (props) => {
  return (
    <div className="download-template-button">
      <div className="icon">
        <CustomIcon color={"white"} height={"24"} width={"24"} Icon={Icons.FileDownload} />
      </div>
      <p>{props.text}</p>
    </div>
  );
};

const ModalHeading = (props) => {
  return <p className="modal-header">{props.label}</p>;
};

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-inner" />
      </div>
      <div className="loader-text">File Uploading....</div>
    </div>
  );
};

export default Upload;
