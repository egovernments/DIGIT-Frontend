import { Card, LoaderComponent, TextInput } from "@egovernments/digit-ui-components";
import { DownloadIcon, EmailIcon, SearchIconSvg, WhatsappIcon } from "@egovernments/digit-ui-react-components";
import React, { useRef, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import TableData from "./tableData";

const SearchImg = () => {
    return <SearchIconSvg className="signature-img" />;
};

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
    chartData,
}) => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [chartDenomination, setChartDenomination] = useState(null);
    const isMobile = window.Digit.Utils.browser.isMobile();
    const chart = useRef();

    const menuItems = [
        {
            code: "image",
            i18nKey: t("ES_COMMON_DOWNLOAD_IMAGE"),
            icon: <DownloadIcon />,
        },
        {
            code: "shareImage",
            i18nKey: t("ES_DSS_SHARE_IMAGE"),
            target: "mail",
            icon: <EmailIcon />,
        },
        {
            code: "shareImage",
            i18nKey: t("ES_DSS_SHARE_IMAGE"),
            target: "whatsapp",
            icon: <WhatsappIcon />,
        },
    ];

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
    let headerName = t(Digit.Utils.locale.getTransformedLocale(header));


    return (
        <Card >
            <div className={`chartHeader ${showSearch && "column-direction"}`}>
                <div>
                    {showHeader && (
                        // <CardLabel className={"dss-header-label"}>
                        <span className={`tooltip ${headerName?.length < (isMobile ? 20 : 30) ? "dss-white-pre" : "dss-white-pre-line"}`}
                            style={{ paddingTop: 12, whiteSpace: "nowrap" }}
                        >
                            {headerName}
                        </span>
                        ///* </CardLabel> */}
                    )}
                </div>
                <div className="sideContent">
                    {/* {chip && chip.length > 1 && <Chip items={chip} onClick={updateChip} t={t} />}
                    <span className="table-search-wrapper">
                        {showSearch && (
                            <TextInput type="search" placeholder={t('DSS_SEARCH')} onChange={onChange} />
                        )}
                        {showDownload && <DownloadIcon className="mrlg cursorPointer" onClick={handleExcelDownload} />}
                    </span> */}
                    {/* {!showDownload && <EllipsisMenu menuItems={menuItems} displayKey="i18nKey" onSelect={(data) => download(data)} />} */}
                </div>

            </div>
            <div>
                {subHeader && <p style={{ color: "#505A5F", fontWeight: 700, paddingBottom: "10px" }}>{t(subHeader)}</p>}
            </div>

            {/* Render whatever content is passed as children */}
            <div>{children}</div>

        </Card>
    );
};

export default GenericChart;

