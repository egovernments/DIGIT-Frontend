import React, { Fragment } from "react";
import { useTable } from "react-table";
import { useTranslation } from "react-i18next";
import { CardLabel, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { operators } from "ajv/dist/compile/codegen";

const DetailsTable = ({ className = "", columnsData, rowsData, summaryRows, cardHeader }) => {

  const { t } = useTranslation();

  const columns = React.useMemo(() => columnsData, [t]);

  const data = React.useMemo(() => {
    const temp = rowsData.map((i) => {
      if (i?.operator?.code === "IN_BETWEEN") {
        return {
          ...i,
          value: `${i?.toValue ? i?.toValue : "N/A"}  to ${i?.fromValue ? i?.fromValue : "N/A"}`,
          operator: t(i?.operator?.code) || t(i?.operator),
      attribute: i?.attribute?.code ||  i?.attribute ? t(`CAMPAIGN_ATTRIBUTE_${i?.attribute?.code?.toUpperCase()}`) : "",
        };
      }
      else{
      return{
      ...i,
      value: typeof i?.value === "string" 
      ? t(i.value) 
      : i?.value,
      operator: t(i?.operator?.code) || t(i?.operator),
      attribute: i?.attribute?.code 
    ? t(`CAMPAIGN_ATTRIBUTE_${i.attribute.code.toUpperCase()}`) 
    : i?.attribute 
        ? t(`CAMPAIGN_ATTRIBUTE_${i.attribute}`) 
        : "",
      }
    }});
    return temp;
  }, [rowsData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <>
      {cardHeader && (
        <CardLabel className={`custom-table-label`} style={cardHeader?.inlineStyles}>
          {cardHeader?.value}
        </CardLabel>
      )}
      <div className={`custom-table-container ${className}`}>
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="row">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="head">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="row">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="data">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}

            {summaryRows && (
              <tr className="row">
                {summaryRows.map((cell, index) => (
                  <td className="data" style={index === 3 ? { borderRight: "0.5px solid #d6d5d4", textAlign: "right", fontWeight: 700 } : {}}>
                    {index === 4 ? <span className={cell === "Pass" ? "sla-cell-success" : "sla-cell-error"}> {cell} </span> : cell}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DetailsTable;
