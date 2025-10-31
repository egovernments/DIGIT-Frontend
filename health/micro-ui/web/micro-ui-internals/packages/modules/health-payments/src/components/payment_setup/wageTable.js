// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { useTranslation } from "react-i18next";
// import { TextInput } from "@egovernments/digit-ui-components";
// import { tableCustomStyle } from "../table_inbox_custom_style";

// const RoleWageTable = ({ skills = [], rateBreakupSchema = {} }) => {
//   const { t } = useTranslation();

//   // Initialize roles state
//   const [roles, setRoles] = useState([]);

//   // Convert rateBreakupSchema object to array of columns
//   const rateColumns = useMemo(() => {
//     if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
//       return [];
//     }
    
//     // Convert object to array: [{ key: 'FOOD', label: 'Food Allowance' }, ...]
//     return Object.entries(rateBreakupSchema).map(([key, label]) => ({
//       key: key,
//       label: label,
//       fieldName: key.toLowerCase(), // Use lowercase for state field names
//     }));
//   }, [rateBreakupSchema]);

//   // Initialize roles from skills prop with dynamic rate columns
//   useEffect(() => {
//     if (!skills || skills.length === 0) {
//       setRoles([]);
//       return;
//     }

//     const initialRoles = skills.map((skill, index) => {
//       // Create base role object
//       const role = {
//         id: index + 1,
//         code: skill.code,
//         role: skill.name,
//       };

//       // Add dynamic rate fields from rateBreakupSchema
//       rateColumns.forEach((column) => {
//         // Check if skill has a default value for this rate type
//         role[column.fieldName] = skill[column.fieldName] || 0;
//       });

//       return role;
//     });

//     setRoles(initialRoles);
//   }, [skills, rateColumns]);

//   // Compute total for each row dynamically
//   const computeTotal = useCallback(
//     (row) => {
//       let total = 0;
//       rateColumns.forEach((column) => {
//         total += Number(row[column.fieldName]) || 0;
//       });
//       return total;
//     },
//     [rateColumns]
//   );

//   // Handle input change with validation
//   const handleChange = useCallback((id, field, rawValue) => {
//     let value = rawValue;

//     // Prevent non-numeric input (except empty)
//     if (!/^\d*$/.test(value)) return;

//     // Empty input → treat as 0
//     if (value === "") value = "0";

//     setRoles((prevRoles) =>
//       prevRoles.map((r) => (r.id === id ? { ...r, [field]: Number(value) } : r))
//     );
//   }, []);

//   // Render numeric input for rate fields
//   const renderNumericInput = useCallback(
//     (row, field) => (
//       <TextInput
//         type="number"
//         value={
//           row[field] === 0
//             ? "0"
//             : row[field] !== undefined && row[field] !== null
//             ? String(row[field])
//             : "0"
//         }
//         onChange={(e) => handleChange(row.id, field, e.target.value)}
//         populators={{ disableTextField: false }}
//         style={{ width: "100%" }}
//       />
//     ),
//     [handleChange]
//   );

//   // Generate columns dynamically
//   const columns = useMemo(() => {
//     const cols = [
//       // Role column (fixed)
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

//     // Add dynamic rate columns from rateBreakupSchema
//     rateColumns.forEach((column, index) => {
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

//     // Add Total column (fixed)
//     cols.push({
//       name: (
//         <div style={{ width: "100%", textAlign: "start" }}>
//           {t("Total Wage (in $)")}
//         </div>
//       ),
//       selector: (row) => (
//         <div
//           className="ellipsis-cell"
//           title={computeTotal(row)}
//           style={{ fontWeight: 500, textAlign: "center" }}
//         >
//           {computeTotal(row)}
//         </div>
//       ),
//       style: { justifyContent: "flex-end" },
//       width: "150px",
//     });

//     return cols;
//   }, [t, rateColumns, renderNumericInput, computeTotal]);

