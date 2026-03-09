import { Card, TextInput, Button, HeaderComponent, TooltipWrapper, SVG } from "@egovernments/digit-ui-components";
import React, { useRef, Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";

// React 19 removed ReactDOM.findDOMNode, so Digit.Download.Image/PDF break.
// All helpers use chart.current (already a DOM element) directly via html2canvas.

const captureAsCanvas = (element) =>
  html2canvas(element, {
    scrollY: -window.scrollY,
    scrollX: 0,
    useCORS: true,
    scale: 1.5,
  });

const saveLink = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Builds a minimal valid PDF file containing a single JPEG image (no external dependencies)
const buildPdfFromCanvas = (canvas) => {
  const imgData = canvas.toDataURL("image/jpeg", 1);
  const imgBytes = atob(imgData.split(",")[1]);
  const imgW = canvas.width;
  const imgH = canvas.height;
  const imgLen = imgBytes.length;

  const objs = [];
  objs.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  objs.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  objs.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${imgW} ${imgH}] /Contents 5 0 R /Resources << /XObject << /Img 4 0 R >> >> >>\nendobj`);
  objs.push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLen} >>\nstream\n`);
  const contentStream = `q ${imgW} 0 0 ${imgH} 0 0 cm /Img Do Q`;
  objs.push(`5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj`);

  const header = "%PDF-1.4\n";
  const parts = [header];
  const offsets = [];

  for (let i = 0; i < 3; i++) {
    offsets.push(parts.reduce((s, p) => s + (typeof p === "string" ? p.length : p.byteLength), 0));
    parts.push(objs[i] + "\n");
  }

  offsets.push(parts.reduce((s, p) => s + (typeof p === "string" ? p.length : p.byteLength), 0));
  parts.push(objs[3]);
  const imgBinary = new Uint8Array(imgLen);
  for (let i = 0; i < imgLen; i++) imgBinary[i] = imgBytes.charCodeAt(i);
  parts.push(imgBinary);
  parts.push("\nendstream\nendobj\n");

  offsets.push(parts.reduce((s, p) => s + (typeof p === "string" ? p.length : p.byteLength), 0));
  parts.push(objs[4] + "\n");

  const xrefOffset = parts.reduce((s, p) => s + (typeof p === "string" ? p.length : p.byteLength), 0);
  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (const off of offsets) xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  parts.push(xref);
  parts.push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const encoder = new TextEncoder();
  const encoded = parts.map((p) => (typeof p === "string" ? encoder.encode(p) : p));
  const totalLen = encoded.reduce((s, a) => s + a.byteLength, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const chunk of encoded) { result.set(chunk, pos); pos += chunk.byteLength; }
  return new Blob([result], { type: "application/pdf" });
};

const downloadChartAsImage = (element, fileName) => {
  if (!element) return;
  captureAsCanvas(element).then((canvas) => {
    saveLink(canvas.toDataURL("image/jpeg", 1), `${fileName}.jpeg`);
  });
};

const downloadChartAsPdf = (element, fileName) => {
  if (!element) return;
  captureAsCanvas(element).then((canvas) => {
    saveLink(URL.createObjectURL(buildPdfFromCanvas(canvas)), `${fileName}.pdf`);
  });
};

const shareFile = (blob, fileName, mimeType, target) => {
  const file = new File([blob], fileName, { type: mimeType });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    navigator.share({ files: [file], title: fileName }).catch(() => {});
  } else if (target === "mail") {
    const url = URL.createObjectURL(blob);
    window.open(`mailto:?subject=${encodeURIComponent(fileName)}&body=${encodeURIComponent(url)}`);
  } else if (target === "whatsapp") {
    const url = URL.createObjectURL(blob);
    window.open(`https://wa.me/?text=${encodeURIComponent(fileName + " " + url)}`);
  }
};

const shareChartAsImage = (element, fileName, target) => {
  if (!element) return;
  captureAsCanvas(element).then((canvas) => {
    canvas.toBlob((blob) => shareFile(blob, `${fileName}.jpeg`, "image/jpeg", target), "image/jpeg", 1);
  });
};

const shareChartAsPdf = (element, fileName, target) => {
  if (!element) return;
  captureAsCanvas(element).then((canvas) => {
    shareFile(buildPdfFromCanvas(canvas), `${fileName}.pdf`, "application/pdf", target);
  });
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
}) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [chartDenomination, setChartDenomination] = useState(null);
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const chart = useRef();
  const downloadInProgress = useRef(false);
  const menuItems = [
    {
      code: "image",
      i18nKey: t("ES_COMMON_DOWNLOAD_IMAGE"),
      icon: "FileDownload",
    },
    {
      code: "pdf",
      i18nKey: t("ES_COMMON_DOWNLOAD_PDF"),
      icon: "FileDownload",
    },
    {
      code: "sharePdf",
      i18nKey: t("ES_DSS_SHARE_PDF"),
      target: "mail",
      icon: "Email",
    },
    {
      code: "sharePdf",
      i18nKey: t("ES_DSS_SHARE_PDF"),
      target: "whatsapp",
      icon: "Whatsapp",
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
    if (downloadInProgress.current) return;
    downloadInProgress.current = true;

    let chartIdToDownload = children?.props?.data?.id || children?.props?.chartId || null;
    if (setDownloadChartsId !== null) {
      setDownloadChartsId(chartIdToDownload);
    }

    setTimeout(() => {
      const element = chart.current;
      const fileName = t(header);
      switch (data.code) {
        case "pdf":
          downloadChartAsPdf(element, fileName);
          break;
        case "image":
          downloadChartAsImage(element, fileName);
          break;
        case "sharePdf":
          shareChartAsPdf(element, fileName, data.target);
          break;
        case "shareImage":
          shareChartAsImage(element, fileName, data.target);
          break;
        default:
          break;
      }
    }, 1000);
    setTimeout(() => {
      if (setDownloadChartsId !== null) {
        setDownloadChartsId(null);
      }
      downloadInProgress.current = false;
    }, 3000);
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
                  <TextInput className={"digit-generic-chart-search-field commodity-management"} placeholder={t("DSS_SEARCH")} onChange={onChange} type={"search"} />
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
