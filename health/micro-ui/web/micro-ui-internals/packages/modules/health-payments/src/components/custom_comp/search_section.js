import { Dropdown, TextInput, SubmitBar, LinkLabel, Label } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomSearchComponent = ({ header = "", screenType = "search" }) => {
  const { t } = useTranslation();

  const [project, setProject] = useState([]);

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      // e.preventDefault();
    }
  };

  useEffect(() => {
    let datak =
      Digit?.SessionStorage.get("staffProjects") ||
      [].map((target) => ({
        code: target.id,
        projectType: target.projectType,
        name: target.name,
        boundary: target?.address?.boundary,
        boundaryType: target?.address?.boundaryType,
        projectHierarchy: target.projectHierarchy,
      }));
    setProject(datak);
  }, []);

  console.log(project, "testing");

  const onSubmit = (data, e) => {};

  const clearSearch = () => {};

  const closeToast = () => {
    setShowToast(null);
  };

  const handleFilterRefresh = () => {};

  const renderHeader = () => {
    return (
      <div className="filter-header-wrapper">
        <div className="icon-filter"></div>
        <div className="label">{t("header")}</div>
        <div className="icon-refresh" onClick={handleFilterRefresh}></div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={"search-wrapper"}>
        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <span style={{ width: "30%" }}>
            <Label>{t("ATTENDANCE_ID")}</Label>
            <TextInput></TextInput>
          </span>
          <span style={{ width: "10%" }}></span>
          <span style={{ width: "55%" }}>
            <Label>{t("ATTENDANCE_PROJECT_NAME")}</Label>
            <Dropdown
              t={t}
              option={project}
              name={"code"}
              optionKey={"name"}
              select={(value) => {
                //handleChange(value);
              }}
              disabled={false}
              style={{ display: "flex", width: "55%" }}
            ></Dropdown>
          </span>
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "5px", alignItems: "baseline", justifyContent: "flex-end" }}>
          <LinkLabel style={{ width: "10%" }} onClick={() => {}}>
            {t("Clear Search")}
          </LinkLabel>

          <SubmitBar
            label={t("Search")}
            onSubmit={(e) => {
              // handleSubmit(onSubmit)(e);
              // onSubmit(formData, e)
            }}
            disabled={false}
          ></SubmitBar>
        </div>

        {/*showToast && <Toast 
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          isDleteBtn={true}
          onClose={closeToast} />
       */}
      </div>
    </React.Fragment>
  );
};

export default CustomSearchComponent;
