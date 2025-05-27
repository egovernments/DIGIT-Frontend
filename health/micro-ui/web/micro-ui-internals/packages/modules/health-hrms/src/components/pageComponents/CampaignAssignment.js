import { CardLabel, Dropdown, LabelFieldPair, Loader, CardText, TextInput, Button, PopUp } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { SVG } from "@egovernments/digit-ui-components";

const CampaignsAssignment = ({ t, config, onSelect, formData }) => {
  const assignedProjects = Digit.SessionStorage.get("staffProjects");
  const userProjectDetails = assignedProjects?.map((project) => ({
    id: project?.id,
    projectType: project?.projectType,
    projectTypeId: project?.projectTypeId,
    boundary: project?.address?.boundary,
    boundaryType: project?.address?.boundaryType,
    i18text: `${project?.projectType}_${project?.address?.boundary}`.toUpperCase(),
  }));
  const [campaigns, setCampaigns] = useState(
    formData?.CampaignsAssignment?.length > 0 ? formData?.CampaignsAssignment : [{ selectedProject: "", fromDate: "", toDate: "" }]
  );
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [selectedCampaignIndex, setSelectedCampaignIndex] = useState(null);


  useEffect(() => {
    if (formData?.CampaignsAssignment?.length > 0) {
      setCampaigns(formData.CampaignsAssignment);
    }
  }, [formData?.CampaignsAssignment]);

  const handleAddUnit = () => {
    const newCampaign = { selectedProject: "", fromDate: "", toDate: "" };
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const handleRemoveUnit = (index) => {
    const updatedCampaigns = campaigns?.filter((_, i) => i !== index);
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const handleProjectSelect = (index, project) => {
    const updatedCampaigns = campaigns?.map((campaign, i) => (i === index ? { ...campaign, selectedProject: project } : campaign));
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const handleDateChange = (index, field, value) => {
    const updatedCampaigns = campaigns?.map((campaign, i) => (i === index ? { ...campaign, [field]: value } : campaign));
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const getAvailableProjects = (index) => {
    const selectedProjects = campaigns?.filter((_, i) => i !== index).map((campaign) => campaign.selectedProject?.id);

    return userProjectDetails?.filter((project) => !selectedProjects.includes(project.id));
  };

  return (
    <div>
      {campaigns.map((campaign, index) => {
        const availableProjects = getAvailableProjects(index);

        return (
          <div
            key={index}
            style={{
              marginBottom: "16px",
              border: "1px solid #E3E3E3",
              padding: "16px",
              marginTop: "8px",
            }}
          >
            <LabelFieldPair>
              <div className="label-field-pair" style={{ width: "100%" }}>
                <h2
                  className="card-label card-label-smaller"
                  style={{
                    color: "#505A5F",
                    fontWeight: "bold",
                  }}
                >
                  {t("HR_CAMPAIGN_ASSIGNMENT")} {index + 1}
                </h2>
              </div>
              {campaigns.length > 1 && (
                <div
                  onClick={() => handleRemoveUnit(index)}
                  style={{
                    marginBottom: "16px",
                    padding: "5px",
                    cursor: "pointer",
                    textAlign: "right",
                  }}
                >
                  <SVG.DeleteOutline fill="red" className="toast-close-btn" />
                </div>
              )}
            </LabelFieldPair>

            {/* Campaign Name Dropdown */}
            <LabelFieldPair>
              <CardLabel className={"card-label-smaller"}>
                {t("HR_CAMPAIGN_NAME_LABEL")} {availableProjects.length > 1 ? "*" : ""}
              </CardLabel>
              <Button
                variation="secondary"
                label={campaign.selectedProject?.i18text || t("HR_SELECT_CAMPAIGN")}
                onClick={() => {
                  setSelectedCampaignIndex(index);
                  setShowProjectPopup(true);
                }}
              />
              {showProjectPopup && (
                <PopUp
                  className="project-search-popup"
                  type="default"
                  heading={t("HR_SELECT_PROJECT")}
                  onOverlayClick={() => setShowProjectPopup(false)}
                  children={[
                    <div>
                    <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_TEXT") + " "}</CardText>
                  </div>,
                  ]}
                  onClose={() => setShowProjectPopup(false)}
                  footerChildren={null}
                >
                </PopUp>
              )}
              {/* <Dropdown
                className="form-field"
                selected={availableProjects.find((project) => project.id === campaign.selectedProject?.id) || null}
                optionKey={"i18text"}
                option={availableProjects}
                select={(value) => handleProjectSelect(index, value)}
                t={t}
              /> */}
            </LabelFieldPair>

            {/* From Date Picker */}
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">{t("HR_CAMPAIGN_FROM_DATE_LABEL")}</CardLabel>
              <div className="digit-field">
                <TextInput
                  type="date"
                  populators={{ name: "date" }}
                  onChange={(e) => {
                    handleDateChange(index, "fromDate", e);
                  }}
                  value={campaign?.fromDate}
                  key={"fromDate"}
                  disable={false}
                  required={true}
                />
              </div>
            </LabelFieldPair>

            {/* To Date Picker */}
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">{t("HR_CAMPAIGN_TO_DATE_LABEL")}</CardLabel>
              <div className="digit-field">
                <TextInput
                  type="date"
                  populators={{ name: "date" }}
                  onChange={(e) => {
                    handleDateChange(index, "toDate", e);
                  }}
                  value={formData && formData[config.key] ? formData[config.key][index].toDate : undefined}
                  key={"toDate"}
                  disable={false}
                />
              </div>
            </LabelFieldPair>
          </div>
        );
      })}

      {formData?.CampaignsAssignment?.length == userProjectDetails?.length ? (
        <div />
      ) : (
        <label
          onClick={handleAddUnit}
          className="link-label"
          style={{
            width: "12rem",
            cursor: "pointer",
            marginTop: "16px",
          }}
        >
          {t("ADD_UNIT")}
        </label>
      )}
    </div>
  );
};

export default CampaignsAssignment;
