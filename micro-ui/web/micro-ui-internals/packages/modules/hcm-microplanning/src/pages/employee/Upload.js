import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
// import { Config } from "../../configs/UploadConfig";
// import { SVG as Icons } from "@egovernments/digit-ui-react-components";
import { Modal } from "@egovernments/digit-ui-react-components";
import * as Icons from "@egovernments/digit-ui-svg-components";
import Config from "../../configs/UploadConfiguration.json";
console.log(Icons);
const Upload = ({ MicroplanName = "default" }) => {
  const { t } = useTranslation();

  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS('mz', "hcm-microplanning", [{ name: "UploadConfiguration" }]);

  // State to store sections and selected section
  const [sections, setSections] = useState([]);
  //   const [uploadOptions, setUploadOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modal, setModal] = useState("none");
  const [selectedFileType, setSelectedFileType] = useState("null");
  // Effect to update sections and selected section when data changes
  useEffect(() => {
    if (data) {
      console.log(data)
      const uploadSections = data["hcm-microplanning"]["UploadConfiguration"];
      console.log(data["hcm-microplanning"])
      setSelectedSection(uploadSections.length > 0 ? uploadSections[0].id : null);
      // setSections(uploadSections);
      setSections(uploadSections);
      //   setUploadOptions(Config.UploadConfiguration.UploadFileTypes);
    }
  }, [data]);

  // Memoized section options to prevent unnecessary re-renders
  const sectionOptions = useMemo(() => {
    if (!sections) return [];
    return sections.map((item) => (
      <UploadSection key={item.id} item={item} selected={selectedSection === item.id} setSelectedSection={setSelectedSection} />
    ));
  }, [sections, selectedSection]);

  const selectFileTypeHandler = (e) => {
    console.log(e);
    console.log(e.target.name);
    setSelectedFileType(e.target.name);
    setModal("upload-modal");
  };

  // Memoized section components to prevent unnecessary re-renders
  const sectionComponents = useMemo(
    () =>
      sections.map((item) => (
        <UploadComponents
          key={item.id}
          item={item}
          selected={selectedSection === item.id}
          uploadOptions={item.UploadFileTypes}
          selectedFileType={selectedFileType}
          selectFileTypeHandler={selectFileTypeHandler}
        />
      )),
    [sections, selectedSection, selectedFileType]
  );

  const closeModal = () => {
    setModal("none");
    setSelectedFileType("none");
  };
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
//   sections.length>0 && selectedSection?console.log(sections.find((item) => {console.log(item.id  === selectedSection); return item.id  === selectedSection.id}).id):""
  return (
    <div className="jk-header-btn-wrapper microplanning">
      <div className="upload">
        <div className="upload-component">{sectionComponents}</div>
        <div className="upload-section-option">{sectionOptions}</div>
      </div>


      {modal === "upload-modal" && (
        // <Icons.CustomModal/>
        <Modal
          // headerBarMain={<Heading label={""} />}
          headerBarMain={<ModalHeading label={t("HEADING_DOWNLOAD_EXCEL_TEMPLATE_FOR_" + (sections.length>0 && selectedSection?sections.find((item) =>  item.id  === selectedSection).id.toUpperCase()+"_"+selectedFileType.toUpperCase():""))}/>}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelOnSubmit={closeModal}
          formId="modal-action"
          popupStyles={{}}
          actionCancelLabel="as"
          style={{}}
          hideSubmit={false}
          footerLeftButtonstyle={{ alignSelf: "start", backgroundColor: "red" }}
          footerRightButtonstyle={{ alignSelf: "end" }}
          headerBarMainStyle={{}}
        >
          <p>{t("HEADING_DOWNLOAD_EXCEL_TEMPLATE_FOR_" + (sections.length>0 && selectedSection?sections.find((item) =>  item.id  === selectedSection).id.toUpperCase()+"_"+selectedFileType.toUpperCase():""))}</p>
        </Modal>
      )}
    </div>
  );
};

// Component for rendering individual section option
const UploadSection = ({ item, selected, setSelectedSection }) => {
  const { t } = useTranslation();
  // Handle click on section option
  const handleClick = () => {
    setSelectedSection(item.id);
  };

  return (
    <div className={`upload-section-options ${selected ? "upload-section-options-active" : "upload-section-options-inactive"}`} onClick={handleClick}>
      <div style={{ padding: "0 10px" }}>
        <CustomIcon Icon={Icons[item.iconName]} color={selected ? "rgba(244, 119, 56, 1)" : "rgba(214, 213, 212, 1)"} />
      </div>
      <p>{t(item.title)}</p>
      <div style={{ marginLeft: "auto", marginRight: 0 }}>
        <CustomIcon Icon={Icons["TickMarkBackgroundFilled"]} color={"rgba(255, 255, 255, 0)"} />
      </div>
    </div>
  );
};

// Component for rendering individual upload option
const UploadComponents = ({ item, selected, uploadOptions, selectedFileType, selectFileTypeHandler }) => {
  const { t } = useTranslation();
  const title = item.title.toUpperCase();

  // Component for rendering individual upload option container
  const UploadOptionContainer = ({ item, selectedFileType, selectFileTypeHandler }) => {
    return (
      <div
        key={item.id}
        className="upload-option"
        style={selectedFileType === item.id ? { border: "2px rgba(244, 119, 56, 1) solid", color: "rgba(244, 119, 56, 1)" } : {}}
      >
        <CustomIcon key={item.id} Icon={Icons[item.iconName]} color={"rgba(244, 119, 56, 1)"} />
        <p>{t(item.code)}</p>
        {/* <ButtonSelector textStyles={{margin:"0px"}} theme="border" label={selectedFileType === item.id?t("Selected"):t("Select ")} onSubmit={selectFileTypeHandler} style={{}}/> */}
        <button
          className={selectedFileType === item.id ? "selected-button" : "select-button"}
          type="button"
          id={item.id}
          name={item.id}
          onClick={selectFileTypeHandler}
        >
          {selectedFileType === item.id && <CustomIcon Icon={Icons["TickMarkBackgroundFilled"]} color={"rgba(255, 255, 255, 0)"} />}
          {selectedFileType === item.id ? t("Selected") : t("Select ")}
        </button>
      </div>
    );
  };

  return (
    <div key={item.id} className={`${selected ? "upload-component-active" : "upload-component-inactive"}`}>
      <div>
        <h2>{t(`HEADING_UPLOAD_DATA_${title}`)}</h2>
        <p style={{ marginTop: "10px" }}>{t(`INSTRUCTIONS_DATA_UPLOAD_OPTIONS_${title}`)}</p>
      </div>
      <div className={selectedFileType === item.id ? " upload-option-container-selected" : "upload-option-container"}>
        {/* <div className={selectedFileType === item.id ? " upload-option-container-selected" : ""}> */}
        {uploadOptions &&
          uploadOptions.map((item) => (
            <UploadOptionContainer key={item.id} item={item} selectedFileType={selectedFileType} selectFileTypeHandler={selectFileTypeHandler} />
          ))}
      </div>
      {/* </div> */}
    </div>
  );
};

// Custom icon component
const CustomIcon = ({ Icon, color }) => {
  if (!Icon) return null;
  return <Icon fill={color} style={{ outerWidth: "62px", outerHeight: "62px" }} />;
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

const ModalHeading = (props) => {
  return <p className="modal-header">{props.label}</p>;
};
export default Upload;
