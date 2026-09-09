import React, { useState } from "react";
import { InboxSearchComposer, HeaderComponent } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import inboxSearchConfig from "../../components/config/inboxSearchConfig";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const InboxSearch = () => {
  const { t } = useTranslation();

  const isMobile = window.Digit.Utils.browser.isMobile();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [pageConfig] = useState(() => inboxSearchConfig(tenantId));

  return (
    <div style={{ marginBottom: "80px" }}>
      <div
        style={
          isMobile
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
          {t(I18N_KEYS.PAGES_INBOX.HR_HOME_SEARCH_RESULTS_HEADING)}
        </HeaderComponent>
      </div>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={pageConfig} />
      </div>
    </div>
  );
};

export default InboxSearch;
