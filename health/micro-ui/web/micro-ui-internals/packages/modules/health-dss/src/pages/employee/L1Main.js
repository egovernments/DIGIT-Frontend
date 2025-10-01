import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Loader, Card, TooltipWrapper, Button } from "@egovernments/digit-ui-components";
import { HeaderComponent } from "@egovernments/digit-ui-components";
import Icon from "../../components/Icon";
import { DownloadIcon, MultiLink, ShareIcon } from "@egovernments/digit-ui-react-components";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FilterContext from "../../components/FilterContext";
import MapChart from "../../components/MapChart";
import MapDrillChart from "../../components/MapDrillChart";
import CustomTable from "../../components/CustomTable";
import StackedTable from "../../components/StackedTable";
import GenericChart from "../../components/GenericChart";
import NoData from "../../components/NoData";
import HeatMapChart from "../../components/AdvancedMapCharts/HeatMap";
import CustomPieChart from "../../components/CustomPieChart";
import CustomHorizontalBarChart from "../../components/CustomHorizontalBarChart";
import VennDiagramChart from "../../components/VennDiagramChart";
import { getDuration } from "../../utils/getDuration";
import { PDFDownload } from "../../utils/PDFDownload";

const key = "DSS_FILTERS";
const getInitialRange = () => {
  const campaignData = Digit.SessionStorage.get("campaigns-info");
  const projectType = getProjectType(window.location.pathname, campaignData);
  const data = Digit.SessionStorage.get(key);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let startDate = today;
  let endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const interval = getDuration(startDate, endDate);
  const denomination = data?.denomination || "Lac";
  const tenantId = data?.filters?.tenantId || [];

  let boundaries;
  if (campaignData && projectType) {
    let provinceData = campaignData[projectType];
    if (provinceData) {
      startDate = today;
      endDate = Digit.Utils.dss.getDefaultFinacialYear().endDate;
      boundaries = provinceData?.boundaries;
      return { startDate, endDate, title, interval, denomination, tenantId, boundaries };
    }
  }
  return { startDate, endDate, title, interval, denomination, tenantId, boundaries };
};
const getProjectType = (currentUrl, campaignData) => {
  let projectTypes = Digit.SessionStorage.get("projectTypes");
  if (!projectTypes) {
    return null;
  }
  const campaignCode = Object.keys(campaignData)?.[0];
  let currentProjectType = projectTypes?.find((projectType) => projectType.code == campaignCode);
  return currentProjectType.code;
};

const colors = [
  { dark: "rgba(12, 157, 149, 0.85)", light: "rgba(11, 222, 133, 0.14)" },
  { dark: "rgba(251, 192, 45, 0.85)", light: "rgba(255, 202, 69, 0.24)" },
  { dark: "rgba(75, 31, 165, 0.85)", light: "rgba(138, 83, 255, 0.24)" },
  { dark: "rgba(4, 139, 208, 0.85)", light: "rgba(4, 139, 208, 0.24)" },
  { dark: "rgba(239, 124, 91, 0.85)", light: "rgba(255, 114, 69, 0.24)" },
  { dark: "rgba(81, 210, 198, 0.85)", light: "rgba(83, 255, 234, 0.14)" },
  { dark: "rgba(183, 165, 69, 0.85)", light: "rgba(222, 188, 11, 0.24)" },
  { dark: "rgba(110, 132, 89, 1)", light: "rgba(159, 255, 83, 0.24)" },
  { dark: "rgba(120, 120, 120, 0.85)", light: "rgb(120,120,120,0.35)" },
  { dark: "rgba(183, 165, 69, 0.85)", light: "rgba(222, 188, 11, 0.24)" },
  { dark: "rgba(183, 165, 69, 0.85)", light: "rgba(222, 188, 11, 0.24)" },
];

