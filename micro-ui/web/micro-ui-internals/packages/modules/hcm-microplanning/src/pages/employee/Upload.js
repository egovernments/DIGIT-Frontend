import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
// import { Config } from "../../configs/UploadConfig";
// import { SVG as Icons } from "@egovernments/digit-ui-react-components";
// import * as Icons from "@egovernments/digit-ui-react-components";
// import * as Icons from '@egovernments/digit-ui-svg-components'
import Config from "../../configs/UploadConfiguration.json"
console.log(Icons)
const Upload = ({ MicroplanName = "default" }) => {
    // Fetching data using custom MDMS hook
    const { isLoading, data } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getCurrentTenantId(), "hcm-microplanning", [
        { name: "UploadSections" },
    ]);

    // State to store sections and selected section
    const [sections, setSections] = useState([]);
    const [uploadOptions, setUploadOptions] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [modal, setModal] = useState("none");
    // Effect to update sections and selected section when data changes
    useEffect(() => {
        if (data) {
            const uploadSections = data["hcm-microplanning"]["UploadSections"];
            setSelectedSection(uploadSections.length > 0 ? uploadSections[0].id : null);
            // setSections(uploadSections);
            setSections(Config.UploadConfiguration.UploadSections);
            setUploadOptions(Config.UploadConfiguration.UploadFileTypes)
        }
    }, [data]);

    // Memoized section options to prevent unnecessary re-renders
    const sectionOptions = useMemo(
        () =>
            sections.map((item) => (
                <UploadSection key={item.id} item={item} selected={selectedSection === item.id} setSelectedSection={setSelectedSection} />
            )),
        [sections, selectedSection]
    );

    // Memoized section components to prevent unnecessary re-renders
    const sectionComponents = useMemo(
        () => sections.map((item) => <UploadComponents MicroplanName={MicroplanName} key={item.id} item={item} selected={selectedSection === item.id} uploadOptions={uploadOptions} setModal={setModal} />),
        [sections, selectedSection, uploadOptions]
    );

    const closeModal = () => {
        setModal("none");
    }
    const mobileView = Digit.Utils.browser.isMobile() ? true : false;

    return (
        <div className="jk-header-btn-wrapper microplanning">
            <div className="upload">
                <div className="upload-component">{sectionComponents}</div>
                <div className="upload-section-option">{sectionOptions}</div>
            </div>

            {modal === "upload-modal" &&
                // <Icons.CustomModal/>
                <Icons.Modal
                    // headerBarMain={<Heading label={""} />}
                    headerBarMain={"s"}
                    headerBarEnd={<CloseBtn onClick={closeModal} />}
                    actionCancelOnSubmit={closeModal}
                    formId="modal-action"
                    popupStyles={{  }}
                    style={{  }}
                    hideSubmit={false}
                    headerBarMainStyle={{ }}
                >
{/* asda */}
                </Icons.Modal>
            }
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
const UploadComponents = ({ MicroplanName, item, selected, uploadOptions, setModal }) => {
    const { t } = useTranslation();
    const title = item.title.toUpperCase();


    // Component for rendering individual upload option container
    const UploadOptionContainer = ({ item }) => {
        return (
            <div key={item.id} className="upload-option" onClick={() => setModal("upload-modal")}>
                <CustomIcon key={item.id} Icon={Icons[item.iconName]} color={"rgba(244, 119, 56, 1)"} />
                <p>{t("UPLOAD")} {t(item.code)}</p>
            </div>
        );
    };


    return (
        <div key={item.id} className={`${selected ? "upload-component-active" : "upload-component-inactive"}`}  >
            <div>
                <p className="greyedout-name">{t(MicroplanName)}</p>
                <h2>{t(`HEADING_UPLOAD_DATA_${title}`)}</h2>
                <p style={{ marginTop: "10px" }}>{t(`INSTRUCTIONS_DATA_UPLOAD_OPTIONS_${title}`)}</p>
            </div>
            <div className="upload-option-container" >{uploadOptions && uploadOptions.map((item) => <UploadOptionContainer key={item.id} item={item} />)}</div>
        </div>
    );
};

// Custom icon component
const CustomIcon = ({ Icon, color }) => {
    if (!Icon) return null;
    return <Icon  fill={color} style={{ outerWidth: "62px", outerHeight: "62px", }} />;
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
export default Upload;
