import React from "react";
import TableMain from "./TableMain";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableRow from "./TableRow";
import Card from "./Card";
import { SVG } from "./SVG";
import PropTypes from 'prop-types';

const NestedTable = ({ nestedData, toggleRowExpansion, rowIndex }) => {
  const lastNestedData = nestedData[nestedData.length - 1];

  if (!lastNestedData || !lastNestedData.nestedData) {
    return <p>No nested data available</p>;
  }

  const { headerData, rows, tableDetails } = lastNestedData.nestedData;

  if (!rows || rows.length === 0 || !headerData || headerData.length === 0) {
    return <p>No nested data available</p>;
  }

  const renderNestedTable = () => {
    return (
      <div
        className="digit-table-container withBorder"
        role="region"
        aria-label={
          tableDetails?.tableTitle
            ? `${tableDetails.tableTitle} data table`
            : "Nested data table"
        }
      >
        <TableMain>
          <TableHeader>
            <TableRow>
              {headerData?.map((header, index) => (
                <TableCell key={index} isHeader={true}>
                  {header?.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.map((nestedRow, index) => (
              <TableRow key={index}>
                {nestedRow?.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    isHeader={false}
                    isFooter={false}
                    className={`scrollable-columns`}
                    cellData={cell}
                    columnType={headerData[cellIndex]?.type}
                    accessor={
                      headerData && headerData.length > 0
                        ? headerData[cellIndex]?.accessor
                        : null
                    }
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableMain>
      </div>
    );
  };

  return tableDetails?.tableTitle ||
    tableDetails?.tableDescription ||
    tableDetails?.addClose ? (
    <Card className={"digit-table-card"}>
      {(tableDetails?.tableDescription ||
        tableDetails?.tableTitle ||
        tableDetails?.addClose) && (
        <div className="table-header-wrapper">
          <div className="header-filter-wrapper">
            {tableDetails?.tableTitle && (
              <div
                className="table-header"
                role="heading"
                aria-level="3"
              >
                {tableDetails?.tableTitle}
              </div>
            )}
            {tableDetails?.addClose && (
              <SVG.Close
                fill={"#363636"}
                width={"2rem"}
                height={"2rem"}
                className={"table-filter-svg"}
                onClick={() => toggleRowExpansion(rowIndex)}
              />
            )}
          </div>
          {tableDetails?.tableDescription && (
            <div
              className="table-description"
              id={`nested-desc-${rowIndex}`}
            >
              {tableDetails?.tableDescription}
            </div>
          )}
        </div>
      )}
      {renderNestedTable()}
    </Card>
  ) : (
    renderNestedTable()
  );
};


NestedTable.propTypes = {
  nestedData: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleRowExpansion: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  };

export default NestedTable;