const Chart = ({ data, moduleLevel, overview = false }) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { id, chartType } = data;
  const { startDate, endDate, interval } = getInitialRange();
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };
  const aggregationRequestDto = {
      visualizationCode: id,
      visualizationType: chartType,
      queryType: "",
      requestDate: requestDate,
      filters: {campaignNumber:campaignNumber},
      moduleLevel:moduleLevel,
      aggregationFactors: null,
    };
  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);


  const Insight = () => {
    const data = response?.responseData?.data?.[0];
    const insight = data?.insight?.value?.replace(/[+-]/g, "")?.split("%");

    if (data.insight?.indicator === "insight_no_diff") {
      return <div className={"digit-dss-insight-card-difference"}>{data?.insight?.value}</div>;
    }

    return (
      <div className={`digit-dss-insight-card-difference ${data?.insight?.indicator === "upper_green" ? "increase" : "decrease"}`}>
        <Icon
          type={data?.insight?.indicator === "upper_green" ? "arrow-upward" : "arrow-downward"}
          iconColor={data?.insight?.indicator === "upper_green" ? "#00703C" : "#D4351C"}
          width="1.5rem"
          height="1.5rem"
          className="digit-dss-insight-icon"
        />
        {insight?.[0] && `${insight[0]}% ${t(Digit.Utils.locale.getTransformedLocale("DSS" + insight?.[1] || ""))}`}
      </div>
    );
  };

  if (isLoading) {
    return <Loader className={"digit-center-loader"} />;
  }
  const subTextName = t(`SUB_TEXT_${data?.name}`);
  const subText = subTextName !== `SUB_TEXT_${data?.name}` ? subTextName : "";

  return (
    <div className={"digit-dss-insight-card"} style={overview ? {} : { margin: "0px" }}>
      <div className="digit-dss-insight-card-value">
        {Digit.Utils.dss.formatter(response?.responseData?.data?.[0]?.headerValue, response?.responseData?.data?.[0]?.headerSymbol, "Lac", true, t)}
      </div>
      <TooltipWrapper header={t(`TIP_${data.name}`)} placement={"top"}>
        <div className="digit-dss-insight-card-text">{t(data?.name)}</div>
      </TooltipWrapper>
      {subText && <div className="digit-dss-insight-card-sub-text">{subText}</div>}
      {response?.responseData?.data?.[0]?.insight?.value ? <Insight /> : null}
    </div>
  );
};

