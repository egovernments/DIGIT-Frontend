import React, { useMemo, useCallback, useState, useEffect, Fragment,useContext } from 'react'
import { useTranslation } from 'react-i18next';
import Table from '../atoms/Table'
import { TextInput } from '@egovernments/digit-ui-components';
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { InboxContext } from './InboxSearchComposerContext';
import { Loader } from "@egovernments/digit-ui-components";
import NoResultsFound from '../atoms/NoResultsFound';
import { InfoIcon,EditIcon } from "../atoms/svgindex";
import CardLabel from '../atoms/CardLabel';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay]
    );
    return debouncedValue;
}

const ResultsTable = ({ tableContainerClass, config,data,isLoading,isFetching,fullConfig,revalidate,type,activeLink,browserSession,additionalConfig }) => {
    const {apiDetails} = fullConfig
    const { t } = useTranslation();
    const resultsKey = config.resultsJsonPath
    const [showResultsTable,setShowResultsTable] = useState(true)
    const [session,setSession,clearSession] = browserSession || []
    // let searchResult = data?.[resultsKey]?.length>0 ? data?.[resultsKey] : []
    let searchResult = _.get(data,resultsKey,[])
    searchResult = searchResult?.length>0 ? searchResult : []
    searchResult = searchResult.reverse();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);

    //reversing reason -> for some reason if we enable sorting on columns results from the api are reversed and shown, for now -> reversing the results(max size 50 so not a performance issue)
    
    // if (fullConfig?.postProcessResult){
    //     var { isPostProcessFetching,
    //         isPostProcessLoading,
    //         combinedResponse }  =  Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.postProcess(searchResult) 

    //     if(combinedResponse?.length > 0){
    //         searchResult = combinedResponse
    //     } 
    // }
    
 

   

    const {state,dispatch} = useContext(InboxContext)
    //here I am just checking state.searchForm has all empty keys or not(when clicked on clear search)
    useEffect(() => {
        if(apiDetails?.minParametersForSearchForm !== 0 && Object.keys(state.searchForm).length > 0 && !Object.keys(state.searchForm).some(key => state.searchForm[key]!=="") && type==="search" && activeLink?.minParametersForSearchForm !== 0){
            setShowResultsTable(false)
        }
        // else{
        //     setShowResultsTable(true)
        // }
        return ()=>{
            setShowResultsTable(true)
        }
    }, [state])
   
    

    const tableColumns = useMemo(() => {
        //test if accessor can take jsonPath value only and then check sort and global search work properly
        return config?.columns?.map(column => {
            if(column?.svg) {
                // const icon = Digit.ComponentRegistryService.getComponent(column.svg);
                return {
                    Header: t(column?.label) || t("ES_COMMON_NA"),
                    accessor:column.jsonPath,
                    Cell: ({ value, col, row }) => {
                        return <div className='cursorPointer' style={{marginLeft:"1rem"}} onClick={()=>additionalConfig?.resultsTable?.onClickSvg(row)}> <EditIcon /></div>
                    }
                }
            }
            if (column.additionalCustomization){
                return {
                    Header: t(column?.label) || t("ES_COMMON_NA"),
                    accessor:column.jsonPath,
                    headerAlign: column?.headerAlign,
                    disableSortBy:column?.disableSortBy ? column?.disableSortBy :false,
                    Cell: ({ value, col, row }) => {
                        return  Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalCustomizations(row.original,column?.label,column, value,t, searchResult);
                    }
                }
            }
            return {
                Header: t(column?.label) || t("ES_COMMON_NA"),
                accessor: column.jsonPath,
                headerAlign: column?.headerAlign,
                disableSortBy:column?.disableSortBy ? column?.disableSortBy :false,
                Cell: ({ value, col, row }) => {
                    return String(value ? column.translate? t(Digit.Utils.locale.getTransformedLocale(column.prefix?`${column.prefix}${value}`:value)) : value : t("ES_COMMON_NA"));
                }
            }
        })
    }, [config, searchResult])

    const defaultValuesFromSession = config?.customDefaultPagination ? config?.customDefaultPagination : (session?.tableForm ? {...session?.tableForm} : {limit:10,offset:0})
    
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        trigger,
        control,
        formState,
        errors,
        setError,
        clearErrors,
        unregister,
    } = useForm({
        defaultValues: defaultValuesFromSession
    });
    
     //call this fn whenever session gets updated
  const setDefaultValues = () => {
    reset(defaultValuesFromSession)
  }

  //adding this effect because simply setting session to default values is not working
  useEffect(() => {
    setDefaultValues()
  }, [session])

    const isMobile = window.Digit.Utils.browser.isMobile();
    const [searchQuery, onSearch] = useState("");
    const debouncedValue = config?.debouncedValue || 1000;
    const debouncedSearchQuery = useDebounce(searchQuery,debouncedValue);

    const filterValue = useCallback((rows, id, filterValue = "") => {

        return rows.filter((row) => {
            const res = Object.keys(row?.values).find((key) => {
                if (typeof row?.values?.[key] === "object") {
                    return Object.keys(row?.values?.[key]).find((id) => {
                        if (id === "insight") {
                            return String(Math.abs(row?.values?.[key]?.[id]) + "%")
                                .toLowerCase()
                                .startsWith(filterValue?.toLowerCase());
                        }
                        return String(row?.values?.[key]?.[id])?.toLowerCase().includes(filterValue?.toLowerCase());
                    });
                }
                return (
                    String(row?.values?.[key]).toLowerCase()?.includes(filterValue?.toLowerCase()) ||
                    String(t(row?.values?.[key])).toLowerCase()?.includes(filterValue?.toLowerCase())
                );
            });
            return res;
        });
    }, []);
   
    useEffect(() => {
        register("offset",session?.tableForm?.offset ||state.tableForm.offset|| config?.customDefaultPagination?.offset|| 0);
        register("limit",session?.tableForm?.limit ||state.tableForm.limit|| config?.customDefaultPagination?.limit || 10);
    });

    // useEffect(() => {
    //     setValue("offset",state.tableForm.offset)
    //     setValue("limit",state.tableForm.limit)
    //   })

    function onPageSizeChange(e) {
        setValue("limit", Number(e.target.value));
        handleSubmit(onSubmit)();
    }

    function nextPage() {
        setValue("offset", getValues("offset") + getValues("limit"));
        handleSubmit(onSubmit)();
    }
    function previousPage() {
        const offsetValue = getValues("offset") - getValues("limit")
        setValue("offset", offsetValue>0 ? offsetValue : 0);
        handleSubmit(onSubmit)();
    }

    const onSubmit = (data) => {
        //here update the reducer state
        //call a dispatch to update table's part of the state and update offset, limit
        // this will in turn make the api call and give search results and table will be rendered acc to the new data
        
        dispatch({
            type:"tableForm",
            state:{...data}
        })
        
    }

    
    if (isLoading || isFetching ) return  <Loader page={true} variant={"OverlayLoader"} />;
    if(!data) return <></>
    if(!showResultsTable) return <></>
    if (searchResult?.length === 0) return <NoResultsFound/>
    return (
        <div style={{width : "100%"}}>
        <div className='global-search-results-table-wrapper'>
          {config?.enableGlobalSearch && (
            <CardLabel className="global-search-results-table-header">{t(config.searchHeader) || t("CS_FILTER")}</CardLabel>
          )}
          {config?.enableGlobalSearch && (
            <div className="global-search-results-table">
              <TextInput type="search" onChange={(e) => onSearch(e.target.value)}></TextInput>{" "}
            </div>
          )}
        </div>
        {
                config?.showTableInstruction && ( 
                <div className='table-instruction-wrapper'>
                    <InfoIcon /><p className='table-instruction-header'>{t(config?.showTableInstruction)}</p>
                </div> )
            }
            {searchResult?.length > 0 && <Table
                rowClassName={config.rowClassName}
                className={config?.tableClassName ? config?.tableClassName: "table"}
                t={t}
                customTableWrapperClassName={"search-component-table"}
                disableSort={config?.enableColumnSort ? false : true}
                autoSort={config?.enableColumnSort ? true : false}
                globalSearch={config?.enableGlobalSearch ? filterValue : undefined}
                onSearch={config?.enableGlobalSearch ? debouncedSearchQuery : undefined}
                data={searchResult}
                totalRecords={data?.count || data?.TotalCount || data?.totalCount || searchResult?.length}
                columns={tableColumns}
                isPaginationRequired={true}
                onPageSizeChange={onPageSizeChange}
                currentPage={parseInt(getValues("offset") / getValues("limit"))}
                onNextPage={nextPage}
                onPrevPage={previousPage}
                pageSizeLimit={getValues("limit")}
                showCheckBox={config?.showCheckBox ? true : false}
                actionLabel={config?.checkBoxActionLabel}
                tableSelectionHandler={Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.selectionHandler}
                getCellProps={(cellInfo) => {
                    return {
                        style: {
                            padding: "20px 18px",
                            fontSize: "16px",
                            whiteSpace: "normal",
                        },
                    };
                }}
                onClickRow={additionalConfig?.resultsTable?.onClickRow}
                manualPagination={config.manualPagination}
                noColumnBorder={config?.noColumnBorder}
            />}
        </div>
    )
}

export default ResultsTable