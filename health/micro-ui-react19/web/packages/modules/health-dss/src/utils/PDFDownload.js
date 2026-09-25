import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

const changeClasses = (class1, class2) => {
  var elements = document.getElementsByClassName(class1);
  Array.prototype.map.call(elements, function (testElement) {
    testElement.classList.add(class2);
    testElement.classList.remove(class1);
  });
};

const revertCss = () => changeClasses("dss-white-pre-temp", "dss-white-pre-line");
const applyCss = () => changeClasses("dss-white-pre-line", "dss-white-pre-temp");

const saveAs = (uri, filename) => {
  const link = document.createElement("a");
  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};

const dataURItoBlob = (dataURI) => {
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
};

// Replaces Digit.Download.Image — full page jpeg download
export const ImageDownload = (node, fileName, share, resolve = null) => {
  const element = node.current;
  return domtoimage
    .toJpeg(element, {
      quality: 1,
      bgcolor: "white",
      filter: (n) => !n?.className?.includes?.("divToBeHidden"),
    })
    .then((dataUrl) => {
      if (share) return resolve(new File([dataURItoBlob(dataUrl)], `${fileName}.jpeg`, { type: "image/jpeg" }));
      saveAs(dataUrl, `${fileName}.jpeg`);
    });
};

// Replaces Digit.Download.IndividualChartImage — per-chart jpeg download
export const ChartImageDownload = (node, fileName, share, resolve = null) => {
  applyCss();
  const element = node.current;
  return domtoimage
    .toJpeg(element, { quality: 1, bgcolor: "white" })
    .then((dataUrl) => {
      revertCss();
      if (share) return resolve(new File([dataURItoBlob(dataUrl)], `${fileName}.jpeg`, { type: "image/jpeg" }));
      saveAs(dataUrl, `${fileName}.jpeg`);
    });
};

// Replaces Digit.Download.PDF — full page PDF download
export const PDFDownload = (node, fileName, share, resolve = null) => {
  applyCss();
  const element = node.current;
  return domtoimage
    .toJpeg(element, {
      quality: 1,
      bgcolor: "white",
      filter: (n) => !n?.className?.includes?.("divToBeHidden"),
      style: { margin: "25px" },
    })
    .then((dataUrl) => {
      const pdf = new jsPDF("l", "pt", [element.offsetWidth, element.offsetHeight]);
      pdf.setFontSize?.(16);
      pdf.text?.(40, 30, "Certificate");
      pdf.addImage(dataUrl, "JPEG", 25, 50, element.offsetWidth, element.offsetHeight);
      revertCss();
      if (share) {
        const pdfBlob = pdf.output("blob");
        return resolve(new File([pdfBlob], `${fileName}.pdf`, { type: "application/pdf" }));
      }
      pdf.save(`${fileName}.pdf`);
    });
};

// Share helpers — replicates ShareFiles logic using local DOM capture (no findDOMNode)
const isMobileOrTablet = () => /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);

const targetLink = (target, shortUrl) => {
  switch (target) {
    case "mail":
      return window.open(`mailto:?body=${encodeURIComponent(shortUrl)}`, "_blank");
    case "whatsapp":
      return window.open(
        "https://" + (isMobileOrTablet() ? "api" : "web") + ".whatsapp.com/send?text=" + encodeURIComponent(shortUrl),
        "_blank"
      );
    default:
      return window.open(shortUrl, "_blank");
  }
};

const getShortener = async (tenantId, data) => {
  const fileUploadId = await Digit.UploadServices.Filestorage("DSS", data, tenantId);
  const storeId = fileUploadId.data.files[0].fileStoreId;
  const fileTenantId = fileUploadId.data.files[0].tenantId;
  const fileUrl = await Digit.UploadServices.Filefetch([storeId], fileTenantId);
  return Digit.Utils.getFileUrl(fileUrl.data[storeId]);
};

// Replaces Digit.ShareFiles.PDF
export const SharePDF = async (tenantId, node, filename, target) => {
  const pdfData = await new Promise((resolve) => PDFDownload(node, filename, true, resolve));
  if (!target && navigator.share) return navigator.share({ files: [pdfData], title: filename });
  const shortUrl = await getShortener(tenantId, pdfData);
  return targetLink(target, shortUrl);
};

// Replaces Digit.ShareFiles.Image and Digit.ShareFiles.DownloadImage
export const ShareImage = async (tenantId, node, filename, target) => {
  const imageData = await new Promise((resolve) => PDFDownload(node, filename, true, resolve));
  if (!target && navigator.share) return navigator.share({ files: [imageData], title: filename });
  const shortUrl = await getShortener(tenantId, imageData);
  return targetLink(target, shortUrl);
};

// Replaces Digit.ShareFiles.IndividualChartImage
export const ShareChartImage = async (tenantId, node, filename, target) => {
  const imageData = await new Promise((resolve) => ChartImageDownload(node, filename, true, resolve));
  if (!target && navigator.share) return navigator.share({ files: [imageData], title: filename });
  const shortUrl = await getShortener(tenantId, imageData);
  return targetLink(target, shortUrl);
};
