import ReactDOM from "react-dom";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

const changeClasses = (class1, class2) => {
    var elements = document.getElementsByClassName(class1)
    Array.prototype.map.call(elements, function (testElement) {
        testElement.classList.add(class2);
        testElement.classList.remove(class1);
    });
}

const revertCss = () => {
    changeClasses("dss-white-pre-temp", 'dss-white-pre-line');
}

const applyCss = () => {
    changeClasses('dss-white-pre-line', "dss-white-pre-temp");
}

export const PDFDownload = (node, fileName, share, resolve = null) => {
    changeClasses("dss-white-pre-line", "dss-white-pre-temp");
    applyCss();

    const element = ReactDOM.findDOMNode(node.current);

    return domtoimage
        .toJpeg(element, {
            quality: 1,
            bgcolor: "white",
            filter: (node) => !node?.className?.includes?.("divToBeHidden"),
            style: { margin: "25px" },
        })
        .then((dataUrl) => {
            // create PDF
            const pdf = new jsPDF("l", "pt", [element.offsetWidth, element.offsetHeight]);
            pdf.setFontSize?.(16);
            pdf.text?.(40, 30, "Certificate");
            pdf.addImage(dataUrl, "JPEG", 25, 50, element.offsetWidth, element.offsetHeight);

            changeClasses("dss-white-pre-temp", "dss-white-pre-line");
            revertCss();

            if (share) {
                // return PDF as File
                const pdfBlob = pdf.output("blob");
                return resolve(new File([pdfBlob], `${fileName}.pdf`, { type: "application/pdf" }));
            } else {
                // trigger download
                pdf.save(`${fileName}.pdf`);
            }
        });
};