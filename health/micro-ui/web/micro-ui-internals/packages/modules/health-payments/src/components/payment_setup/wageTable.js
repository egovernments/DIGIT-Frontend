import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { TextInput } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";

const RoleWageTable = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([
    { id: 1, role: "Distributor", wage: 30, perDiem: 10, transport: 10 },
    { id: 2, role: "Supervisor", wage: 75, perDiem: 10, transport: 10 },
    { id: 3, role: "Warehouse Manager", wage: 60, perDiem: 10, transport: 10 },
  ]);

  //  Compute total for each row
  const computeTotal = (row) => (Number(row.wage) || 0) + (Number(row.perDiem) || 0) + (Number(row.transport) || 0);

  //  Handle input change with validation and smooth behavior
  const handleChange = (id, field, rawValue) => {
    let value = rawValue;

    // Prevent non-numeric input (except empty)
    if (!/^\d*$/.test(value)) return;

    // Empty input → treat as 0
    if (value === "") value = "0";

    const updated = roles.map((r) => (r.id === id ? { ...r, [field]: Number(value) } : r));
    setRoles(updated);
  };

  const renderNumericInput = (row, field) => (
    <TextInput
      type="number"
      value={row[field] === 0 ? "0" : row[field] !== undefined && row[field] !== null ? String(row[field]) : "0"}
      onChange={(e) => handleChange(row.id, field, e.target.value)}
      populators={{ disableTextField: false }}
      style={{ width: "100%" }}
    />
  );

  const columns = [
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
          {t("Wage (in $)")}
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
          {t("Per diem (in $)")}
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
          {t("Transportation (in $)")}
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
  ];

  return (
    <div style={{ marginTop: "1rem" }}>
      <DataTable columns={columns} data={roles} customStyles={tableCustomStyle(false)} highlightOnHover dense />
    </div>
  );
};

export default RoleWageTable;
