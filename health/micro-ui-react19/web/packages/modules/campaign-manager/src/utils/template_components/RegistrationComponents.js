import {
  ResultsDataTable,
  Button,
  Switch,
  FieldV1,
  CustomSVG,
  SummaryCardFieldPair,
  PanelCard,
  PopUp,
  SVG,
} from "@egovernments/digit-ui-components";
import React, { useEffect, useMemo, useState } from "react";
import { registerComponent } from "./RegistrationRegistry";
import RenderSelectionField from "../../components/RenderSelectionField";

const responsePanelComponent = ({ components, t }) => {
  const titleField = components.find((f) => f.jsonPath === "AcknowledgementTitle" && !f.hidden);
  const descField = components.find((f) => f.jsonPath === "AcknowledgementDescription" && !f.hidden);

  const message = titleField ? t(titleField?.label) : "";
  const description = descField ? t(descField?.label) : "";

  return (
    <PanelCard
      message={message}
      description={description}
      type="success"
      cardClassName={"app-preview-selected"}
      style={{ marginBottom: "1rem" }}
      showAsSvg={true}
    />
  );
};
const SearchBar = (props) => (
  <div style={{ width: "100%" }}>
    <FieldV1
      style={{ width: "100vh" }}
      onChange={function noRefCheck() {}}
      placeholder={props.t(props.field?.label) || "LABEL"}
      type="search"
      populators={{
        fieldPairClassName: `app-preview-field-pair`,
      }}
    />
  </div>
);

const FilterIcon = (props) => (
  <svg onClick={props?.onClick} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.250666 1.61C2.27067 4.2 6.00067 9 6.00067 9V15C6.00067 15.55 6.45067 16 7.00067 16H9.00067C9.55067 16 10.0007 15.55 10.0007 15V9C10.0007 9 13.7207 4.2 15.7407 1.61C16.2507 0.95 15.7807 0 14.9507 0H1.04067C0.210666 0 -0.259334 0.95 0.250666 1.61Z"
      fill="#C84C0E"
    />
  </svg>
);
const Filter = (props) => {
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <div className="digit-search-action" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <FilterIcon onClick={() => setShowPopUp(true)} />
      <span className="digit-search-text" style={{ color: "#C84C0E" }}>
        {props.t(props.field.label) || "LABEL"}
      </span>

      {showPopUp && (
        <PopUp
          className={"custom-popup-filter"}
          type={"default"}
          heading={props.t("SELECT_FILTER")}
          onClose={() => setShowPopUp(false)}
          style={{
            width: "100%", // Full width popup
            maxWidth: "100%", // Prevents shrinking
            height: "auto",
            margin: 0,
            padding: 0,
          }}
          footerChildren={[]}
          sortFooterChildren={true}
        >
          <div
            style={{
              width: "100%", // Take full popup width
              padding: "1rem",
              boxSizing: "border-box",
            }}
          >
            <RenderSelectionField field={props.field} t={props.t} />
          </div>
        </PopUp>
      )}
    </div>
  );
};

const Toggle = (props) => <Switch label={props.t(props.field?.label) || "LABEL"} onToggle={null} isCheckedInitially={true} shapeOnOff />;

// household

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ minWidth: "16px", minHeight: "16px" }}
  >
    <path
      d="M9.126 5.12579L11.063 3.18879L14.81 6.93579L12.873 8.87379L9.126 5.12579ZM17.71 2.63079L15.37 0.290793C15.1826 0.104542 14.9292 0 14.665 0C14.4008 0 14.1474 0.104542 13.96 0.290793L12.13 2.12079L15.88 5.87079L17.71 4.00079C17.8844 3.81533 17.9815 3.57035 17.9815 3.31579C17.9815 3.06123 17.8844 2.81625 17.71 2.63079ZM5.63 8.63079L0 14.2508V18.0008H3.75L9.38 12.3808L12.873 8.87379L9.126 5.12579L5.63 8.63079Z"
      fill="#F47738"
    />
  </svg>
);

