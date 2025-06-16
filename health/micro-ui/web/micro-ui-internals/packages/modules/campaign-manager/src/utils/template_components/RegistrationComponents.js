import { Button, Switch, FieldV1, RoundedLabel, CustomSVG, SummaryCardFieldPair } from "@egovernments/digit-ui-components";
import React from "react";
import SearchBeneficiaryRegistrationWrapper from "../../components/SearchBeneficiaryRegistrationWrapper";
import { registerComponent } from "./RegistrationRegistry";
import AppPreviewResponse from "../../components/AppPreviewResponse";
import HouseHoldOverViewWrapper from "../../components/HouseHoldOverViewWrapper";





const SearchBar = (props) => (
  <div style={{ width: "100%" }}>
    <FieldV1
      style={{ width: "100%" }}
      onChange={function noRefCheck() { }}
      placeholder={props.t(props.field.label) || "LABEL"}
      type="search"
      populators={{
        fieldPairClassName: `app-preview-field-pair`
      }
      }
    />
  </div>
);


const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.250666 1.61C2.27067 4.2 6.00067 9 6.00067 9V15C6.00067 15.55 6.45067 16 7.00067 16H9.00067C9.55067 16 10.0007 15.55 10.0007 15V9C10.0007 9 13.7207 4.2 15.7407 1.61C16.2507 0.95 15.7807 0 14.9507 0H1.04067C0.210666 0 -0.259334 0.95 0.250666 1.61Z" fill="#C84C0E" />
  </svg>

);
const Filter = (props) => (
  <div className="digit-search-action">
    {/* <RoundedLabel count={props.filterCount}></RoundedLabel> */}
    <FilterIcon /> <span className="digit-search-text">{props.t(props.field.label) || "LABEL"}</span>
  </div>
);


const ProximitySearch = (props) => (
  <Switch
    label={props.t(props.field.label) || "LABEL"}
    onToggle={null}
    isCheckedInitially={true}
    shapeOnOff
  />
);



// household

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: "16px", minHeight: "16px" }}>
    <path
      d="M9.126 5.12579L11.063 3.18879L14.81 6.93579L12.873 8.87379L9.126 5.12579ZM17.71 2.63079L15.37 0.290793C15.1826 0.104542 14.9292 0 14.665 0C14.4008 0 14.1474 0.104542 13.96 0.290793L12.13 2.12079L15.88 5.87079L17.71 4.00079C17.8844 3.81533 17.9815 3.57035 17.9815 3.31579C17.9815 3.06123 17.8844 2.81625 17.71 2.63079ZM5.63 8.63079L0 14.2508V18.0008H3.75L9.38 12.3808L12.873 8.87379L9.126 5.12579L5.63 8.63079Z"
      fill="#F47738"
    />
  </svg>
);

const EditButton = (props) => {
  const { label = "LABEL", onClick, alignment = "flex-end", hidden = false } = props;
  if (hidden) return null;
  return (
    <div style={{ display: "flex", justifyContent: alignment, width: "100%" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "8px 16px",
          background: "#FFFFFF",
          color: "rgba(244, 119, 56, 1)",
          borderRadius: "4px",
          cursor: "pointer",
          fontFamily: "Roboto, sans-serif",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "100%",
          textTransform: "capitalize",
          border: "none",
        }}
        className="digit-search-action"
        onClick={onClick}
      >
        <EditIcon />
        <span className="digit-search-text">{label}</span>
      </div>
    </div>
  );
};

// household member card

const ContentDetails = (props) => {
  const householdDetails = [
    { label: "HOUSEHOLD_HEAD", value: "Value" },
    { label: "ADMINSTRATIVE_AREA", value: "value" },
    { label: "MEMBER_COUNT", value: 5 },
  ];
  return (
    <div>
      {householdDetails.map((pair, index) => (
        <div>
          <SummaryCardFieldPair
            key={index} // Provide a unique key for each item
            className=""
            inline
            label={props.t(pair.label)} // Dynamically set the label
            value={props.t(pair.value)} // Dynamically set the value
          // style={{ fontSize: "16px", fontWeight: "bold" }} // Optional: customize styles
          />
        </div>
      ))}
    </div>
  );
};

const HouseholdOverViewMemberCard = (props) => {
  const attributes = props.attributes || [{ label: "Gender", value: "Female" },
  { label: "Age", value: "30 years" },
  { label: "Relationship", value: "Mother" },
  { label: "Status", value: "Verified" }];
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.name}>
          <strong>{props.name}</strong>
        </div>
        <EditButton label={props.editIndividual?.label} hidden={props.editIndividual?.hidden} onClick={() => console.log("Edit Individual")} />
      </div>
      {/*<div style={styles.details}>
        <span>{props.gender}</span>
        <div style={styles.separator} />
        <span>{props.age} years</span>
      </div>*/}
      {/* Dynamically Render Attributes */}
      <div style={styles.details}>
        {attributes.map((attr, index) => (
          <React.Fragment>
            <span>{attr.value}</span>
            {index < attributes.length - 1 && <div style={styles.separator} />}
          </React.Fragment>
        ))}
      </div>


      {/* Two Center Buttons */}


      <div style={styles.buttonGroup}>
        {!(props.smcPrimaryBtn?.hidden) && (
          <Button
            key={0}
            variation="primary"
            label={props.smcPrimaryBtn?.label || "LABEL"}
            title={props.smcPrimaryBtn?.label || "LABEL"}
            onClick={() => { }}
          />
        )}

        {!(props.smcSecondaryBtn?.hidden) && (
          <Button
            key={1}
            variation="secondary"
            label={props.smcSecondaryBtn?.label || "LABEL"}
            title={props.smcSecondaryBtn?.label || "LABEL"}
            onClick={() => { }}
          />
        )}
      </div>

    </div>
  );
};

const styles = {
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // horizontally center the buttons
    gap: "8px",
    marginTop: "10px",          // space between the buttons

  },
  card: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "12px 16px",
    fontFamily: "sans-serif",
    fontSize: "14px",
    color: "#4a4a4a",
    backgroundColor: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    width: "100%",
  },
  name: {
    fontSize: "16px",
    color: "#333",
    flex: 1, // take available space
  },
  relation: {
    color: "#d32f2f",
    marginLeft: "4px",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#f26a21",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "14px",
  },
  editText: {
    marginLeft: "4px",
    color: "#f26a21",
    fontWeight: "500",
  },
  details: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#4a4a4a",
  },
  separator: {
    width: "1px",
    height: "16px",
    backgroundColor: "#aaa",
  },
};

// Register all components
registerComponent("searchBar", SearchBar);
registerComponent("filter", Filter);
registerComponent("searchByProximity", ProximitySearch);
registerComponent("SearchBeneficiary", SearchBeneficiaryRegistrationWrapper);
registerComponent("HouseholdAcknowledgement", AppPreviewResponse);
registerComponent("HouseholdOverview", HouseHoldOverViewWrapper);
registerComponent("EditButton", EditButton);
registerComponent("ContentDetails", ContentDetails);
registerComponent("HouseholdOverViewMemberCard", HouseholdOverViewMemberCard);
