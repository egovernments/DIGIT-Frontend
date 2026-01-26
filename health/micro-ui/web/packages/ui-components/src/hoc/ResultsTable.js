import React, { useMemo, useCallback, useState, useEffect, Fragment, useContext } from 'react'
import { useTranslation } from 'react-i18next';
import Table from '../atoms/Table'
import TextInput from '../atoms/TextInput'
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { InboxContext } from './InboxSearchComposerContext';
import { Loader } from '../atoms';
import NoResultsFound from '../atoms/NoResultsFound';
import { CustomSVG } from '../atoms';


const ResultsTable = ({ tableContainerClass, config, data, isLoading, isFetching, fullConfig, revalidate, type, activeLink, browserSession, additionalConfig }) => {
    const { apiDetails } = fullConfig
    const { t } = useTranslation();
    const resultsKey = config.resultsJsonPath
    const [showResultsTable, setShowResultsTable] = useState(true)
    const [session, setSession, clearSession] = browserSession || []
    let searchResult = _.get(data, resultsKey, [])
    searchResult = searchResult?.length > 0 ? searchResult : []
    searchResult = searchResult.reverse();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);

    const { state, dispatch } = useContext(InboxContext)
    
    useEffect(() => {
        if (apiDetails?.minParametersForSearchForm !== 0 && Object.keys(state.searchForm).length > 0 && !Object.keys(state.searchForm).some(key => state.searchForm[key] !== "") && type === "search" && activeLink?.minParametersForSearchForm !== 0) {
            setShowResultsTable(false)
        }
        return () => {
            setShowResultsTable(true)
        }
    }, [state])

    const tableColumns = useMemo(() => {
        return config?.columns?.map(column => {
            if (column?.svg) {
                return {
                    Header: t(column?.label) || t("ES_COMMON_NA"),
                    accessor: column.jsonPath,
                    Cell: ({ value, col, row }) => {
                        return <div className='cursorPointer' style={{ marginLeft: "1rem" }} onClick={() => additionalConfig?.resultsTable?.onClickSvg(row)}> <CustomSVG.EditIcon /></div>
                    }
                }
            }
            if (column.additionalCustomization) {
                return {
                    Header: t(column?.label) || t("ES_COMMON_NA"),
                    accessor: column.jsonPath,
                    headerAlign: column?.headerAlign,
                    disableSortBy: column?.disableSortBy ? column?.disableSortBy : false,
                    Cell: ({ value, col, row }) => {
                        return Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalCustomizations(row.original, column?.label, column, value, t, searchResult);
                    }
                }
            }
            return {
                Header: t(column?.label) || t("ES_COMMON_NA"),
                accessor: column.jsonPath,
                headerAlign: column?.headerAlign,
                disableSortBy: column?.disableSortBy ? column?.disableSortBy : false,
                Cell: ({ value, col, row }) => {
                    return String(value ? column.translate ? t(Digit.Utils.locale.getTransformedLocale(column.prefix ? `${column.prefix}${value}` : value)) : value : t("ES_COMMON_NA"));
                }
            }
        })
    }, [config, searchResult])

    const defaultValuesFromSession = config?.customDefaultPagination ? config?.customDefaultPagination : (session?.tableForm ? { ...session?.tableForm } : { limit: 10, offset: 0 })

    // ✅ Fixed: v7 syntax - errors comes from formState
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        trigger,
        control,
        setError,
        clearErrors,
        unregister,
        formState: { errors }  // ✅ Correct way in v7
    } = useForm({
        defaultValues: defaultValuesFromSession
    });

    const setDefaultValues = () => {
        reset(defaultValuesFromSession)
    }

    useEffect(() => {
        setDefaultValues()
    }, [session])

    const isMobile = window.Digit.Utils.browser.isMobile();
    const [searchQuery, onSearch] = useState("");

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

    // ✅ Fixed: v7 register syntax - don't pass default value as second argument
    // Also added proper dependency array
    useEffect(() => {
        register("offset");
        register("limit");
    }, [register]);

    // ✅ Set values from session/state after registration
    useEffect(() => {
        const offsetValue = session?.tableForm?.offset ?? state.tableForm?.offset ?? config?.customDefaultPagination?.offset ?? 0;
        const limitValue = session?.tableForm?.limit ?? state.tableForm?.limit ?? config?.customDefaultPagination?.limit ?? 10;
        setValue("offset", offsetValue);
        setValue("limit", limitValue);
    }, [session, state.tableForm, config?.customDefaultPagination, setValue]);

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
        setValue("offset", offsetValue > 0 ? offsetValue : 0);
        handleSubmit(onSubmit)();
    }

    const onSubmit = (data) => {
        dispatch({
            type: "tableForm",
            state: { ...data }
        })
    }

    if (isLoading || isFetching) return <Loader />
    if (!data) return <></>
    if (!showResultsTable) return <></>
    if (searchResult?.length === 0) return <NoResultsFound />
    
    return (
        <div style={{ width: "100%" }}>
            {config?.enableGlobalSearch && <div className='card' style={{ "padding": "0px", marginTop: "1rem" }}>
                <TextInput className="searchInput" onChange={(e) => onSearch(e.target.value)} style={{ border: "none", borderRadius: "200px" }} />
            </div>}
            {
                config?.showTableInstruction && (
                    <div className='table-instruction-wrapper'>
                        <CustomSVG.InfoIcon /><p className='table-instruction-header'>{t(config?.showTableInstruction)}</p>
                    </div>)
            }
            {searchResult?.length > 0 && <Table
                rowClassName={config.rowClassName}
                className={config?.tableClassName ? config?.tableClassName : "table"}
                t={t}
                customTableWrapperClassName={"search-component-table"}
                disableSort={config?.enableColumnSort ? false : true}
                autoSort={config?.enableColumnSort ? true : false}
                globalSearch={config?.enableGlobalSearch ? filterValue : undefined}
                onSearch={config?.enableGlobalSearch ? searchQuery : undefined}
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