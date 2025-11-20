// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { useTranslation } from "react-i18next";
// import { TextInput } from "@egovernments/digit-ui-components";
// import { tableCustomStyle } from "../table_inbox_custom_style";

// const RoleWageTable = ({
//   skills = [],
//   rateBreakupSchema = {},
//   rateMaxLimitSchema = {},
//   campaignId = null,
//   campaignName = "",
//   onDataChange,
//   existingRatesData = null,
//   disabled = false,
// }) => {

//   const { t } = useTranslation();

//   const [roles, setRoles] = useState([]);

//   /**  Convert rateBreakupSchema to dynamic columns */
//   const rateColumns = useMemo(() => {
//     if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
//       return [];
//     }

//     return Object.entries(rateBreakupSchema).map(([key, label]) => ({
//       key,
//       label,
//       fieldName: key,
//     }));
//   }, [rateBreakupSchema]);

//   /**  Initialize roles from skills */
//   useEffect(() => {
//     if (!skills || skills.length === 0) {
//       setRoles([]);
//       return;
//     }

//     const initialRoles = skills.map((skill, index) => {
//       const role = {
//         id: index + 1,
//         code: skill.code,
//         role: skill.name,
//         total: 0,
//       };

//       let calculatedTotal = 0;

//       rateColumns.forEach((column) => {
//         //  Safely read from rateBreakup
//         const value = skill?.rateBreakup?.[column.fieldName] !== undefined ? Number(skill.rateBreakup[column.fieldName]) : 0;

//         role[column.fieldName] = value;
//         calculatedTotal += Number(value) || 0;
//       });

//       role.total = calculatedTotal;
//       return role;
//     });

//     setRoles(initialRoles);
//   }, [skills, rateColumns]);

//   /**  Calculate row total */
//   const calculateRowTotal = useCallback(
//     (roleData) => {
//       let total = 0;
//       rateColumns.forEach((column) => {
//         total += Number(roleData[column.fieldName]) || 0;
//       });
//       return total;
//     },
//     [rateColumns]
//   );

//   /**  Prepare payload to send upward */
//   const generatePayload = useCallback(
//     (currentRoles) => {
//       const tenantId = Digit?.ULBService?.getCurrentTenantId();

//       const rates = currentRoles.map((role) => {
//         const rateBreakup = {};
//         rateColumns.forEach((column) => {
//           rateBreakup[column.key] = Number(role[column.fieldName]) || 0;
//         });

//         return {
//           skillCode: role.code,
//           rateBreakup,
//         };
//       });

//       return {
//         Mdms: {
//           schemaCode: "HCM.WORKER_RATES",
//           tenantId,
//           data: {
//             name: campaignName,
//             eventType: "CAMPAIGN",
//             currency: "USD",
//             rates,
//             campaignId,
//           },
//           isActive: true,
//           ...(existingRatesData && { auditDetails: existingRatesData.auditDetails }),
//           ...(existingRatesData && { id: existingRatesData.id }),
//         },
//       };
//     },
//     [rateColumns, campaignId, campaignName]
//   );

//   /**  Emit to parent when roles change */
//   useEffect(() => {
//     if (roles.length > 0 && onDataChange) {
//       const payload = generatePayload(roles);

//       onDataChange(payload);
//     }
//   }, [roles, generatePayload, onDataChange]);

//   /** 🖊 Handle field edits */
//   const handleChange = useCallback(
//     (id, field, rawValue) => {
//       let value = rawValue;

//       if (!/^\d*\.?\d*$/.test(value)) return; // numeric only
//       if (value === "") value = "0";

//       const numericValue = parseFloat(value) || 0;

//       setRoles((prevRoles) =>
//         prevRoles.map((r) => {
//           if (r.id === id) {
//             const updatedRole = { ...r, [field]: numericValue };
//             updatedRole.total = calculateRowTotal(updatedRole);
//             return updatedRole;
//           }
//           return r;
//         })
//       );
//     },
//     [calculateRowTotal]
//   );

