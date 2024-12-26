import { SubmitBar, LinkLabel, Label } from "@egovernments/digit-ui-react-components";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dropdown, TextBlock, TextInput, ButtonGroup, Button } from "@egovernments/digit-ui-components";

const CustomSearchComponent = ({ onProjectSelect }) => {
  const { t } = useTranslation();

  const [project, setProject] = useState([]);

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      // e.preventDefault();
    }
  };

  useEffect(() => {
    if (project.length == 0) {
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
    }
  }, []);

  console.log(project, "testing");

  const onSubmit = (data, e) => { };

  const clearSearch = () => { };

  const closeToast = () => {
    setShowToast(null);
  };

  const handleFilterRefresh = () => { };

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
      <Card variant="search">
        {/*<div style={{ maxWidth: "100%", width: "100%" }}>
          <TextBlock body={t("HCM_AM_ATTENDANCE_ID")}></TextBlock>
          <TextInput type="text"></TextInput>
        </div>*/}
        <div style={{ maxWidth: "100%", width: "100%" }}>
          <TextBlock body={`${t("ATTENDANCE_PROJECT_NAME")} *`}></TextBlock>
          <Dropdown
            t={t}
            option={project}
            name={"code"}
            optionKey={"name"}
            select={(value) => {
              onProjectSelect(value);
            }}
          />
        </div>

        <ButtonGroup buttonsArray={[
          <Button
            variation="teritiary"
            label={t(`HCM_AM_CLEAR`)}
            type="button"
            onClick={() => { }}
            size="large"
          />,
          <Button
            variation="primary"
            label={t(`HCM_AM_SEARCH`)}
            type="button"
            onClick={() => { }}
            size="large"
          />
        ]}></ButtonGroup>

        {/*showToast && <Toast 
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          isDleteBtn={true}
          onClose={closeToast} />
       */}
      </Card>
    </React.Fragment>
  );
};

export default CustomSearchComponent;