//   // Handle empty state
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
  campaignId = null,
  campaignName = "",
  onDataChange 
}) => {
  const { t } = useTranslation();

  // Initialize roles state
  const [roles, setRoles] = useState([]);

  // Convert rateBreakupSchema object to array of columns
  const rateColumns = useMemo(() => {
    if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
      return [];
    }
    
    // Convert object to array: [{ key: 'FOOD', label: 'Food Allowance' }, ...]
    return Object.entries(rateBreakupSchema).map(([key, label]) => ({
      key: key,
      label: label,
      fieldName: key, // Keep original case for API payload
    }));
  }, [rateBreakupSchema]);

  // Initialize roles from skills prop with dynamic rate columns
  useEffect(() => {
    if (!skills || skills.length === 0) {
      setRoles([]);
      return;
    }

    const initialRoles = skills.map((skill, index) => {
      // Create base role object
      const role = {
        id: index + 1,
        code: skill.code,
        role: skill.name,
        total: 0, // Initialize total
      };

      // Add dynamic rate fields from rateBreakupSchema
      let calculatedTotal = 0;
      rateColumns.forEach((column) => {
        const value = skill[column.fieldName] || 0;
        role[column.fieldName] = value;
        calculatedTotal += Number(value) || 0;
      });
      
      role.total = calculatedTotal;

      return role;
    });

    setRoles(initialRoles);
  }, [skills, rateColumns]);

  // Compute total for each row dynamically
  const computeTotal = useCallback((row) => {
    return row.total || 0;
  }, []);

  // Calculate total for a specific role
  const calculateRowTotal = useCallback((roleData) => {
    let total = 0;
    rateColumns.forEach((column) => {
      total += Number(roleData[column.fieldName]) || 0;
    });
    return total;
  }, [rateColumns]);

  // Convert roles to API payload format
  const generatePayload = useCallback((currentRoles) => {
    const tenantId = Digit?.ULBService?.getCurrentTenantId();
    
    const rates = currentRoles.map((role) => {
      const rateBreakup = {};
      
      // Build rateBreakup object dynamically
      rateColumns.forEach((column) => {
        rateBreakup[column.key] = Number(role[column.fieldName]) || 0;
      });

      return {
        skillCode: role.code,
        rateBreakup: rateBreakup,
      };
    });
 debugger
    return {
      Mdms: {
        schemaCode: "HCM.WORKER_RATES",
        tenantId: tenantId,
        data: {
          name: campaignName,
          eventType: "CAMPAIGN",
          currency: "USD",
          rates: rates,
          campaignId: campaignId,
        },
        isActive: true,
      },
    };
  }, [rateColumns, campaignId, campaignName]);

  // Notify parent component whenever roles change
  useEffect(() => {
    if (roles.length > 0 && onDataChange) {
      const payload = generatePayload(roles);
      onDataChange(payload);
    }
  }, [roles, generatePayload, onDataChange]);

  // Handle input change with validation and recalculate total
  const handleChange = useCallback((id, field, rawValue) => {
    let value = rawValue;

    // Allow decimal numbers
    if (!/^\d*\.?\d*$/.test(value)) return;

    // Empty input → treat as 0
    if (value === "") value = "0";

    const numericValue = parseFloat(value) || 0;

    setRoles((prevRoles) =>
      prevRoles.map((r) => {
        if (r.id === id) {
          const updatedRole = { ...r, [field]: numericValue };
          // Recalculate total for this row
          updatedRole.total = calculateRowTotal(updatedRole);
          return updatedRole;
        }
        return r;
      })
    );
  }, [calculateRowTotal]);

  // Render numeric input for rate fields
  const renderNumericInput = useCallback(
    (row, field) => (
      <TextInput
        type="text"
        value={
          row[field] === 0
            ? "0"
            : row[field] !== undefined && row[field] !== null
            ? String(row[field])
            : "0"
        }
        onChange={(e) => handleChange(row.id, field, e.target.value)}
        populators={{ disableTextField: false }}
        style={{ width: "100%" }}
      />
    ),
    [handleChange]
  );

  // Generate columns dynamically
  const columns = useMemo(() => {
    const cols = [
      // Role column (fixed)
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
        width: "200px",
      },
    ];

    // Add dynamic rate columns from rateBreakupSchema
    rateColumns.forEach((column, index) => {
      cols.push({
        name: (
          <div
            style={{
              borderRight: "2px solid #787878",
              width: "100%",
              textAlign: "start",
            }}
          >
            {t(column.label)} (in $)
          </div>
        ),
        selector: (row) => renderNumericInput(row, column.fieldName),
        style: { justifyContent: "flex-start" },
        grow: 1,
      });
    });

    // Add Total column (fixed) - now shows calculated total from state
    cols.push({
      name: (
        <div style={{ width: "100%", textAlign: "start" }}>
          {t("Total Wage (in $)")}
        </div>
      ),
      selector: (row) => (
        <div
          className="ellipsis-cell"
          title={row.total.toFixed(2)}
          style={{ fontWeight: 500, textAlign: "center" }}
        >
          {row.total.toFixed(2)}
        </div>
      ),
      style: { justifyContent: "flex-end" },
      width: "150px",
    });

    return cols;
  }, [t, rateColumns, renderNumericInput]);

  // Handle empty state
  if (!skills || skills.length === 0) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
        {t("No roles available for the selected campaign")}
      </div>
    );
  }

  if (!rateBreakupSchema || Object.keys(rateBreakupSchema).length === 0) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
        {t("No rate breakup schema available")}
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <DataTable
        columns={columns}
        data={roles}
        customStyles={tableCustomStyle(false)}
        highlightOnHover
        dense
      />
    </div>
  );
};

export default RoleWageTable;