import React, { useState, useEffect, useMemo, useContext } from 'react';
import Highcharts from 'highcharts';
import VennModule from 'highcharts/modules/venn.js';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';
import FilterContext from './FilterContext';
import NoData from "./NoData";
import { Loader } from '@egovernments/digit-ui-components';
import { getDuration } from "../utils/getDuration";
// Initialize the VennModule
VennModule(Highcharts);

const getInitialRange = () => {
  const data = Digit.SessionStorage.get("DSS_FILTERS");
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const interval = getDuration(startDate, endDate);
  return { startDate, endDate, interval };
};
// Function to generate dynamic colors based on the number of sets
const generateDynamicColors = (numSets) => {
  const colors = [];
  for (let i = 0; i < numSets; i++) {
    // Generate a color by varying the hue
    const hue = (i * 360) / numSets; // Evenly distribute hues around the color wheel
    const color = `hsl(${hue}, 70%, 80%)`; // HSL with constant saturation and lightness
    colors.push(color);
  }
  return colors;
};

const transformData = (data) => {
  // Initialize an object to hold the sums
  const result = {};

  // Iterate over the data array
  data?.forEach((item) => {
    // Filter plots to exclude "S.N." and "VENN"
    const relevantPlots = item?.plots?.filter(
      (plot) => plot?.name !== "S.N." && plot?.name !== "VENN" && plot?.value > 0
    );

    // Sum values for each key
    relevantPlots.forEach((plot) => {
      if (plot?.value) {
        result[plot?.name] = (result[plot?.name] || 0) + plot?.value;
      }
    });
  });

  // Transform the result object into the desired array format
  const transformedData = Object.entries(result).map(([name, value]) => ({
    name,
    value,
  }));

  return transformedData;
};


const VennDiagramChart = ({data, isNational = false,}) => {
  const [chartData, setChartData] = useState([]);
  const [chartLoaded, setChartLoaded] = useState(false);
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const { id, chartType } = data;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const [chartKey, setChartKey] = useState(id);

  const { startDate, endDate, interval } = getInitialRange();
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let todayDate = today;
  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };
  const aggregationRequestDto = {
    visualizationCode: id,
    visualizationType: "metric",
    queryType: "",
    requestDate:
      value?.requestDate != null
        ? {
            ...value?.requestDate,
            startDate: isNational ? todayDate?.getTime() : value?.range?.startDate?.getTime(),
            endDate: value?.range?.endDate?.getTime(),
          }
        : requestDate,
    filters: { campaignNumber: campaignNumber },
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };
  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

  useEffect(() => {
    if (!response?.responseData?.data) return; // Wait until data is available

    const transformedData = transformData(response?.responseData?.data);

    if (transformedData.length > 0) {
      const colors = generateDynamicColors(transformedData.length);

      const chartFormattedData = transformedData.map((item, index) => ({
        sets: item.name.split("+"),
        value: item.value,
        name: `${t(item.name)}`,
        id: item.name,
        color: colors[index],
        legendIndex: index,
        legendColor: colors[index],
        dataLabels: {
          style: {
            fontSize: "16px",
            color: "#505A5F",
          },
          format: "{point.value}",
        },
      }));

      // Step 1: Identify single sets with non-zero values (valid sets)
      const validSets = new Set(chartFormattedData?.filter((item) => item.sets.length === 1 && item.value > 0).map((item) => item.sets[0]));

      // Step 2: Retain only objects that are entirely derived from valid sets
      const filteredData = chartFormattedData.filter((item) => item.sets.every((set) => validSets.has(set)));

      setChartData(filteredData); // Set chart data once available
    } else {
      setChartData([]); // No valid data
    }
  }, [response]);

  const vennOptions = {
    title: {
      text: "",
    },
    chart: {
      backgroundColor: "#EEEEEE",
      animation: true,
      height: 500,
      width: null,
      marginTop: 30,
      events: {
        load: () => setChartLoaded(true), // Set chartLoaded to true after rendering
      },
    },
    credits: {
      enabled: false, // Remove the Highcharts watermark
    },
    tooltip: {
      pointFormat: `{point.name} </i><br><b>${t("CAMPAIGN_VALUE_LABEL")}: {point.value}</v>`,
      style: {
        fontSize: "16px",
        color: "#505A5F",
      },
    },
    plotOptions: {
      venn: {
        states: {
          hover: {
            brightness: 0.2, // Adjust brightness on hover
          },
        },
        point: {
          events: {
            mouseOver() {
              if (!chartLoaded) return;
              // Save original colors of points before hover
              this.series.data.forEach((point) => {
                point.update({ originalColor: point.color }, false); // Save original color
              });

              // Dim other points
              this.series.data.forEach((point) => {
                if (point !== this) point.update({ color: "rgba(200,200,200,0.3)" }, false);
              });

              // Highlight hovered point
              this.update({ color: this.color }, false);
              this.series.chart.redraw();
            },
            mouseOut() {
              if (!chartLoaded) return;
              // Reset colors after hover to their original color
              this.series.data.forEach((point) => {
                point.update({ color: point.originalColor }, false); // Reset to original color
              });
              this.series.chart.redraw();
            },
            // click : function () {

            // }
          },
        },
      },
    },
    series: [
      {
        type: "venn",
        name: "",
        data: chartData,
        colorByPoint: true,
      },
    ],
  };
  if (isLoading) {
    return <Loader className={"digit-center-loader"}/>;
  } else if (chartData?.length === 0) {
    return <NoData t={t} />;
  } else {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "98%", margin: "auto", backgroundColor: "#FAFAFA", border: "1px solid rgb(214, 213, 212)" }}>
          <HighchartsReact highcharts={Highcharts} options={vennOptions} />
        </div>
        {/* Custom Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
            maxWidth: "94%",
            maxHeight: "100px", // Set maximum height for the legend container
            overflowY: "auto", // Make it scrollable if content overflows
            flexWrap: "wrap",
          }}
        >
          {chartData?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: 30,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: item.legendColor,
                  borderRadius: "50%",
                  marginRight: 5,
                }}
              ></div>
              <span style={{ fontSize: "16px", color: "#505A5F" }}>{t(item.id)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default VennDiagramChart;