//   /**  Render text inputs for rate columns */
//   const renderNumericInput = useCallback(
//     (row, field) => (
//       <TextInput
//         disabled={disabled}
//         type="text"
//         value={row[field] === 0 ? "0" : row[field] !== undefined && row[field] !== null ? String(row[field]) : "0"}
//         onChange={(e) => handleChange(row.id, field, e.target.value)}
//         populators={{ disableTextField: false }}
//         style={{ width: "100%" }}
//       />
//     ),
//     [handleChange, disabled]
//   );

//   /**  Define dynamic DataTable columns */
//   const columns = useMemo(() => {
//     const cols = [
//       {
//         name: (
//           <div
//             style={{
//               borderRight: "2px solid #787878",
//               width: "100%",
//               textAlign: "start",
//             }}
//           >
//             {t("Role")}
//           </div>
//         ),
//         selector: (row) => (
//           <div className="ellipsis-cell" title={row.role}>
//             {row.role}
//           </div>
//         ),
//         width: "200px",
//       },
//     ];

//     // Dynamic rate fields
//     rateColumns.forEach((column) => {
//       cols.push({
//         name: (
//           <div
//             style={{
//               borderRight: "2px solid #787878",
//               width: "100%",
//               textAlign: "start",
//             }}
//           >
//             {t(column.label)} (in $)
//           </div>
//         ),
//         selector: (row) => renderNumericInput(row, column.fieldName),
//         style: { justifyContent: "flex-start" },
//         grow: 1,
//       });
//     });

//     // Total column
//     cols.push({
//       name: <div style={{ width: "100%", textAlign: "start" }}>{t("Total Wage (in $)")}</div>,
//       selector: (row) => (
//         <div className="ellipsis-cell" title={row.total.toFixed(2)} style={{ fontWeight: 500, textAlign: "center" }}>
//           {row.total.toFixed(2)}
//         </div>
//       ),
//       style: { justifyContent: "flex-end" },
//       width: "150px",
//     });

//     return cols;
//   }, [t, rateColumns, renderNumericInput]);

//   /**  Empty State Handling */
//   if (!skills || skills.length === 0) {
//     return <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("No roles available for the selected campaign")}</div>;
//   }

//   if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
//     return <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("No rate breakup schema available")}</div>;
//   }

//   /** 🧾 Render table */
//   return (
//     <div style={{ marginTop: "1rem" }}>
//       <DataTable columns={columns} data={roles} customStyles={tableCustomStyle(false)} highlightOnHover dense />
//     </div>
//   );
// };

// export default RoleWageTable;

// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { useTranslation } from "react-i18next";
// import { TextInput } from "@egovernments/digit-ui-components";
// import { tableCustomStyle } from "../table_inbox_custom_style";

// const RoleWageTable = ({
//   skills = [],
//   rateBreakupSchema = {},
//   rateMaxLimitSchema = {},
//   campaignId = null,
//   campaignName = "",
//   onDataChange,
//   existingRatesData = null,
//   disabled = false,
// }) => {

//   const { t } = useTranslation();

//   const [roles, setRoles] = useState([]);
//   const [errors, setErrors] = useState({}); //  Store errors by row + field

//   /** Convert rateBreakupSchema to dynamic columns */
//   const rateColumns = useMemo(() => {
//     if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
//       return [];
//     }

//     return Object.entries(rateBreakupSchema).map(([key, label]) => ({
//       key,
//       label,
//       fieldName: key,
//     }));
//   }, [rateBreakupSchema]);

//   /** Initialize roles from skills */
//   useEffect(() => {
//     if (!skills || skills.length === 0) {
//       setRoles([]);
//       return;
//     }

//     const initialRoles = skills.map((skill, index) => {
//       const role = {
//         id: index + 1,
//         code: skill.code,
//         role: skill.name,
//         total: 0,
//       };

//       let calculatedTotal = 0;

//       rateColumns.forEach((column) => {
//         const value =
//           skill?.rateBreakup?.[column.fieldName] !== undefined
//             ? Number(skill.rateBreakup[column.fieldName])
//             : 0;

//         role[column.fieldName] = value;
//         calculatedTotal += Number(value) || 0;
//       });

//       role.total = calculatedTotal;
//       return role;
//     });

//     setRoles(initialRoles);
//   }, [skills, rateColumns]);