const TextButton = (props) => {
  if (props.hidden) return null;

  const outerStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: props.text ? "space-between" : props.alignment, // ⬅️ smart layout
  };

  return (
    <div style={outerStyle}>
      {/* Show left text only if available */}
      {props.text && (
        <div
          style={{
            fontSize: "16px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 400,
            color: "#000000",
          }}
        >
          {props.text}
        </div>
      )}

      {/* Button */}
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
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "100%",
          border: "none",
        }}
        className="digit-search-action"
        onClick={props.onClick}
      >
        {props.addMember ? <CustomSVG.AddFilled width={"16px"} height={"16px"} fill={"#F47738"} /> : <EditIcon />}
        <span className="digit-search-text">{props?.label || "EDIT_LABEL"}</span>
      </div>
    </div>
  );
};

// household member card

const HouseHoldDetailsCard = (props) => {
  const householdDetails = props.beneficiaryDetails
    ? props.beneficiaryDetails
    : [
        //TODO: Need this to be moved to config @Pitabsh, @ram
        // { label: "HOUSEHOLD_HEAD", value: "Value" },
        // { label: "ADMINSTRATIVE_AREA", value: "value" },
        // { label: "MEMBER_COUNT", value: 5 },

        { label: "HouseHold Head", value: "Rohit" },
        { label: "Adminstrative Area", value: "Boundary A" },
        { label: "Member Count", value: 5 },
      ];
  return (
    <div>
      {householdDetails.map((pair, index) => (
        <div key={index}>
          <SummaryCardFieldPair
            style={{
              overflowX: "hidden",
              display: "flex",
              alignItems: "center",
              paddingBottom: "1rem",
            }}
            key={index}
            inline={true}
            label={props.t(pair?.label || "LABEL")}
            value={pair?.value || "VALUE"}
          />
        </div>
      ))}
    </div>
  );
};

