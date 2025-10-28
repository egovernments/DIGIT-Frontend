import { Card, Header, Label, UploadFile } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const SUPPORTED_FILE_FORMATS = [
  ".pdf",
  ".bmp",
  ".xlsx",
  ".csv",
  ".doc",
  ".docx",
  ".gif",
  ".htm",
  ".html",
  ".jpg",
  ".jpeg",
  ".png",
  ".ppt",
  ".pptx",
  ".tiff",
  ".txt",
  ".xls",
];

const DocViewerWrapper = (props) => {
  const { fileUrl, fileName = "Unknown File" } = Digit.Hooks.useQueryParams();

  const [selectedDocs, setSelectedDocs] = useState([]);
  const documents = fileUrl
    ? [{ uri: fileUrl, fileName }]
    : selectedDocs.map((file) => ({
        uri: window.URL.createObjectURL(file),
        fileName: file?.name || fileName,
      }));

  return (
    <Card>
      <Header>File Viewer</Header>
      {!fileUrl && (
        <UploadFile
          accept={SUPPORTED_FILE_FORMATS.join(",")}
          multiple
          uploadedFiles={selectedDocs}
          enableButton={true}
          removeTargetedFile={(file) => setSelectedDocs([])}
          // removeTargetedFile={(file) => setSelectedDocs(selectedDocs.filter((el) => el !== file))}
          showHintBelow={true}
          hintText={`Supported File Formats : ${SUPPORTED_FILE_FORMATS.join(", ")} `}
          onUpload={(el) => el.target.files?.length && setSelectedDocs(Array.from(el.target.files))}
        />
      )}
      {documents?.length != 0 && (
        <>
          {" "}
          <Label>Uploaded File</Label>
          <DocViewer
            theme={{
              primary: "#c84c0e",
              secondary: "#feefe7",
              tertiary: "#feefe7",
              textPrimary: "#0B0C0C",
              textSecondary: "#505A5F",
              textTertiary: "#00000099",
              disableThemeScrollbar: false,
            }}
            documents={documents}
            pluginRenderers={DocViewerRenderers}
          />{" "}
        </>
      )}
    </Card>
  );
};

export default DocViewerWrapper;

// const docs = [
//     { uri: "https://url-to-my-pdf.pdf" }, // Remote file
//     { uri: require("./example-files/pdf.pdf") }, // Local File
//   ];

//   return (
//     <DocViewer
//       documents={docs}
//       initialActiveDocument={docs[1]}
//       pluginRenderers={DocViewerRenderers}
//     />
//   );

// theme={{
//     primary: "#5296d8",
//     secondary: "#ffffff",
//     tertiary: "#5296d899",
//     textPrimary: "#ffffff",
//     textSecondary: "#5296d8",
//     textTertiary: "#00000099",
//     disableThemeScrollbar: false,
//   }}

// Custom Request Headers
// Provide request headers, i.e. for authenticating with an API etc.

// const headers = {
//   "X-Access-Token": "1234567890",
//   "My-Custom-Header": "my-custom-value",
// };

// <DocViewer documents={docs} prefetchMethod="GET" requestHeaders={headers} />;

// Internationalization (i18n)
// From v1.6.0 you can pass the language prop to the DocViewer component to get translated sentences and words that can be displayed by this library.

// <DocViewer documents={docs} language="pl" />

// Styling
// Any styling applied to the <DocViewer> component, is directly applied to the main div container.

// CSS Class
// <DocViewer documents={docs} className="my-doc-viewer-style" />
// CSS Class Default Override
// Each component / div already has a DOM id that can be used to style any part of the document viewer.

// #react-doc-viewer #header-bar {
//   background-color: #faf;
// }
// React Inline
// <DocViewer documents={docs} style={{ width: 500, height: 500 }} />

// refer more here
// https://www.npmjs.com/package/@cyntler/react-doc-viewer/v/1.10.3#config

// bmp	image/bmp
// csv	text/csv
// doc	application/msword
// docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document
// gif	image/gif
// htm	text/htm
// html	text/html
// jpg	image/jpg
// jpeg	image/jpeg
// pdf	application/pdf
// png	image/png
// ppt	application/vnd.ms-powerpoint
// pptx	applicatiapplication/vnd.openxmlformats-officedocument.presentationml.presentation
// tiff	image/tiff
// txt	text/plain
// xls	application/vnd.ms-excel
// xlsx
