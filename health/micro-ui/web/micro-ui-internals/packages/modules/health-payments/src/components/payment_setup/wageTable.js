import React, { useState, useMemo, useCallback } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { TextInput } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";

const RoleWageTable = ({ skills = [], rateBreakupSchema = {} }) => {
  const { t } = useTranslation();

  // Initialize roles from skills prop
  const [roles, setRoles] = useState(() =>
    skills.map((skill, index) => ({
      id: index + 1,
      code: skill.code,
      role: skill.name,
      wage: skill.defaultWageRate || 0,
      perDiem: 0,
      transport: 0,
    }))
  );

  // Update roles when skills prop changes
  React.useEffect(() => {
    setRoles(
      skills.map((skill, index) => ({
        id: index + 1,
        code: skill.code,
        role: skill.name,
        wage: skill.defaultWageRate || 0,
        perDiem: 0,
        transport: 0,
      }))
    );
  }, [skills]);

  // Get column labels from rateBreakupSchema
  const columnLabels = useMemo(() => {
    return {
      wage: rateBreakupSchema.FOOD || "Wage",
      perDiem: rateBreakupSchema.PER_DAY || "Per diem",
      transport: rateBreakupSchema.TRAVEL || "Transportation",
    };
  }, [rateBreakupSchema]);

  // Compute total for each row
  const computeTotal = useCallback((row) => {
    return (Number(row.wage) || 0) + (Number(row.perDiem) || 0) + (Number(row.transport) || 0);
  }, []);

  // Handle input change with validation
  const handleChange = useCallback((id, field, rawValue) => {
    let value = rawValue;

    // Prevent non-numeric input (except empty)
    if (!/^\d*$/.test(value)) return;

    // Empty input → treat as 0
    if (value === "") value = "0";

    setRoles((prevRoles) =>
      prevRoles.map((r) => (r.id === id ? { ...r, [field]: Number(value) } : r))
    );
  }, []);

  const renderNumericInput = useCallback(
    (row, field) => (
      <TextInput
        type="number"
        value={row[field] === 0 ? "0" : row[field] !== undefined && row[field] !== null ? String(row[field]) : "0"}
        onChange={(e) => handleChange(row.id, field, e.target.value)}
        populators={{ disableTextField: false }}
        style={{ width: "100%" }}
      />
    ),
    [handleChange]
  );

  const columns = useMemo(
    () => [
      {
        name: (
          <div
            style={{
              borderRight: "2px solid #787878",
              width: "100%",
              textAlign: "start",
            }}
          >
            {t("Role")}
          </div>
        ),
        selector: (row) => (
          <div className="ellipsis-cell" title={row.role}>
            {row.role}
          </div>
        ),
      },
      {
        name: (
          <div
            style={{
              borderRight: "2px solid #787878",
              width: "100%",
              textAlign: "start",
            }}
          >
            {t(columnLabels.wage)} (in $)
          </div>
        ),
        selector: (row) => renderNumericInput(row, "wage"),
        style: { justifyContent: "flex-start" },
      },
      {
        name: (
          <div
            style={{
              borderRight: "2px solid #787878",
              width: "100%",
              textAlign: "start",
            }}
          >
            {t(columnLabels.perDiem)} (in $)
          </div>
        ),
        selector: (row) => renderNumericInput(row, "perDiem"),
        style: { justifyContent: "flex-start" },
      },
      {
        name: (
          <div
            style={{
              borderRight: "2px solid #787878",
              width: "100%",
              textAlign: "start",
            }}
          >
            {t(columnLabels.transport)} (in $)
          </div>
        ),
        selector: (row) => renderNumericInput(row, "transport"),
        style: { justifyContent: "flex-start" },
      },
      {
        name: <div style={{ width: "100%", textAlign: "start" }}>{t("Total Wage (in $)")}</div>,
        selector: (row) => (
          <div className="ellipsis-cell" title={computeTotal(row)} style={{ fontWeight: 500, textAlign: "center" }}>
            {computeTotal(row)}
          </div>
        ),
        style: { justifyContent: "flex-end" },
      },
    ],
    [t, columnLabels, renderNumericInput, computeTotal]
  );

  if (!skills || skills.length === 0) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
        {t("No roles available for the selected campaign")}
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <DataTable columns={columns} data={roles} customStyles={tableCustomStyle(false)} highlightOnHover dense />
    </div>
  );
};

export default RoleWageTable;