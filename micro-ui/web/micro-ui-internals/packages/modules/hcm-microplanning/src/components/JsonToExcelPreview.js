import { Button, DownloadIcon, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

export const ExcelComponent = (props) => {
  const { t } = useTranslation();
  const sheetsData = props?.sheetsData;
  console.log(sheetsData);
  return (
    <div className="preview-data " >
      <div
        className="operational-buttons"
        style={{
          ...props?.btnStyle,
        }}
      >
        <Button
          label={t("BUTTON_BACK")}
          variation="secondary"
          icon={<SVG.ArrowBackIos styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
          type="button"
          onButtonClick={() => props?.onBack()}
        />
        <Button
          label={t("BUTTON_DOWNLOAD")}
          variation="secondary"
          icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
          type="button"
          onButtonClick={() => props?.onDownload()}
        />
      </div>
      <div className="excel-wrapper">
        {Object.entries(sheetsData).map(([sheetName, sheetData], index) => (
          <div key={index} className="sheet-wrapper">
            <table className="excel-table">
              <thead>
                <tr>
                  {sheetData[0].map((header, columnIndex) => (
                    <th key={columnIndex}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData.slice(1).map((rowData, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(sheetData[0]).map((_, cellIndex) => (
                      <td key={cellIndex}>{rowData[cellIndex] || ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
