import React from "react";
import { useTranslation } from "react-i18next";
import { LoaderComponent } from "@egovernments/digit-ui-components";

const MatricCard = ({ data }) => {
    const { t } = useTranslation();
    const { projectTypeId } = Digit.Hooks.useQueryParams();
    const { id, chartType, name } = data;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

    const requestDate = {
        startDate: startOfDay,
        endDate: endOfDay,
        interval: "daily",
        title: "home",
    };

    // Fetch chart data
    const { isLoading, data: chartData } = Digit.Hooks.DSS.useGetChart({
        key: id,
        type: chartType,
        tenantId: Digit.ULBService.getCurrentTenantId(),
        filters: { projectTypeId },
        requestDate,
    });

    if (isLoading) {
        return <LoaderComponent />;
    }

    // Extract relevant data safely
    const chartInfo = chartData?.responseData?.data?.[0] || {};
    const { headerName, headerValue = "0", headerSymbol, insight } = chartInfo;

    return (
        <div style={{ textAlign: "center", padding: "15px" }}>
            <p className="p1" style={{ fontSize: "24px", fontWeight: "bold" }}>
                {headerValue}
            </p>
            <p className="p2" style={{ fontSize: "14px", color: "#666" }}>{t(headerName || name)}</p>

            {/* Render insight if available */}
            {insight?.value && (
                <p
                    className="insight-text"
                    style={{
                        color: insight.indicator === "upper_green" ? "green" : insight.indicator === "lower_red" ? "red" : "#797979",
                        fontWeight: "bold",
                        marginTop: "5px",
                    }}
                >
                    {t(insight.value)}
                </p>
            )}
        </div>
    );
};

export default MatricCard;
