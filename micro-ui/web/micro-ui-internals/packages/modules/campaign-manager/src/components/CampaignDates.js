import React, { useState, useMemo, useRef } from "react";
import { UploadIcon, FileIcon, DeleteIconv2, Toast , Card , Header } from "@egovernments/digit-ui-react-components";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import { ActionBar, Button, DownloadIcon } from "@egovernments/digit-ui-react-components";
import { DateRangeNew } from "@egovernments/digit-ui-react-components";
import { DateWrap } from "@egovernments/digit-ui-react-components";
import { DatePicker } from "@egovernments/digit-ui-react-components";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";

const CampaignDates = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
        <Header>{t(`HCM_CAMPAIGN_DATES_HEADER`)}</Header>
        <p>{t(`HCM_CAMPAIGN_DATES_DESCRIPTION`)}</p>
        <LabelFieldPair>
            <p>{t(`HCM_CAMPAIGN_DATE`)}</p>
            <DatePicker 
            defaultValue={"startDate"}
        />
            <DatePicker
            defaultValue={"endDate"} 
            />
      
        </LabelFieldPair>
    </React.Fragment>
  );
};

export default CampaignDates;
