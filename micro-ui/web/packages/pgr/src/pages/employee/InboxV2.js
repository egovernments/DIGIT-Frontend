import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";
import { configs } from "./config";

const InboxV2 = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { uuid } = Digit.UserService.getUser().info;
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [config, setConfig] = useState(configs);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchParams, setSearchParams] = useState({ filters: { wfFilters: { assignee: [{ code: uuid }] } }, search: "", sort: {} });

  useEffect(() => {
    (async () => {
      const applicationStatus = searchParams?.filters?.pgrfilters?.applicationStatus?.map((e) => e.code).join(",");
      let response = await Digit.PGRService.count(tenantId, applicationStatus?.length > 0 ? { applicationStatus } : {});
      if (response?.count) {
        setTotalRecords(response.count);
      }
    })();
  }, [searchParams]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + 10);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - 10);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleFilterChange = (filterParam) => {
    setSearchParams({ ...searchParams, filters: filterParam });
  };

  const onSearch = (params = "") => {
    setSearchParams({ ...searchParams, search: params });
  };

  // let complaints = Digit.Hooks.pgr.useInboxData(searchParams) || [];
  // let { data: complaints, isLoading } = Digit.Hooks.pgr.useInboxData({ ...searchParams, offset: pageOffset, limit: pageSize });

  let isMobile = Digit.Utils.browser.isMobile();

  // if (complaints?.length !== null) {
  //   return (
  //     <div>
  //       <Header>{t("ES_COMMON_INBOX")}</Header>
  //       <DesktopInbox
  //         data={complaints}
  //         isLoading={isLoading}
  //         onFilterChange={handleFilterChange}
  //         onSearch={onSearch}
  //         searchParams={searchParams}
  //         onNextPage={fetchNextPage}
  //         onPrevPage={fetchPrevPage}
  //         onPageSizeChange={handlePageSizeChange}
  //         currentPage={Math.floor(pageOffset / pageSize)}
  //         totalRecords={totalRecords}
  //         pageSizeLimit={pageSize}
  //       />
  //     </div>
  //   );
  // }
  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t(config?.label)}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={config} />
      </div>
    </React.Fragment>
  );
};

export default InboxV2;