const HouseholdOverViewMemberCard = (props) => {
  const attributes = props.attributes || [
    { label: "Gender", value: "Male" },
    { label: "Age", value: "30 years" },
    { label: "Relationship", value: "Father" },
    { label: "Status", value: "Verified" },
  ];
  return (
    <div style={{ ...styles.card, overflowX: "hidden" }}>
      <div style={styles.header}>
        <div style={styles.name}>
          <strong>{props.name}</strong>
        </div>
        <TextButton
          alignment={"flex-end"}
          label={props.t(props.editIndividual?.label || "")}
          hidden={props.editIndividual?.hidden}
          onClick={() => {}}
        />
      </div>

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
        {props.primaryBtn && Object.keys(props.primaryBtn).length > 0 && !props.primaryBtn?.hidden && (
          <Button
            // className={`${selectedField?.jsonPath === field.jsonPath ? "app-preview-field-pair app-preview-selected" : ""}`}
            key={0}
            variation="primary"
            label={props.t(props.primaryBtn?.label || "LABEL")}
            title={props.t(props.primaryBtn?.label || "LABEL")}
            style={{ minWidth: "100%" }}
            onClick={() => {}}
          />
        )}

        {props.secondaryBtn && Object.keys(props.secondaryBtn).length > 0 && !props.secondaryBtn?.hidden && (
          <Button
            className={`app-preview-action-button `}
            key={1}
            variation="secondary"
            label={props.t(props.secondaryBtn?.label) || "LABEL"}
            title={props.t(props.secondaryBtn?.label) || "LABEL"}
            style={{ minWidth: "100%" }}
            onClick={() => {}}
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
    marginTop: "10px",
  },
  card: {
    overflowX: "hidden",
    marginTop: "10px",
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

export const getTemplateRenderer = (templateName) => {
  if (templateName?.toUpperCase()?.includes("ACKNOWLEDGEMENT")) {
    return responsePanelComponent;
  }

  switch (templateName?.toUpperCase()) {
    case "HOUSEHOLDOVERVIEW":
      return HouseHoldOverviewSection;
    case "COMPLAINTSINBOX":
      return SimpleSearchFilterRow;

    // case "AnotherTemplate": return anotherRenderer;

    default:
      return null;
  }
};

export const HouseHoldOverviewSection = ({ components = [], t }) => {
  const formatMap = {};
  components.forEach((item) => {
    formatMap[item.jsonPath] = item;
  });

  const editHousehold = formatMap["editHousehold"] || { label: "", hidden: true };
  const editIndividual = formatMap["editIndividual"] || {};
  const primaryBtn = formatMap["IndividualDeliveryPrimaryButton"] || {};
  const secondaryBtn = formatMap["IndividualDeliverySecondaryButton"] || {};
  const addMember = formatMap["addMember"] || { label: "", hidden: true };
  const detailsCard = formatMap["DetailsCard"] || {};

  return (
    <div>
      <style>
        {`
          .no-x-scroll::-webkit-scrollbar:horizontal {
            display: none;
          }
        `}
      </style>
      <div
        className="no-x-scroll"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          msOverflowStyle: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <TextButton label={t(editHousehold?.label || "LABEL")} onClick={() => {}} hidden={editHousehold.hidden} alignment="flex-end" />

        {detailsCard?.hidden != true && <DetailsCardSection t={t} field={detailsCard} />}

        <HouseholdOverViewMemberCard
          name="Joseph Sergio"
          editIndividual={editIndividual}
          primaryBtn={primaryBtn}
          secondaryBtn={secondaryBtn}
          t={t}
        />

        {addMember && (
          <div style={{ marginTop: "16px" }}>
            <TextButton
              addMember={true}
              alignment="center"
              hidden={addMember?.hidden}
              label={t(addMember?.label || "")}
              onClick={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const injectTableStyles = () => {
  const styleId = "dose-table-override-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .digit-data-table {
        width: 100% !important;
        display: block;
      }

      .digit-data-table table {
        width: 100% !important;
        table-layout: auto !important;
      }

      .digit-card-component.override-padding {
        padding: 0 !important;
      }

      .digit-card-component.override-padding .digit-table-card {
        padding: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Define dataTableCustomStyles inline
const dataTableCustomStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "14px",
      backgroundColor: "#f2f2f2",
      color: "#0b4b66",
      padding: "10px",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      padding: "10px",
      minHeight: "48px",
    },
  },
  cells: {
    style: {
      padding: "10px",
      whiteSpace: "nowrap",
    },
  },
};

const BeneficiaryTableWrapper = ({ columns = [], data = [], finalTableHeading = "", t }) => {
  useEffect(() => {
    injectTableStyles();
  }, []);

  const formattedColumns = useMemo(() => {
    return columns.map((item) => ({
      name: t(item.code), // Translated label
      selector: (row) => row[item.code],
      sortable: false,
      minWidth: "200px",
    }));
  }, [columns, t]); //

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ fontWeight: "bold", marginBottom: "0.5rem", fontSize: "25px" }}>{finalTableHeading}</h1>

      <div
        className="digit-card-component override-padding"
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <ResultsDataTable
          data={data}
          columns={formattedColumns}
          showCheckBox={false}
          onSelectedRowsChange={() => {}}
          progressPending={false}
          isPaginationRequired={false}
          showTableTitle={false}
          showTableDescription={false}
          enableGlobalSearch={false}
          selectableRowsNoSelectAll={true}
          customStyles={dataTableCustomStyles}
          conditionalRowStyles={[
            {
              when: (row) => row.PERMANENT === "Yes",
              style: {
                backgroundColor: "#fde0d5",
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BeneficiaryTableWrapper;

// Independent wrapper for DetailsCard
const DetailsCardSection = ({ field, t }) => {
  const heading = t ? t(field?.label || "BENEFICIARY_DETAILS_TITLE") : field?.label || "";

  const beneficiaryDetails =
    field?.dropDownOptions?.map((item) => ({
      label: item.code,
      value: "****",
    })) || [];

  if (!beneficiaryDetails.length) return null;

  return (
    <div>
      <style>
        {`
          .no-x-scroll::-webkit-scrollbar:horizontal {
            display: none;
          }
        `}
      </style>

      <div className="no-x-scroll">
        <h1 style={{ fontWeight: "bold", marginBottom: "0.5rem", fontSize: "25px" }}>{heading}</h1>
        <HouseHoldDetailsCard t={t} beneficiaryDetails={beneficiaryDetails} />
      </div>
    </div>
  );
};

// Independent wrapper for Table
const Table = ({ field, t }) => {
  const tableLabelRaw = field?.label || "BENEFICIARY_DETAILS_TABLE_HEADER";
  const tableHeading = t ? t(tableLabelRaw) : tableLabelRaw;
  const finalTableHeading = tableHeading && tableHeading.trim() !== "" ? tableHeading : "";

  const columns =
    field?.dropDownOptions?.map((item) => {
      return {
        ...item,
        name: item.name,
        code: item.code,
      };
    }) || [];

  if (!columns.length) return null;

  // Static data stub (replace with real data source)
  const data = [
    {
      DOSENO: "Dose 1",
      STATUS: "Administered",
      COMPLETED_ON: "14 June 2024",
    },
  ];

  return <BeneficiaryTableWrapper finalTableHeading={finalTableHeading} columns={columns} data={data} t={t} />;
};

/**
 * SimpleSearchFilterRow
 * A minimal row with: [ Search icon + label ] | [ Filter ] | [ Sort icon ]
 *
 * Uses your existing <Filter />, <SVG.Search />, and <SVG.Sort /> components.
 */
const SimpleSearchFilterRow = ({
  components = [],
  t,
  // t,
  // label = "Search",
  // primaryColor = "currentColor",
  // size = "20px",
  // onSearchClick,
  // onSortClick,
  // // Pass anything your <Filter /> needs via this prop
  // filterProps = {},
}) => {
  const formatMap = {};
  components.forEach((item) => {
    formatMap[item.jsonPath] = item;
  });

  const searchIcon = formatMap["searchComplaints"] || { label: "", hidden: true };
  const filter = formatMap["filter"] || {};
  const sortIcon = formatMap["sortComplaints"] || {};

  const cellStyle = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "0.375rem", // tighter gap between icon and label
    color: "inherit",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // equal widths
        columnGap: "0.5rem", // smaller overall gap
        rowGap: "0.5rem",
        alignItems: "center",
        width: "100%", //allow responsive wrap
      }}
    >
      {/* Left: Search icon + label */}
      <div style={cellStyle}>
        {/* Use currentColor so it won't disappear on white backgrounds */}
        <SVG.Search width={"20px"} height={"20px"} fill={"#C84C0E"} />
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#C84C0E" }}>
          {t?.(searchIcon?.label || "")}
        </span>
      </div>

      {/* Middle: Filter (full-width inside its cell) */}
      <div style={{ minWidth: 0 }}>
        <div style={{ width: "100%" }}>
          <Filter field={filter} t={t} />
        </div>
      </div>

      {/* Right: Sort icon + label (optional) */}
      <div style={cellStyle}>
        <SVG.ArrowDownward width={"20px"} height={"20px"} fill={"#C84C0E"} />
        {sortIcon?.label ? (
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#C84C0E" }}>
            {t?.(sortIcon?.label || "")}
          </span>
        ) : null}
      </div>
    </div>
  );
};

// Register all components
registerComponent("searchBar", SearchBar);
registerComponent("filter", Filter);
registerComponent("searchByProximity", Toggle);
registerComponent("searchByID", Toggle);
registerComponent("DetailsCard", DetailsCardSection);
registerComponent("Table", Table);