//   /** Calculate row total */
//   const calculateRowTotal = useCallback(
//     (roleData) => {
//       let total = 0;
//       rateColumns.forEach((column) => {
//         total += Number(roleData[column.fieldName]) || 0;
//       });
//       return total;
//     },
//     [rateColumns]
//   );

//   /** Generate payload */
//   const generatePayload = useCallback(
//     (currentRoles) => {
//       const tenantId = Digit?.ULBService?.getCurrentTenantId();

//       const rates = currentRoles.map((role) => {
//         const rateBreakup = {};
//         rateColumns.forEach((column) => {
//           rateBreakup[column.key] = Number(role[column.fieldName]) || 0;
//         });

//         return {
//           skillCode: role.code,
//           rateBreakup,
//         };
//       });

//       return {
//         Mdms: {
//           schemaCode: "HCM.WORKER_RATES",
//           tenantId,
//           data: {
//             name: campaignName,
//             eventType: "CAMPAIGN",
//             currency: "USD",
//             rates,
//             campaignId,
//           },
//           isActive: true,
//           ...(existingRatesData && { auditDetails: existingRatesData.auditDetails }),
//           ...(existingRatesData && { id: existingRatesData.id }),
//         },
//       };
//     },
//     [rateColumns, campaignId, campaignName]
//   );

//   /** Emit payload upward */
//   useEffect(() => {
//     if (roles.length > 0 && onDataChange) {
//       const payload = generatePayload(roles);
//       onDataChange(payload);
//     }
//   }, [roles, generatePayload, onDataChange]);

//   /** 🔥 Handle change with max-limit validation + errors */
//   const handleChange = useCallback(
//     (id, field, rawValue) => {
//       let value = rawValue;

//       if (!/^\d*\.?\d*$/.test(value)) return; // numeric only
//       if (value === "") value = "0";

//       const numericValue = parseFloat(value) || 0;
//       const maxLimit = rateMaxLimitSchema[field];

//       setErrors((prevErrors) => {
//         const updated = { ...prevErrors };

//         // Add error if > max
//         if (maxLimit !== undefined && numericValue > maxLimit) {
//           if (!updated[id]) updated[id] = {};
//           updated[id][field] = `Max allowed for ${field} is ${maxLimit}`;
//         } else {
//           // Remove error when valid
//           if (updated[id]) {
//             delete updated[id][field];
//             if (Object.keys(updated[id]).length === 0) delete updated[id];
//           }
//         }
//         return updated;
//       });

//       // Update roles
//       setRoles((prevRoles) =>
//         prevRoles.map((r) => {
//           if (r.id === id) {
//             const updatedRole = { ...r, [field]: numericValue };
//             updatedRole.total = calculateRowTotal(updatedRole);
//             return updatedRole;
//           }
//           return r;
//         })
//       );
//     },
//     [calculateRowTotal, rateMaxLimitSchema]
//   );

//   /** Input renderer with error + red border */
//   const renderNumericInput = useCallback(
//     (row, field) => {
//       const error = errors?.[row.id]?.[field];

//       return (
//         <div style={{ width: "100%" }}>
//           <TextInput
//             disabled={disabled}
//             type="text"
//             value={
//               row[field] === 0
//                 ? "0"
//                 : row[field] !== undefined && row[field] !== null
//                 ? String(row[field])
//                 : "0"
//             }
//             onChange={(e) => handleChange(row.id, field, e.target.value)}
//             populators={{ disableTextField: false }}
//             style={{
//               width: "100%",
//               border: error ? "2px solid red" : "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />

//           {error && (
//             <div style={{ color: "red", fontSize: "0.8rem", marginTop: "2px" }}>
//               {error}
//             </div>
//           )}
//         </div>
//       );
//     },
//     [handleChange, disabled, errors]
//   );

//   /** Build table columns */
//   const columns = useMemo(() => {
//     const cols = [
//       {
//         name: (
//           <div
//             style={{
//               borderRight: "2px solid #787878",
//               width: "100%",
//               textAlign: "start",
//             }}
//           >
//             {t("Role")}
//           </div>
//         ),
//         selector: (row) => (
//           <div className="ellipsis-cell" title={row.role}>
//             {row.role}
//           </div>
//         ),
//         width: "200px",
//       },
//     ];

