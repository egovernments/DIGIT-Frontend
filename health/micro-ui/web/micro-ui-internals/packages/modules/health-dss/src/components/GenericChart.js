import { Card, TextInput, Button, HeaderComponent, TooltipWrapper, SVG } from "@egovernments/digit-ui-components";
import React, { useRef, Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const GenericChart = ({
  header,
  subHeader,
  className,
  caption,
  children,
  showHeader = true,
  showSearch = false,
  showDownload = false,
  onChange,
  chip = [],
  updateChip,
  value = {},
  setDownloadChartsId = null,
}) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const [chartData, setChartData] = useState(null);
  const [chartDenomination, setChartDenomination] = useState(null);
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const chart = useRef();
  const menuItems = [
    {
      code: "image",
      i18nKey: t("ES_COMMON_DOWNLOAD_IMAGE"),
      icon: "FileDownload",
    },
    {
      code: "shareImage",
      i18nKey: t("ES_DSS_SHARE_IMAGE"),
      target: "mail",
      icon: "Email",
    },
    {
      code: "shareImage",
      i18nKey: t("ES_DSS_SHARE_IMAGE"),
      target: "whatsapp",
      icon: "Whatsapp",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chart?.current && !chart?.current.contains(event.target)) {
        setDropdownStatus(false);
      }
    };

    if (dropdownStatus) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownStatus]);

  function download(data) {
    let chartIdToDownload = children?.props?.data?.id || children?.props?.chartId || null;
    if (setDownloadChartsId !== null) {
      setDownloadChartsId(chartIdToDownload);
    }

    setTimeout(() => {
      switch (data.code) {
        case "pdf":
          return Digit.Download.PDF(chart, t(header));
        case "image":
          return Digit.Download.IndividualChartImage(chart, t(header));
        case "sharePdf":
          return Digit.ShareFiles.PDF(tenantId, chart, t(header), data.target);
        case "shareImage":
          return Digit.ShareFiles.IndividualChartImage(tenantId, chart, t(header), data.target);
        default:
          return null;
      }
    }, 1000);
    setTimeout(() => {
      {
        if (setDownloadChartsId !== null) {
          setDownloadChartsId(null);
        }
      }
    }, 1500);
  }

  const handleExcelDownload = () => {
    return Digit.Download.Excel(chartData, t(header));
  };

  return (
    <Card className={`digit-chart-item ${className}`} ReactRef={chart}>
      <div className={`digit-chart-header ${showSearch && "digit-chart-column-direction"}`}>
        <div className="digit-chart-header-wrapper">
          {showHeader && (
            <TooltipWrapper header={t(`TIP_${Digit.Utils.locale.getTransformedLocale(header)}`)} placement={"top"}>
              <HeaderComponent>
                <span className={`digit-generic-chart-header`}>
                  {t(Digit.Utils.locale.getTransformedLocale(header))}
                  {chartDenomination?.toLowerCase() === "amount" && (
                    <span style={{ whiteSpace: "pre" }}> ({t(`DSS_${Digit.Utils.locale.getTransformedLocale(value?.denomination)}`)})</span>
                  )}
                </span>
              </HeaderComponent>
            </TooltipWrapper>
          )}
        </div>
        <div className="digit-side-content">
          {chip && chip.length > 1 && <Chip items={chip} onClick={updateChip} t={t} />}
          {(showSearch || showDownload) && (
            <span className="digit-table-search-wrapper">
              {showSearch && (
                <div className="digit-field">
                  <TextInput className={"digit-generic-chart-search-field"} placeholder={t("DSS_SEARCH")} onChange={onChange} type={"search"} />
                </div>
              )}
              {showDownload && <SVG.FileDownload onClick={handleExcelDownload} fill={"#505A5F"} />}
            </span>
          )}
          {!showDownload && (
            <Button
              type="actionButton"
              variation="secondary"
              className={"digit-ellipsis-button"}
              label={""}
              wrapperClassName={"digit-ellipsis-button-wrapper"}
              title={""}
              icon={"Ellipsis"}
              iconFill={"#505a5f"}
              options={menuItems}
              optionsKey="i18nKey"
              showBottom={true}
              isSearchable={false}
              onOptionSelect={(data) => download(data)}
            />
          )}
        </div>
      </div>
      {subHeader && <div className="digit-generic-chart-subheader">{t(subHeader)}</div>}
      {caption && <div className="digit-generic-chart-caption">{t(caption)}</div>}
      {React.cloneElement(children, { setChartData, setChartDenomination })}
    </Card>
  );
};

export default GenericChart;

const Chip = (props) => {
  const [state, setState] = useState(1);
  return (
    <div className="digit-table-switch-card-chip">
      {props.items.map((item, index) => {
        return (
          <div
          className={`digit-table-switch-card ${item.active && state ? "active" : "inactive"}`}
            onClick={() => {
              props.onClick && props.onClick(item.index);
              setState((prev) => prev + 1);
            }}
          >
            {props.t(`DSS_TAB_${item?.tabName?.toUpperCase()}`)}
          </div>
        );
      })}
    </div>
  );
};
