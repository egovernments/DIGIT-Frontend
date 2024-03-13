import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
// import { Config } from "../../configs/UploadConfig";
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
const Upload = ({ MicroplanName = "default" }) => {
  const { t } = useTranslation();

  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "UploadConfiguration" }]);

  // State to store sections and selected section
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modal, setModal] = useState("none");
  const [selectedFileType, setSelectedFileType] = useState("none");
  const [dataPresent, setDataPresent] = useState(false);
  const [dataUpload, setDataUpload] = useState(false);
  const [loaderActivation, setLoderActivation] = useState(false);
  const [fileData, setFileData] = useState();
  const [toast, setToast] = useState();
  const [uploadedFileError, setUploadedFileError] = useState();
  const [fileDataList,setFileDataList] = useState({});
  // Effect to update sections and selected section when data changes
  useEffect(() => {
    if (data) {
      // let uploadSections = data["hcm-microplanning"]["UploadConfiguration"];
      let uploadSections = Config["UploadConfiguration"];
      setSelectedSection(uploadSections.length > 0 ? uploadSections[0] : null);
      setSections(uploadSections);
    }
  }, [data]);

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
    setSelectedFileType(selectedSection.UploadFileTypes.find((item) => item.id === e.target.name));
    setModal("upload-modal");
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
        selectedFileType={selectedFileType}
        selectFileTypeHandler={selectFileTypeHandler}
      />
    ));
  }, [sections, selectedSection, selectedFileType]);

  const closeModal = () => {
    setModal("none");
    setSelectedFileType("none");
  };

  const UploadFileClickHandler = (download = false) => {
    if (download) {
      downloadTemplate(setToast);
    }
    setModal("none");
    setDataUpload(true);
  };

  useEffect(() => {
    const checkfile = async (file) => {
      try {
            console.log(file.fileType);
            setUploadedFileError(file.error);
            setSelectedFileType(selectedSection.UploadFileTypes.find((item) => item.id === file.fileType));
      } catch (error) {
        console.log(error);
        setUploadedFileError("ERROR_PARSING_FILE");
      }
    };

    if (selectedSection && selectedFileType) {
      // const file = Digit.SessionStorage.get(`Microplanning_${selectedSection.id}`);
      let file = fileDataList[`Microplanning_${selectedSection.id}`];
      console.log(file)
      if (file && file.file) {
        setDataPresent(true);
        checkfile(file);
        setFileData(file);
      } else setDataPresent(false);
    } else {
      setDataPresent(false);
    }

    setSelectedFileType("none");
    setDataUpload(false);
  }, [selectedSection]);
  // const mobileView = Digit.Utils.browser.isMobile() ? true : false;

  const UploadFileToFileStorage = async (file) => {
    // const response =  await Digit.UploadServices.Filestorage("engagement", file, Digit.ULBService.getStateId());
    try {
      setLoderActivation(true);
      console.log(file);
      let result;
      let check;
      let filetoStore;
      let error;
      let response;
      console.log(selectedFileType);
      switch (selectedFileType.id) {
        case "Excel":
          result = await parseXlsxToJsonMultipleSheets(file);
          response = await checkForErrorInUploadedFileExcel(result,t);
          if(!response.valid) setUploadedFileError(response.message)
          error=response.message;
        console.log(response)
          check = response.valid;
          filetoStore = await parseXlsxToJsonMultipleSheets(file, { header: 1 });
          break;
        case "GeoJson":
          const data = await readGeojson(file,t);
          if(data.valid == false){
            setLoderActivation(false);
            setToast(data.toast);
            return;
          }
          response = geojsonValidations(data,t);
          if(!response.valid) setUploadedFileError(response.message)
          check = response.valid;
          error=response.message;
          filetoStore = data;
      }
      let fileObject = {
        id: `Microplanning_${selectedSection.id}`,
        fileName: file.name,
        section: selectedSection.id,
        fileType: selectedFileType.id,
        file: filetoStore,
        error:error?error:null
      };
      setFileData(fileObject);
      setFileDataList({...fileDataList,[fileObject.id]:fileObject});
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

  // Reupload the selected file
  const reuplaodFile = () => {
    setFileData(undefined);
    setDataPresent(false);
    setUploadedFileError(null);
    setDataUpload(false);
    closeModal();
  };

  // Download the selected file
  const downloadFile = () => {
    const blob = convertJsonToXlsx(fileData.file, { skipHeader: true });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileData.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // delete the selected file
  const deleteDelete = () => {
    Digit.SessionStorage.del(fileData.id);
    setFileData(undefined);
    setDataPresent(false);
    closeModal();
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
      <p>{t(item.title)}</p>
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
        {/* <ButtonSelector textStyles={{margin:"0px"}} theme="border" label={selectedFileType === item.id?t("Selected"):t("Select ")} onSubmit={selectFileTypeHandler} style={{}}/> */}
        <button
          className={selectedFileType.id === item.id ? "selected-button" : "select-button"}
          type="button"
          id={item.id}
          name={item.id}
          onClick={selectFileTypeHandler}
        >
          {selectedFileType.id === item.id && <CustomIcon Icon={Icons["TickMarkBackgroundFilled"]} color={"rgba(255, 255, 255, 0)"} />}
          {selectedFileType.id === item.id ? t("Selected") : t("Select ")}
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
        {/* <div className={selectedFileType === item.id ? " upload-option-container-selected" : ""}> */}
        {uploadOptions &&
          uploadOptions.map((item) => (
            <UploadOptionContainer key={item.id} item={item} selectedFileType={selectedFileType} selectFileTypeHandler={selectFileTypeHandler} />
          ))}
      </div>
    </div>
  );
};

// Component for uploading file/files
const FileUploadComponent = ({ selectedSection, selectedFileType, UploadFileToFileStorage, section }) => {
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
          <div className="download-template-button" onClick={() => downloadTemplate(setToast)}>
            <div className="icon">
              <CustomIcon color={"rgba(244, 119, 56, 1)"} height={"24"} width={"24"} Icon={Icons.FileDownload} />
            </div>
            <p>{t("DOWNLOAD_TEMPLATE")}</p>
          </div>
        </div>
        <p>{t(`INSTRUCTIONS_FILE_UPLOAD_FROM_TEMPLATE_${selectedSection.code}`)}</p>
        <FileUploader handleChange={UploadFileToFileStorage} label={"idk"} multiple={false} name="file" types={types}>
          <div className="upload-file">
            <CustomIcon Icon={Icons.FileUpload} width={"2.5rem"} height={"3rem"} color={"rgba(177, 180, 182, 1)"} />
            <p className="">
              {t(`INSTRUCTIONS_UNLOAD_${selectedFileType.code}`)} <text className="browse-text">{t("INSTRUCTIONS_UNLOAD_BROWSE_FILES")}</text>
            </p>
          </div>
        </FileUploader>
        {/* children={dragDropJSX} onTypeError={fileValidator} /> */}
      </div>
    </div>
  );
};

// Component to display uploaded file
const UploadedFile = ({ selectedSection, selectedFileType, file, ReuplaodFile, DownloaddFile, DeleteDelete, error }) => {
  const { t } = useTranslation();
  return (
    <div key={selectedSection.id} className="upload-component-active">
      <div>
        <div className="heading">
          <h2>{t(`HEADING_FILE_UPLOAD_${selectedSection.code}_${selectedFileType.code}`)}</h2>
          <div className="download-template-button" onClick={() => downloadTemplate(setToast)}>
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

const downloadTemplate = (setToast) => {
  try {
    const blob = convertJsonToXlsx(excelTemplate.excelTemplate[0].excelTemplate, { skipHeader: true });

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

const readGeojson = async (file,t) => {

  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geoJSONData = JSON.parse(e.target.result);
        resolve(geoJSONData);
      } catch (error) {
        resolve({valid:false,toast:{ state: "error", message: t("ERROR_PARSING_FILE") }});
      }
    };
    reader.readAsText(file);
  });
};

// Custom icon component
const CustomIcon = (props) => {
  if (!props.Icon) return null;
  return <props.Icon fill={props.color} style={{ outerWidth: "62px", outerHeight: "62px" }} {...props} />;
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