//     rateColumns.forEach((column) => {
//       cols.push({
//         name: (
//           <div style={{ width: "100%", textAlign: "start" }}>
//             {t(column.label)} (in $)
//           </div>
//         ),
//         selector: (row) => renderNumericInput(row, column.fieldName),
//         grow: 1,
//       });
//     });

//     cols.push({
//       name: (
//         <div style={{ width: "100%", textAlign: "start" }}>
//           {t("Total Wage (in $)")}
//         </div>
//       ),
//       selector: (row) => (
//         <div className="ellipsis-cell" title={row.total.toFixed(2)} style={{ fontWeight: 500 }}>
//           {row.total.toFixed(2)}
//         </div>
//       ),
//       width: "150px",
//     });

//     return cols;
//   }, [t, rateColumns, renderNumericInput]);

//   if (!skills || skills.length === 0) {
//     return (
//       <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
//         {t("No roles available for the selected campaign")}
//       </div>
//     );
//   }

//   if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
//     return (
//       <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
//         {t("No rate breakup schema available")}
//       </div>
//     );
//   }

//   return (
//     <div style={{ marginTop: "1rem" }}>
//       <DataTable
//         columns={columns}
//         data={roles}
//         customStyles={tableCustomStyle(false)}
//         highlightOnHover
//         dense
//       />
//     </div>
//   );
// };

// export default RoleWageTable;

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
  const [errors, setErrors] = useState({}); //  Stores validation errors

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

  /** Generate payload for parent */
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

  /**  Compute error flag (true = no errors, false = has errors) */
  const errorFlag = useMemo(() => Object.keys(errors).length === 0, [errors]);

  /** Notify parent on every change */
  useEffect(() => {
    if (roles.length > 0 && onDataChange) {
      const payload = generatePayload(roles);

      onDataChange({
        payload,
        errorFlag, //  send error state to parent
      });
    }
  }, [roles, generatePayload, onDataChange, errorFlag]);

  /**  Handle field change + max-limit validation */
  const handleChange = useCallback(
    (id, field, rawValue) => {
      let value = rawValue;

      if (!/^\d*\.?\d*$/.test(value)) return; // numeric only
      if (value === "") value = "0";

      const numericValue = parseFloat(value) || 0;
      const maxLimit = rateMaxLimitSchema[field];

      //  Manage errors
      setErrors((prevErrors) => {
        const updated = { ...prevErrors };

        if (maxLimit !== undefined && numericValue > maxLimit) {
          if (!updated[id]) updated[id] = {};
          updated[id][field] = `${t("HCM_AM_MAX_ALLOW")} ${t(`${"HCM_AM"}_${field}`)} ${t("HCM_AM_IS")} ${maxLimit}`;
        } else {
          if (updated[id]) {
            delete updated[id][field];
            if (Object.keys(updated[id]).length === 0) delete updated[id];
          }
        }
        return updated;
      });

      // Update roles data
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

  /** Render input with error and red border */
  const renderNumericInput = useCallback(
    (row, field) => {
      const error = errors?.[row.id]?.[field];

      return (
        <div style={{ width: "100%" }}>
          <TextInput
            disabled={disabled}
            type="text"
            value={row[field] === 0 ? "0" : row[field] !== undefined && row[field] !== null ? String(row[field]) : "0"}
            onChange={(e) => handleChange(row.id, field, e.target.value)}
            populators={{ disableTextField: false }}
            style={{
              width: "100%",
              border: error ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          {error && <div style={{ color: "red", fontSize: "0.8rem", marginTop: "2px" }}>{error}</div>}
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
      selector: (row) => (
        <div title={row.total.toFixed(2)} style={{ fontWeight: 500 }}>
          {row.total.toFixed(2)}
        </div>
      ),
      width: "150px",
    });

    return cols;
  }, [t, rateColumns, renderNumericInput]);

  if (!skills || skills.length === 0) {
    return <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("HCM_AM_NO_ROLES_FOUND")}</div>;
  }

  if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
    return <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>{t("HCM_AM_NO_SCHEMA_RATE_FOUND")}</div>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <DataTable columns={columns} data={roles} customStyles={tableCustomStyle(false)} highlightOnHover dense />
    </div>
  );
};

export default RoleWageTable;
