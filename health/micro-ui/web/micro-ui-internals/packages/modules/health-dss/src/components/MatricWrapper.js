import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider } from "@egovernments/digit-ui-components";
import MatricCard from "./MatricCard";

const MatricWrapper = ({ metricsArray }) => {
    const { t } = useTranslation();

    if (!metricsArray || !metricsArray.charts?.length) return null; // Handle empty case

    return (
        <Card>
            <div>
                {/* Header Section */}

                <div >
                    <p>{t(metricsArray.name)}</p>
                </div>

                {/* Charts Section */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {metricsArray.charts.map((chart, index) => (
                        <React.Fragment key={chart.id}>
                            <div style={{ width: "100%" }}>
                                <MatricCard data={chart} />
                            </div>
                            {index !== metricsArray.charts.length - 1 && <Divider />} {/* Correct Divider placement */}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default MatricWrapper;
