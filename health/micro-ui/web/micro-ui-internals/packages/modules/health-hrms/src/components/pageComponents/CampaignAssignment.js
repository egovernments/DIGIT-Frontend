import { CardLabel, Dropdown, LabelFieldPair, Loader, DatePicker, TextInput } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
//import { DeleteIcon } from "../../../../../../../../..";
import { SVG } from "@egovernments/digit-ui-components";
import { convertEpochToDate } from "../Utils";

const CampaignsAssignment = ({ t, config, onSelect, formData }) => {
  const assignedProjects = Digit.SessionStorage.get("staffProjects");
  const userProjectDetails = assignedProjects?.map((project) => ({
    id: project?.id,
    projectType: project?.projectType,
    projectTypeId: project?.projectTypeId,
    boundary: project?.address?.boundary,
    boundaryType: project?.address?.boundaryType,
    i18text: `${project?.name}_${project?.address?.boundary}`,
  }));
  const [campaigns, setCampaigns] = useState(
    formData?.CampaignsAssignment?.length > 0 ? formData?.CampaignsAssignment : [{ selectedProject: null, fromDate: null, toDate: null }]
  );
  debugger;
  useEffect(() => {
    if (formData?.CampaignsAssignment?.length > 0) {
      setCampaigns(formData.CampaignsAssignment);
    }
  }, [formData?.CampaignsAssignment]);

  const handleAddUnit = () => {
    const newCampaign = { selectedProject: null, fromDate: null, toDate: null };
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const handleRemoveUnit = (index) => {
    const updatedCampaigns = campaigns.filter((_, i) => i !== index);
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const handleProjectSelect = (index, project) => {
    const updatedCampaigns = campaigns.map((campaign, i) => (i === index ? { ...campaign, selectedProject: project } : campaign));
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const handleDateChange = (index, field, value) => {
    const updatedCampaigns = campaigns.map((campaign, i) => (i === index ? { ...campaign, [field]: value } : campaign));
    setCampaigns(updatedCampaigns);
    onSelect(config.key, updatedCampaigns);
  };

  const getAvailableProjects = (index) => {
    const selectedProjects = campaigns.filter((_, i) => i !== index).map((campaign) => campaign.selectedProject?.id);

    return userProjectDetails.filter((project) => !selectedProjects.includes(project.id));
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
              <Dropdown
                className="form-field"
                selected={availableProjects.find((project) => project.id === campaign.selectedProject?.id) || null}
                optionKey={"i18text"}
                option={availableProjects}
                select={(value) => handleProjectSelect(index, value)}
                t={t}
              />
            </LabelFieldPair>

            {/* From Date Picker */}
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">{t("HR_CAMPAIGN_FROM_DATE_LABEL")}</CardLabel>
              <div className="digit-field">
                {/* <DatePicker
                  type="date"
                  name="fromDate"
                  min={convertEpochToDate(campaign?.selectedProject?.startDate)}
                  date={campaign?.fromDate}
                  onChange={(e) => handleDateChange(index, "fromDate", e)}
                />*/}

                <TextInput
                  // populators={{
                  //   validation: { ...input.validation },
                  // }}
                  type="date"
                  populators={{ name: "date" }}
                  onChange={(e) => {
                    // setDate(e || "");
                    handleDateChange(index, "fromDate", e);
                  }}
                  // value={date}
                  value={formData && formData[config.key] ? formData[config.key][index].fromDate : undefined}
                  key={"fromDate"}
                  disable={false}
                />
              </div>
            </LabelFieldPair>

            {/* To Date Picker */}
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">{t("HR_CAMPAIGN_TO_DATE_LABEL")}</CardLabel>
              <div className="digit-field">
                {/*<DatePicker
                  type="date"
                  name="toDate"
                  disabled={!campaign?.fromDate}
                  max={convertEpochToDate(campaign?.selectedProject?.endDate)}
                  date={campaign?.toDate}
                  onChange={(e) => handleDateChange(index, "toDate", e)}
                />*/}
                <TextInput
                  // populators={{
                  //   validation: { ...input.validation },
                  // }}
                  type="date"
                  populators={{ name: "date" }}
                  onChange={(e) => {
                    // setDate(e || "");
                    handleDateChange(index, "toDate", e);
                  }}
                  // value={date}
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
