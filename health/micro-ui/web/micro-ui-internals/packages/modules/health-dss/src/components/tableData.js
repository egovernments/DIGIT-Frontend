import { Button, Card, LoaderComponent } from "@egovernments/digit-ui-components";
import React from "react";

const TableData = ({ chartData, url = "" }) => {
  const { projectTypeId } = Digit.Hooks.useQueryParams();

  console.log(chartData, 'chartData');

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

  const requestDate = {
    startDate: startOfDay,
    endDate: endOfDay,
    interval: "daily",
    title: "home",
  };

  const { isLoading, data: provinceData } = Digit.Hooks.DSS.useGetChart({
    key: chartData?.charts?.[0]?.id,
    type: chartData?.charts?.[0]?.chartType,
    tenantId: Digit.ULBService.getCurrentTenantId(),
    filters: { projectTypeId },
    requestDate,
  });

  console.log(provinceData, 'pppppppppppppp');

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div>
      {provinceData?.responseData?.data?.map((province, idx) => (
        <Card key={idx} type="secondary" style={{ marginBottom: idx != provinceData?.responseData?.data?.length - 1 ? "1.5rem" : "0", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}>
            <p style={{ fontSize: "20px", fontWeight: "bold", marginRight: "1rem", whiteSpace: "nowrap" }}>{province.headerName}</p>
            <div style={{ display: "flex", flexWrap: "wrap", flexGrow: 1, gap: "1rem" }}>
              {province.plots
                .filter(plot => !["S.N.", "startDate", "endDate", "Provinces"].includes(plot.name))
                .map((plot, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", minWidth: "150px", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>{plot.value || "0"}</span>
                    <span style={{ fontSize: "14px", color: "#666" }}>{plot.name}</span>
                  </div>
                ))}
            </div>
            {chartData?.ref?.url && (
              <Button
                className="custom-class"
                icon="Visibility"
                label="View Details"
                onClick={() => window.open(url, "_blank")}
                size="medium"
                variation="secondary"
              />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TableData;
