import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { DocumentIcon } from "./DocumentIcon";
import XlsPreview from "./XlsPreview";
import { XlsxFile } from "./icons/XlsxFile";
import { downloadExcelWithCustomName } from "../utils";
import { AlertCard ,Button} from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

function CampaignDocumentsPreview({ documents = [], svgStyles = {}, isUserGenerate = false, cardErrors,showAsButton }) {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [filesArray, setFilesArray] = useState(null);
  const [pdfFiles, setPdfFiles] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    let acc = documents?.map((i) => (i?.id ? i?.id : i?.filestoreId));
    setFilesArray(acc);
  }, [documents]);

  useEffect(() => {
    if (filesArray?.length > 0) {
      Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getCurrentTenantId()).then((res) => {
        setPdfFiles(res?.data);
      });
    }
  }, [filesArray]);

  const handleFileDownload = ({ id, name }) => {
    const fileNameWithoutExtension = name?.split(/\.(xlsx|xls)/)?.[0];
    downloadExcelWithCustomName({ fileStoreId: id, customName: fileNameWithoutExtension });
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {documents?.length > 0 ? (
          documents?.map(
            (document, index) =>
              (document?.id || document?.filestoreId) && (
                <div
                  key={index}
                  style={{ marginRight: "1rem", display: "flex" }}
                >
                  <div
                    onClick={() => setShowPreview(true)}
                    className="campaign-preview"
                  >
                    <div style={{ display: "flex" }}>
                      <XlsxFile />
                    </div>
                    {showAsButton ? (
                      <Button
                        variation={"link"}
                        size={"medium"}
                        label={
                          isUserGenerate
                            ? document?.type
                            : document?.filename
                            ? t(document?.filename)
                            : t("CAMPAIGN_DOCUMENT_TITLE", { INDEX: index + 1 })
                        }
                        title={
                          isUserGenerate
                            ? document?.type
                            : document?.filename
                            ? t(document?.filename)
                            : t("CAMPAIGN_DOCUMENT_TITLE", { INDEX: index + 1 })
                        }
                        onClick={() => {}}
                        className=""
                      />
                    ) : (
                      <p className="campaign-document-title">
                        {isUserGenerate
                          ? document?.type
                          : document?.filename
                          ? t(document?.filename)
                          : t("CAMPAIGN_DOCUMENT_TITLE", { INDEX: index + 1 })}
                      </p>
                    )}
                  </div>
                  {showPreview && (
                    <XlsPreview
                      file={{
                        url:
                          pdfFiles[
                            document?.id ? document?.id : document?.filestoreId
                          ],
                        filename: isUserGenerate
                          ? document?.type
                          : document?.filename,
                      }}
                      onDownload={() =>
                        handleFileDownload({
                          id: document?.id
                            ? document?.id
                            : document?.filestoreId,
                          name: isUserGenerate
                            ? document?.type
                            : document?.filename,
                        })
                      }
                      onBack={() => setShowPreview(false)}
                    />
                  )}
                </div>
              )
          )
        ) : (
          <div className="summary-doc-error" style={{ width: "100%" }}>
            <p>{t(I18N_KEYS.COMPONENTS.ES_CAMPAIGN_NO_DOCUMENTS_AVAILABLE)}</p>
            {cardErrors?.map((i) => (
              <AlertCard
                populators={{
                  name: "infocard",
                }}
                variant="error"
                text={t(i?.error ? i?.error : i?.message)}
                hasAdditionalElements={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignDocumentsPreview;
