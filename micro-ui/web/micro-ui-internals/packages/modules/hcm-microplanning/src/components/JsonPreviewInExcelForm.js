import { Button, DownloadIcon, SVG } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_THEME_COLOR } from "../configs/constants";

export const JsonPreviewInExcelForm = (props) => {
  const { t } = useTranslation();
  const sheetsData = props?.sheetsData;
  const [currentSheetName, setCurrentSheetName] = useState(Object.keys(sheetsData).length > 0 ? Object.keys(sheetsData)[0] : undefined);
  return (
    <div className="preview-data ">
      <div
        className="operational-buttons"
        style={{
          ...props?.btnStyle,
        }}
      >
        <Button
          label={t("BUTTON_BACK")}
          variation="secondary"
          icon={<SVG.ArrowBack height={"2rem"} width={"2rem"}  fill={PRIMARY_THEME_COLOR} />}
          type="button"
          onButtonClick={() => props?.onBack()}
        />
        <Button
          label={t("BUTTON_DOWNLOAD")}
          variation="secondary"
          icon={<DownloadIcon height={"1.25rem"} width={"1.25rem"}  fill={PRIMARY_THEME_COLOR} />}
          type="button"
          onButtonClick={() => props?.onDownload()}
        />
      </div>
      <div className="excel-wrapper">
        {/* {Object.entries(sheetsData).map(([sheetName, sheetData], index) => ( */}
        <div key={sheetsData?.[currentSheetName]} className="sheet-wrapper">
          <table className="excel-table">
            <thead>
              <tr>
                {sheetsData?.[currentSheetName]?.[0].map((header, columnIndex) => (
                  <th key={columnIndex}>{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheetsData?.[currentSheetName]?.slice(1).map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(sheetsData?.[currentSheetName]?.[0])?.map((_, cellIndex) => (
                    <td key={cellIndex}>{rowData[cellIndex] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="excel-tab-list">
        {Object.entries(sheetsData).map(([sheetName, sheetData], index) => (
          <button type="button" key={sheetName} className={`tab ${sheetName === currentSheetName ? "active" : ""}`} onClick={() =>{
           setCurrentSheetName(sheetName);
          }}>
            {sheetName}
          </button>
        ))}
        </div>
        {/* ))} */}
      </div>
    </div>
  );
};