const HorBarChart = ({ data, setselectState = "" }) => {
  const barColors = ["#298CFF", "#54D140"];
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const { id, chartType } = data;
  let filters = {};
  if (setselectState !== "") filters.state = setselectState;

  filters = { ...filters };
  const { startDate, endDate, interval } = getInitialRange();
  const { campaignNumber } = Digit.Hooks.useQueryParams();

  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };

  const aggregationRequestDto = {
      visualizationCode: id,
      visualizationType: chartType,
      queryType: "",
      requestDate:requestDate,
      filters:{...filters,campaignNumber:campaignNumber},
      aggregationFactors: null,
    };
    const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);


  const constructChartData = (data) => {
    let result = {};
    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.plots.length; j++) {
        const plot = row.plots[j];
        result[plot.name] = { ...result[plot.name], [t(row.headerName)]: plot?.value, name: t(plot.name) };
      }
    }
    return Object.keys(result).map((key) => {
      return {
        name: key,
        ...result[key],
      };
    });
  };
  const renderLegend = (value) => (
    <span style={{ fontSize: "16px", color: "#505A5F" }}>{t(`DSS_${Digit.Utils.locale.getTransformedLocale(value)}`)}</span>
  );
  const chartData = useMemo(() => constructChartData(response?.responseData?.data));

  if (isLoading) {
    return <Loader className={"digit-center-loader"} />;
  }

  const bars = response?.responseData?.data?.map((bar) => bar?.headerName);
  return (
    <ResponsiveContainer
      width="50%"
      height={480}
      margin={{
        top: 5,
        right: 5,
        left: 5,
        bottom: 5,
      }}
    >
      {chartData?.length === 0 || !chartData ? (
        <NoData t={t} />
      ) : (
        <BarChart
          width="100%"
          height="100%"
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
          layout={"horizontal"}
          data={chartData}
          barGap={12}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <YAxis
            dataKey={""}
            type={"number"}
            tick={{ fontSize: "12px", fill: "#505A5F" }}
            label={{
              value: "",
              angle: -90,
              position: "insideLeft",
              dy: 50,
              fontSize: "14px",
              fill: "#505A5F",
            }}
            tickCount={10}
            unit={""}
            width={130}
          />
          <XAxis dataKey={"name"} type={"category"} tick={{ fontSize: "14px", fill: "#505A5F" }} tickCount={10} />
          {bars?.map((bar, id) => (
            <Bar key={id} dataKey={t(bar)} fill={barColors[id]} stackId={bars?.length > 2 ? 1 : id} />
          ))}
          <Legend formatter={renderLegend} iconType="circle" />
          <Tooltip cursor={false} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

const L1Main = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dashboardData = location.state?.dashboardData || Digit.SessionStorage.get("dashboardData");
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const language = Digit.StoreData.getCurrentLanguage();
  // const projectTypeId = location.state?.projectTypeId;
  const campaignNumber = location.state?.campaignNumber;
  const dashboardLink = location.state?.dashboardLink;
  const dashboardId = dashboardLink?.dashboardId;
  const stateCode = Digit?.ULBService?.getStateId();
  const [filters, setFilters] = useState(() => {});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [selectedState, setselectedState] = useState("");
  const [drillDownId, setdrillDownId] = useState("none");
  const [totalCount, setTotalCount] = useState("");
  const [liveCount, setLiveCount] = useState("");
  const [searchQuery, onSearch] = useState("");
  const [pageZoom, setPageZoom] = useState(false);
  const { isLoading: localizationLoading, data: store } = Digit.Services.useStore({ stateCode, dashboardId, language });

  // function getProjectTypeIDFromURL() {
  //   const url = window.location.pathname;
  //   const projectTypes = Digit.SessionStorage.get("projectTypes");
  //   const matchingProject = projectTypes?.find(
  //     (item) => item?.dashboardUrls && Object.values(item?.dashboardUrls)?.some((dashboardUrl) => url === dashboardUrl)
  //   );

  //   // Return the id of the matching object or null if not found
  //   const projectTypeId = matchingProject ? matchingProject.id : null;

  //   return projectTypeId;
  // }

  // useEffect(() => {
  //   if (projectTypeId) {
  //     Digit.SessionStorage.set("selectedProjectTypeId", projectTypeId);
  //   } else {
  //     Digit.SessionStorage.set("selectedProjectTypeId", getProjectTypeIDFromURL());
  //   }
  // }, []);

  useEffect(() => {
    if (showDownloadOptions === false) {
      setPageZoom(true);
      const timeoutId = setTimeout(() => {
        setPageZoom(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showDownloadOptions]);

  const handleFilters = (data) => {
    Digit.SessionStorage.set(key, data);
    setFilters(data);
  };

  function routeTo(jumpTo) {
    location.href = jumpTo;
  }

  const fullPageRef = useRef();

  const provided = useMemo(
    () => ({
      value: filters,
      setValue: handleFilters,
    }),
    [filters]
  );

  const mobileView = innerWidth <= 640;

  const handlePrint = () => Digit.Download.PDF(fullPageRef, t(dashboardConfig?.[0]?.name));

  const dashboardConfig = dashboardData;

  const shareOptions = navigator.share
    ? [
        {
          code: "ES_DSS_SHARE_PDF",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          code: "ES_DSS_SHARE_IMAGE",
          label: t("ES_DSS_SHARE_IMAGE"),
        },
      ]
    : [
        {
          icon: "EmailIcon",
          code: "ES_DSS_SHARE_PDF_EMAIL",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          icon: "WhatsappIcon",
          code: "ES_DSS_SHARE_PDF_WHATSAPP",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          icon: "EmailIcon",
          label: t("ES_DSS_SHARE_IMAGE"),
          code: "ES_DSS_SHARE_IMAGE_EMAIL",
        },
        {
          icon: "WhatsappIcon",
          label: t("ES_DSS_SHARE_IMAGE"),
          code: "ES_DSS_SHARE_IMAGE_WHATSAPP",
        },
      ];

  const downloadOptions = [
    {
      icon: "ImageIcon",
      code: "ES_DSS_DOWNLOAD_IMAGE",
      label: t("ES_DSS_DOWNLOAD_IMAGE"),
    },
    {
      icon: "PDFSvg",
      label: t("ES_DSS_DOWNLOAD_PDF"),
      code: "ES_DSS_DOWNLOAD_PDF",
    },
  ];

  const onActionSelect = (item) => {
    switch (item?.code) {
      case "ES_DSS_DOWNLOAD_IMAGE":
        setTimeout(() => {
          return Digit.Download.Image(fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
      case "ES_DSS_DOWNLOAD_PDF":
        setTimeout(() => {
          return PDFDownload(fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
      case "ES_DSS_SHARE_PDF_EMAIL":
        setTimeout(() => {
          return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
        }, 500);
        break;
      case "ES_DSS_SHARE_PDF_WHATSAPP":
        setTimeout(() => {
          return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
        }, 500);
        break;
      case "ES_DSS_SHARE_IMAGE_EMAIL":
        setTimeout(() => {
          return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
        }, 500);
        break;
      case "ES_DSS_SHARE_IMAGE_WHATSAPP":
        setTimeout(() => {
          return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
        }, 500);
        break;
      case "ES_DSS_SHARE_PDF":
        setTimeout(() => {
          return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
      case "ES_DSS_SHARE_IMAGE":
        setTimeout(() => {
          return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
        }, 500);
        break;
    }
  };

  if (localizationLoading) {
    return <Loader className={"digit-center-loader"} />;
  }

  return (
    <FilterContext.Provider value={provided}>
      <div ref={fullPageRef}>
        <div className="digit-dss-options-header-wrapper">
          <HeaderComponent className={"digit-dss-options-header-text"}>{t(dashboardConfig?.[0]?.name)}</HeaderComponent>
          {mobileView ? null : (
            <div className="digit-dss-options-header-options">
              <Button
                type="actionButton"
                variation="teritiary"
                label={t(`ES_DSS_SHARE`)}
                options={shareOptions}
                optionsKey="label"
                showBottom={true}
                size={"medium"}
                className={"digit-dss-options-header-option-button"}
                isSearchable={false}
                wrapperClassName={"digit-dss-options-header-options-button-wrapper"}
                onOptionSelect={onActionSelect}
                icon={"Share"}
                iconFill={"#505a5f"}
              />
              <Button
                type="actionButton"
                className={"digit-dss-options-header-option-button"}
                variation="teritiary"
                wrapperClassName={"digit-dss-options-header-options-button-wrapper"}
                label={t(`ES_DSS_DOWNLOAD`)}
                options={downloadOptions}
                optionsKey="label"
                size={"medium"}
                showBottom={true}
                isSearchable={false}
                icon={"FileDownload"}
                onOptionSelect={onActionSelect}
                iconFill={"#505a5f"}
              />
            </div>
          )}
        </div>

        {mobileView ? (
          <div className="options-m">
            <div>
              <MultiLink
                className="multilink-block-wrapper"
                label={t(`ES_DSS_SHARE`)}
                icon={<ShareIcon className="mrsm" />}
                showOptions={(e) => setShowShareOptions(e)}
                onHeadClick={(e) => setShowShareOptions(e !== undefined ? e : !showShareOptions)}
                displayOptions={showShareOptions}
                options={shareOptions}
              />
            </div>
            <div onClick={handlePrint}>
              <DownloadIcon />
              {t(`ES_DSS_DOWNLOAD`)}
            </div>
          </div>
        ) : null}
        {dashboardConfig?.[0]?.visualizations.map((row, key) => {
          return (
            <div className={`digit-dss-card add-margin`} key={key}>
              {row.vizArray.map((item, index) => {
                if (item?.charts?.[0]?.chartType == "bar") {
                  return null;
                } else if (item?.charts?.[0]?.chartType === "heatmap") {
                  return (
                    <HeatMapChart
                      initialRange={getInitialRange()}
                      visualizer={item}
                      chartId={item?.charts?.[0].id}
                      isNational={true}
                      pageZoom={pageZoom}
                    />
                  
                  );
                } else if (item?.vizType === "stacked-table") {
                  return (
                    <StackedTable
                      visualizer={item}
                      chartId={item?.charts?.[0].id}
                      isNational={true}
                      routeTo={routeTo}
                      redirectUrl={item?.ref?.url}
                      initialRange={getInitialRange()}
                    ></StackedTable>
                  );
                } else if (item?.charts?.[0]?.chartType == "map") {
                  return (
                    <div
                      className={`digit-dss-card-parent  ${
                        item.vizType == "collection"
                          ? "w-100"
                          : item.name.includes("PROJECT_STAUS") || item.name.includes("LIVE_ACTIVE_ULBS")
                          ? "dss-h-100"
                          : ""
                      }`}
                      style={item.vizType == "collection" ? { backgroundColor: "#fff", height: "600px" } : { backgroundColor: colors[index].light }}
                      key={index}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="dss-card-header">
                          {/* {Icon(item.name)} */}
                          <p style={{ marginLeft: "20px" }}>
                            {selectedState === "" ? t(item.name) : t(`DSS_TB_${Digit.Utils.locale.getTransformedLocale(selectedState)}`)}
                          </p>
                          {selectedState != "" && item.name.includes("PROJECT_STAUS") && (
                            <span style={{ fontSize: "16px", display: "block" }}>
                              {t(`DSS_TOTAL_ULBS`)} {Number(totalCount).toFixed()} | {t(`DSS_LIVE_ULBS`)} {Number(liveCount).toFixed()}
                            </span>
                          )}
                        </div>
                        {item?.charts?.[0]?.chartType == "map" && (
                          <div className="dss-card-header" style={{ width: "45%" }}>
                            {/* {Icon(row.vizArray?.[1]?.name)} */}
                            <p style={{ marginLeft: "20px", fontSize: "24px", fontFamily: "Roboto, sans-serif", fontWeight: 500, color: "#000000" }}>
                              {selectedState === ""
                                ? t(row.vizArray?.[1]?.name)
                                : t(`${Digit.Utils.locale.getTransformedLocale(selectedState)}_${row.vizArray?.[1]?.name}`)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="dss-card-body">
                        {item?.charts?.[0]?.chartType == "map" &&
                          (selectedState != "" ? (
                            <MapDrillChart
                              data={item?.charts?.[0]}
                              selectedState={selectedState}
                              setselectedState={setselectedState}
                              drilldownId={drillDownId}
                              setdrilldownId={setdrillDownId}
                              setTotalCount={setTotalCount}
                              setLiveCount={setLiveCount}
                            />
                          ) : (
                            <MapChart
                              data={item?.charts?.[0]}
                              setselectedState={setselectedState}
                              setdrilldownId={setdrillDownId}
                              settotalCount={setTotalCount}
                              setliveCount={setLiveCount}
                            />
                          ))}
                        {item?.charts?.[0]?.chartType == "map" && (
                          <HorBarChart data={row.vizArray?.[1]?.charts?.[0]} setselectState={selectedState}></HorBarChart>
                        )}
                      </div>
                    </div>
                  );
                } else if (item?.vizType === "stacked-collection") {
                  return (
                    <Card key={index} className={"digit-stacked-collection-card"}>
                      <div className={"digit-stacked-collection-card-header-wrapper"}>
                        <Icon type={item.name} iconColor={"#C84C0E"} width="1.5rem" height="1.5rem" className="digit-dss-stacked-card-icon" />
                        <div className={"digit-stacked-collection-card-header-text"}>{t(item.name)}</div>
                      </div>
                      <div className="digit-dss-card-body-stacked">
                        {item.charts.map((chart, key) => (
                          <div className={`digit-dss-card-item ${key !== item.charts.length - 1 ? "digit-dss-card-item-border" : ""}`}>
                            <Chart data={chart} key={key} moduleLevel={item.moduleLevel} overview={item.vizType === "collection"} />
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                } else if (item?.charts?.[0]?.chartType == "donut") {
                  const pieChart = item?.charts?.[0];
                  return (
                    <GenericChart header={item.name} className={"digit-dss-card-parent heatMap"} subHeader={`SUB_${item.name}`}>
                      <CustomPieChart data={pieChart} title={item?.name} isNational={true} />
                    </GenericChart>
                  );
                } else if (item?.charts?.[0]?.chartType == "v-bar") {
                  const barChart = item?.charts?.[0];
                  return (
                    <GenericChart header={item.name} className={"digit-dss-card-parent heatMap"} subHeader={`SUB_${item.name}`}>
                      <CustomHorizontalBarChart data={barChart} title={item?.name} isNational={true} />
                    </GenericChart>
                  );
                } else if (item?.charts?.[0]?.chartType == "table") {
                  const chartData = item?.charts?.[0];
                  return (
                    <GenericChart
                      header={item.name}
                      showSearch={item?.charts?.[0].chartType === "table"}
                      className={item?.charts?.[0].chartType === "table" && "fullWidth"}
                      subHeader={`SUB_${item.name}`}
                      onChange={(e) => onSearch(e.target.value)}
                      showDownload={item?.charts?.[0]?.chartType === "table"}
                    >
                      <CustomTable data={chartData} onSearch={searchQuery} title={item?.name} />
                    </GenericChart>
                  );
                } else if (item?.charts?.[0]?.chartType == "venn") {
                  const vennChart = item?.charts?.[0];
                  return (
                    <GenericChart header={item?.name} className="employeeCard chart-item stackedCard" subHeader={`SUB_${item.name}`}>
                      <VennDiagramChart data={vennChart} isNational={true} />
                    </GenericChart>
                  );
                } else {
                  return (
                    <div
                      className={`digit-dss-card-parent  ${
                        item.vizType == "collection"
                          ? "dss-w-100"
                          : item.name.includes("PROJECT_STAUS") || item.name.includes("LIVE_ACTIVE_ULBS")
                          ? "h-100"
                          : ""
                      }`}
                      style={
                        item.vizType == "collection" || item.name.includes("PROJECT_STAUS") || item.name.includes("LIVE_ACTIVE_ULBS")
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: colors[index].light, padding: "20px" }
                      }
                      key={index}
                      onClick={() => routeTo(`/${window.contextPath}/employee/dss/dashboard/${item.ref.url}`)}
                    >
                      <div style={{ justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                        <div className="dss-card-header" style={{ marginBottom: "10px" }}>
                          {/* {Icon(item.name, colors[index].dark)} */}
                          <p style={{ marginLeft: "20px" }}>{t(item.name)}</p>
                        </div>
                        {item.vizType == "collection" ? (
                          <div
                            style={{
                              float: "right",
                              textAlign: "right",
                              color: "#F47738",
                              fontSize: 16,
                              fontWeight: "bold",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <span style={{ paddingRight: 10 }}>{t("DSS_OVERVIEW")}</span>
                            <span>
                              {" "}
                              <Arrow_Right />
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="dss-card-body">
                        {item.charts.map((chart, key) => (
                          <div style={item.vizType == "collection" ? { width: Digit.Utils.browser.isMobile() ? "50%" : "25%" } : { width: "50%" }}>
                            <Chart data={chart} key={key} moduleLevel={item.moduleLevel} overview={item.vizType === "collection"} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </FilterContext.Provider>
  );
};

export default L1Main;
