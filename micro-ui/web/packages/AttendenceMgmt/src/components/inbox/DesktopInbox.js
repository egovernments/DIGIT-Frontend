import React, {useMemo} from 'react'
import InboxLinks from './InboxLinks'
import { useTranslation } from "react-i18next";
import { Table, Loader, Card } from "@egovernments/digit-ui-react-components";
import { inboxTableColumns } from '../../config/inboxTableColumns';

const DesktopInbox = (props) => {
  const {isFilter, isSearch, parentRoute, filterComponent, searchComponent, data, onFilterChange, onSearch, searchParams, defaultSearchParams,
  onSort, onNextPage, onPrevPage, currentPage, pageSizeLimit, onPageSizeChange, totalRecords, sortParams, isLoading, tenantId} = props
  const { t } = useTranslation();
  const AttendenceInboxFilter = Digit.ComponentRegistryService.getComponent(filterComponent);
  const AttendenceInboxSearch = Digit.ComponentRegistryService.getComponent(searchComponent);

  const inboxColumns = useMemo(() => inboxTableColumns(tenantId, t("ATM_MUSTER_ROLL_ID"), t("WORKS_NAME_OF_WORK"), t("ATM_ATTENDANCE_WEEK"), t("ATM_IA_AP"), t("ATM_NO_OF_INDIVIDUALS"), t("ATM_SLA")),[])
  
  let result;
  if(isLoading) {
    result = <Loader />;
  } else if(data?.noDataFound || data?.length === 0) {
    result = (
      <Card>
        {t(data?.noDataFound)
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } 
  else if(data?.length > 0) {
    //TODO: Set Manual pagination true after api call integration 
    result= (
      <Table
        t={t}
        data={data}
        columns={inboxColumns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
        manualPagination={false}
        onPageSizeChange={onPageSizeChange}
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        pageSizeLimit={pageSizeLimit}
        totalRecords={totalRecords}
        onSort={onSort}
        disableSort={false}
        sortParams={sortParams}
      />
    ); 
  }
  else {
    result=null
  }

  return (
    <div className="inbox-container">
      { isFilter && (
        <div className="filters-container">
          <InboxLinks />
          <AttendenceInboxFilter
            type="desktop"
            onFilterChange={onFilterChange}
          />
        </div>
      )}
      <div style={{ flex: 1 }}>
        { isSearch && (
            <AttendenceInboxSearch
              type="desktop"
              isInboxPage={true}
              onSearch={onSearch}
            />
        )}
        <div style={{ marginLeft: isFilter ? "24px" : ""}}>
          {result}
        </div>
      </div>
    </div>
  )
}

export default DesktopInbox