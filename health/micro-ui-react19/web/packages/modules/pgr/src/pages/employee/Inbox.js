import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const Inbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { uuid } = Digit.UserService.getUser().info;

  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchParams, setSearchParams] = useState({
    filters: { wfFilters: { assignee: [{ code: uuid }] } },
    search: {},
    sort: {},
  });

  const { data: complaints, isLoading } = Digit.Hooks.pgr.useInboxData({
    ...searchParams,
    offset: pageOffset,
    limit: pageSize,
  });

  const fetchNextPage = () => setPageOffset((prev) => prev + 10);
  const fetchPrevPage = () => setPageOffset((prev) => prev - 10);
  const handlePageSizeChange = (e) => setPageSize(Number(e.target.value));
  const handleFilterChange = useCallback((filterParam) => setSearchParams((prev) => ({ ...prev, filters: filterParam })), []);
  const onSearch = useCallback((params = "") => setSearchParams((prev) => ({ ...prev, search: params })), []);

  const isMobile = Digit.Utils.browser.isMobile();

  if (isLoading) return <Loader />;

  if (isMobile) {
    return (
      <MobileInbox
        data={complaints}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
        onSearch={onSearch}
        searchParams={searchParams}
      />
    );
  }

  return (
    <div>
      <Header>{t("ES_COMMON_INBOX")}</Header>
      <DesktopInbox
        data={complaints}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
        onSearch={onSearch}
        searchParams={searchParams}
        onNextPage={fetchNextPage}
        onPrevPage={fetchPrevPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={Math.floor(pageOffset / pageSize)}
        totalRecords={totalRecords}
        pageSizeLimit={pageSize}
      />
    </div>
  );
};

export default Inbox;
