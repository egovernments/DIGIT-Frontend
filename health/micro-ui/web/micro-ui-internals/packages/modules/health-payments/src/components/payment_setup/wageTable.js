import React, { useState, useMemo, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { TextInput } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";

const RoleWageTable = ({
  skills = [],
  rateBreakupSchema = {},
  rateMaxLimitSchema = {},
  campaignId = null,
  campaignName = "",
  onDataChange,
  existingRatesData = null,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormModified, setIsFormModified] = useState(false); // ⭐ NEW — Track if table was modified

  /** Convert rateBreakupSchema to dynamic columns */
  const rateColumns = useMemo(() => {
    if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
      return [];
    }

    return Object.entries(rateBreakupSchema).map(([key, label]) => ({
      key,
      label,
      fieldName: key,
    }));
  }, [rateBreakupSchema]);

  /** Initialize roles */
  useEffect(() => {
    if (!skills || skills.length === 0) {
      setRoles([]);
      return;
    }

    const initialRoles = skills.map((skill, index) => {
      const role = {
        id: index + 1,
        code: skill.code,
        role: t(skill.code),
        total: 0,
      };

      let calculatedTotal = 0;

      rateColumns.forEach((column) => {
        const value = skill?.rateBreakup?.[column.fieldName] !== undefined ? Number(skill.rateBreakup[column.fieldName]) : 0;

        role[column.fieldName] = value;
        calculatedTotal += Number(value) || 0;
      });

      role.total = calculatedTotal;
      return role;
    });

    setRoles(initialRoles);
  }, [skills, rateColumns]);

  /** Compute row total */
  const calculateRowTotal = useCallback(
    (roleData) => {
      let total = 0;
      rateColumns.forEach((column) => {
        total += Number(roleData[column.fieldName]) || 0;
      });
      return total;
    },
    [rateColumns]
  );

  /** Generate payload */
  const generatePayload = useCallback(
    (currentRoles) => {
      const tenantId = Digit?.ULBService?.getCurrentTenantId();

      const rates = currentRoles.map((role) => {
        const rateBreakup = {};
        rateColumns.forEach((column) => {
          rateBreakup[column.key] = Number(role[column.fieldName]) || 0;
        });

        return {
          skillCode: role.code,
          rateBreakup,
        };
      });

      return {
        Mdms: {
          schemaCode: "HCM.WORKER_RATES",
          tenantId,
          data: {
            name: campaignName,
            eventType: "CAMPAIGN",
            currency: "USD",
            rates,
            campaignId,
          },
          isActive: true,
          ...(existingRatesData && { auditDetails: existingRatesData.auditDetails }),
          ...(existingRatesData && { id: existingRatesData.id }),
        },
      };
    },
    [rateColumns, campaignId, campaignName]
  );

  /**  Compute error flag */
  const errorFlag = useMemo(() => Object.keys(errors).length === 0, [errors]);

  /** Notify parent */
  useEffect(() => {
    if (roles.length > 0 && onDataChange) {
      const payload = generatePayload(roles);

      onDataChange({
        payload,
        errorFlag,
        isFormModified, //  NEW — send whether user edited table
      });
    }
  }, [roles, generatePayload, onDataChange, errorFlag, isFormModified]); //  NEW: added isFormModified

  /** Handle change */
  const handleChange = useCallback(
    (id, field, rawValue) => {
      let value = rawValue;

      if (!/^\d*\.?\d*$/.test(value)) return;
      // If decimal exists, trim everything after dot
      if (value.includes(".")) {
        value = value.split(".")[0]; // take only the integer part
      }
      if (value === "") value = "0";

      const numericValue = parseFloat(value) || 0;
      const maxLimit = rateMaxLimitSchema[field];

      // Mark table as updated
      setIsFormModified(true);

      // Manage errors
      setErrors((prevErrors) => {
        const updated = { ...prevErrors };

        if (maxLimit !== undefined && numericValue > maxLimit) {
          if (!updated[id]) updated[id] = {};
          updated[id][field] = `${t(`${"HCM_AM"}_${field}`)} ${t("HCM_AM_CAN_NOT_EXCEED")} ${maxLimit}`;
        } else {
          if (updated[id]) {
            delete updated[id][field];
            if (Object.keys(updated[id]).length === 0) delete updated[id];
          }
        }
        return updated;
      });

      // Update values
      setRoles((prevRoles) =>
        prevRoles.map((r) => {
          if (r.id === id) {
            const updatedRole = { ...r, [field]: numericValue };
            updatedRole.total = calculateRowTotal(updatedRole);
            return updatedRole;
          }
          return r;
        })
      );
    },
    [calculateRowTotal, rateMaxLimitSchema]
  );

  /** Input Renderer */
  const renderNumericInput = useCallback(
    (row, field) => {
      const error = errors?.[row.id]?.[field];

      return (
        <div style={{ width: "100%" }}>
          <TextInput
            type="text"
            inputMode="numeric"
            disabled={disabled}
            value={row[field] === 0 ? "0" : row[field] !== undefined && row[field] !== null ? String(row[field]) : "0"}
            onChange={(e) => handleChange(row.id, field, e.target.value)}
            populators={{ disableTextField: false }}
            style={{
              width: "100%",
              border: error ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {error && <div style={{ color: "red", fontSize: "0.8rem" }}>{error}</div>}
        </div>
      );
    },
    [handleChange, disabled, errors]
  );

  /** Table columns */
  const columns = useMemo(() => {
    const cols = [
      {
        name: <div style={{ textAlign: "start" }}>{t("HCM_AM_ROLE_LABEL")}</div>,
        selector: (row) => row.role,
        width: "200px",
      },
    ];

    rateColumns.forEach((column) => {
      cols.push({
        name: <div style={{ textAlign: "start" }}>{t(`HCM_AM_${column.label.toUpperCase()}`)} </div>,
        selector: (row) => renderNumericInput(row, column.fieldName),
        grow: 1,
      });
    });

    cols.push({
      name: <div style={{ textAlign: "start" }}>{t("HCM_AM_TOTAL_WAGE")}</div>,
      cell: (row) => (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            fontWeight: 500,
          }}
          title={row.total || 0}
        >
          {row.total || 0}
        </div>
      ),
      width: "150px",
    });

    return cols;
  }, [t, rateColumns, renderNumericInput]);

  if (!skills || skills.length === 0) {
    return <div style={{ padding: "1rem", textAlign: "center" }}>{t("HCM_AM_NO_ROLES_FOUND")}</div>;
  }

  if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
    return <div style={{ padding: "1rem", textAlign: "center" }}>{t("HCM_AM_NO_SCHEMA_RATE_FOUND")}</div>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <DataTable columns={columns} data={roles} customStyles={tableCustomStyle(false)} highlightOnHover dense />
    </div>
  );
};

export default RoleWageTable;
