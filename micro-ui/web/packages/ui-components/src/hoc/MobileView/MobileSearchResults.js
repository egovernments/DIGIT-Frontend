import React, { useMemo, useContext, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { Details } from "../../molecules/DetailsCard";
import { Link } from "react-router-dom";
import NoResultsFound from "../../atoms/NoResultsFound";
import { CustomSVG, Loader } from "../../atoms";
import _ from "lodash";
import { InboxContext } from '../InboxSearchComposerContext';
import Table from "../../atoms/Table";

const MobileSearchResults = ({ config, data, isLoading, isFetching, fullConfig }) => {
    const { apiDetails } = fullConfig
    const { t } = useTranslation();
    const resultsKey = config.resultsJsonPath
    let searchResult = _.get(data, resultsKey, [])
    searchResult = searchResult?.length > 0 ? searchResult : []
    searchResult = searchResult.reverse();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);

    const { dispatch } = useContext(InboxContext)

    // Check if it's mobile view
    const isMobile = window.innerWidth <= 426;

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
        formState: { errors }  // ✅ Correct way to get errors in v7
    } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
        },
    });

    // ✅ Fixed: v7 register doesn't take default value as second argument
    // Default values are already set in useForm, so we just need to register
    useEffect(() => {
        register("offset");
        register("limit");
    }, [register]);

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

    const propsMobileInboxCards = useMemo(() => {
        if (isLoading) {
            return [];
        }
        let cardData = searchResult.map((details) => {
            let mapping = {};
            let additionalCustomization = {};
            let cols = config?.columns;
            for (let columnIndex = 0; columnIndex < cols?.length; columnIndex++) {
                mapping[cols[columnIndex]?.label] = _.get(details, cols[columnIndex]?.jsonPath, null)
                additionalCustomization[cols[columnIndex]?.label] = cols[columnIndex]?.additionalCustomization || false;
            }
            return { mapping, details, additionalCustomization };
        })
        return cardData;
    }, [data, isLoading, searchResult, config?.columns]);

    // Render individual card for mobile
    const renderCard = (row, index) => {
        const cardContent = Object.keys(row.mapping).map(key => {
            let toRender;
            if (row.additionalCustomization[key]) {
                toRender = (
                    <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontWeight: '600',
                            color: '#666',
                            fontSize: '16px',
                            flex: '1'
                        }}>{t(key)}:</span>
                        <span style={{
                            color: '#333',
                            fontSize: '16px',
                            textAlign: 'right',
                            flex: '1',
                            wordBreak: 'break-word'
                        }}>
                            {Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalCustomizations(row.details, key, {}, row.mapping[key], t, searchResult)}
                        </span>
                    </div>
                )
            }
            else {
                toRender = (
                    <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{
                            fontWeight: '600',
                            color: '#666',
                            fontSize: '16px',
                            flex: '1'
                        }}>{t(key)}:</span>
                        <span style={{
                            color: '#333',
                            fontSize: '16px',
                            textAlign: 'right',
                            flex: '1',
                            wordBreak: 'break-word'
                        }}>
                            {row.mapping[key] || t("NA")}
                        </span>
                    </div>
                )
            }
            return toRender
        });

        return (
            <Link 
                key={index}
                to={Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.MobileDetailsOnClick(row.mapping, tenantId)}
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                }}
            >
                <div style={{
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.2s ease',
                }}>
                    {cardContent}
                </div>
            </Link>
        );
    };

    // Pagination component
    const renderPagination = () => {
        const totalRecords = data?.count || data?.TotalCount || data?.totalCount || 0;
        const currentPage = getValues("offset") / getValues("limit");
        const totalPages = Math.ceil(totalRecords / getValues("limit"));
        const startRecord = getValues("offset") + 1;
        const endRecord = Math.min((currentPage + 1) * getValues("limit"), totalRecords);

        return (
            <div style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                marginTop: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: '16px',
                    color: '#666'
                }}>
                    <span>{t("CS_COMMON_ROWS_PER_PAGE")}:</span>
                    <select
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        value={getValues("limit")}
                        onChange={onPageSizeChange}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '16px',
                        color: '#666'
                    }}>
                        {startRecord}-{endRecord} of {totalRecords}
                    </span>
                    
                    <div style={{
                        display: 'flex',
                        gap: '8px'
                    }}>
                        {currentPage === 0 ? (
                            <CustomSVG.ArrowBack
                                className={"cp"}
                                style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}
                            />
                        ) : (
                            <CustomSVG.ArrowBack
                                className={"cp"}
                                onClick={previousPage}
                            />
                        )}
                        {currentPage >= totalPages - 1 ? (
                            <CustomSVG.ArrowForward
                                className={"cp"}
                                style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}
                            />
                        ) : (
                            <CustomSVG.ArrowForward
                                className={"cp"}
                                onClick={nextPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Original table implementation for desktop
    const renderTable = () => {
        const columns = [
            {
                Header: "",
                accessor: "_searchResults",
                id: "_searchResults"
            }
        ]

        const rows = propsMobileInboxCards.map((row) => {
            return {
                _searchResults: <Link to={Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.MobileDetailsOnClick(row.mapping, tenantId)}>
                    <div className="details-container">
                        {Object.keys(row.mapping).map(key => {
                            let toRender;
                            if (row.additionalCustomization[key]) {
                                toRender = (
                                    <Details label={t(key)}
                                        name={Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalCustomizations(row.details, key, {}, row.mapping[key], t, searchResult)}
                                        onClick={() => { }}
                                        row={row.mapping} />)
                            }
                            else {
                                toRender = row.mapping[key] ? (
                                    <Details
                                        label={t(key)}
                                        name={row.mapping[key]}
                                        onClick={() => { }}
                                        row={row.mapping} />
                                ) : (
                                    <Details
                                        label={t(key)}
                                        name={t("NA")}
                                        onClick={() => { }}
                                        row={row.mapping} />)
                            }
                            return toRender
                        })}
                    </div></Link>
            }
        })

        return (
            <Table
                t={t}
                data={rows}
                totalRecords={data?.count || data?.TotalCount || data?.totalCount}
                columns={columns}
                isPaginationRequired={true}
                onPageSizeChange={onPageSizeChange}
                currentPage={getValues("offset") / getValues("limit")}
                onNextPage={nextPage}
                onPrevPage={previousPage}
                canPreviousPage={true}
                canNextPage={true}
                pageSizeLimit={getValues("limit")}
                getCellProps={(cellInfo) => {
                    return {
                        style: { width: "200vw" },
                    };
                }}
                disableSort={config?.enableColumnSort ? false : true}
                autoSort={config?.enableColumnSort ? true : false}
            />
        );
    };

    function RenderResult() {
        if (searchResult?.length === 0) {
            return (<NoResultsFound />);
        }

        if (isLoading || isFetching) return <Loader />
        if (!data) return <></>

        // Show cards for mobile, table for desktop
        if (isMobile) {
            return (
                <div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginBottom: '20px'
                    }}>
                        {propsMobileInboxCards.map((row, index) => renderCard(row, index))}
                    </div>
                    {/* {renderPagination()} */}
                </div>
            )
        } else {
            return renderTable();
        }
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <React.Fragment>
            <RenderResult />
        </React.Fragment>
    );
};

export default MobileSearchResults;