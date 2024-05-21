import { Card, Loader } from "@digit-ui/digit-ui-react-components";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationTable from "./ApplicationTable";
import InboxLinks from "./InboxLink";
import SearchApplication from "./search";
import { Link } from "react-router-dom";

const DesktopInbox = ({tableConfig,resultOk, filterComponent,columns, isLoading, setSearchFieldsBackToOriginalState, setSetSearchFieldsBackToOriginalState, ...props }) => {
  const { data } = props;
  const { t } = useTranslation();
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));
  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const inboxColumns = useMemo( 
    () => [
      {
        Header: t("WORKS_BILL_ID"),
        disableSortBy: true,
        accessor: "connectionNo",
        Cell: ({ row }) =>{
          return( 
            <div>
              {row.original?.billId ? (
                <span className={"link"}>
                  <Link
                    to={`view-bills/bills?tenantId=${row.original?.tenantId}&billId=${row.original?.billId}`}>
                    {row.original?.billId || "NA"}
                  </Link>
                </span> 
              ) : (
                <span>{t("NA")}</span>
              )}
            </div>)}
      },
      {
        Header: t("WORKS_BILL_DATE"), 
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"100px"}}>
              {row.original?.billDate ? (
                <span >
                    {row.original?.billDate || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_BILL_TYPE"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"90px"}}>
              {row.original?.billType ? (
                <span >
                    {row.original?.billType || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_DEPARTMENT"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"110px"}}>
              {row.original?.department ? (
                <span >
                    {row.original?.department || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_CONTRACTOR_NAME"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"150px"}}>
              {row.original?.contractorName ? (
                <span >
                    {row.original?.contractorName || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },        
      {
        Header: t("WORKS_IDENTIFICATION_NO"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"220px"}}>
              {row.original?.workIdentificationNumber ? (
                <span >
                    {row.original?.workIdentificationNumber || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_FUND"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"110px"}}>
              {row.original?.fund ? (
                <span >
                    {row.original?.fund || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_FUNCTION"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"110px"}}>
              {row.original?.function ? (
                <span >
                    {row.original?.function || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}     
      },
      {
        Header: t("WORKS_BUDGET_HEAD"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"210px"}}>
              {row.original?.budgetHead ? (
                <span >
                    {row.original?.budgetHead || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}
      },
      {
        Header: t("WORKS_CREATED_BY"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"80px"}}>
              {row.original?.createdBy ? (
                <span >
                    {row.original?.createdBy || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_OWNER"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"80px"}}>
              {row.original?.owner ? (
                <span >
                    {row.original?.owner || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}      
      },
      {
        Header: t("WORKS_STATUS"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"80px"}}>
              {row.original?.status ? (
                <span >
                    {row.original?.status || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}
      },
      {
        Header: t("WORKS_TOTAL_AMOUNT"),
        disableSortBy: true,
        Cell: ({ row }) =>{
          return( 
            <div style={{"minWidth":"110px"}}>
              {row.original?.totalAmount ? (
                <span >
                    {row.original?.totalAmount || t("ES_COMMON_NA")}
                </span> 
              ) : (
                <span>{t("ES_COMMON_NA")}</span>
              )}
            </div>)}
      }
  ],[])
  let result;
  if (isLoading) {
    result = <Loader />;
  } else if (data?.display && !resultOk) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {t(data?.display)
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (resultOk) {
  result= (
    <ApplicationTable
      t={t}
      data={data}
      columns={inboxColumns}
      getCellProps={(cellInfo) => {
        return {
          style: {
            minWidth: cellInfo.column.Header === t("WORKS_CONTRACT_ID") ? "120px" : "",
            padding: "20px 18px",
            fontSize: "16px",
          },
        };
      }}
      onPageSizeChange={props.onPageSizeChange}
      currentPage={props.currentPage}
      onNextPage={props.onNextPage}
      onPrevPage={props.onPrevPage}
      pageSizeLimit={props.pageSizeLimit}
      onSort={props.onSort}
      disableSort={props.disableSort}
      sortParams={props.sortParams}
      totalRecords={props.totalRecords}
    />
  )
  }else
  {
    result=null
  }

return (
    <div className="inbox-container">
      {!props.isSearch && (
        <div className="filters-container">
        <InboxLinks />
          <div>
            <FilterComponent
              defaultSearchParams={props.defaultSearchParams}
              statuses={data?.statuses}
              onFilterChange={props.onFilterChange}
              searchParams={props.searchParams}
              type="desktop"
            />
          </div>
        </div>
       )}
      <div style={{ flex: 1, overflowY:"hidden" }}>
        <div id="search-form" className="rm-mb form-field-flex-one">
      <SearchApplication
          defaultSearchParams={props.defaultSearchParams}
          onSearch={props.onSearch}
          type="desktop"
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
          {...{setSearchFieldsBackToOriginalState, setSetSearchFieldsBackToOriginalState}}
        />
        </div>
        <div className="result" style={{ marginLeft: "24px", flex: 1 }}>
        {/* <div style={{ marginLeft: !props?.isSearch ? "24px" : "",flex: 1}}> */}
          {result}
        </div>
      </div>
    </div>
  );
};

export default DesktopInbox;