import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { SearchConfig } from "../../configs/employee/SearchConfig";
import { useQueryClient } from "react-query";

const Search = ({ initialActiveIndex = 0 }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [config, setConfig] = useState(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(null);
    const [isConfigReady, setIsConfigReady] = useState(false);
    const [clearSearchTrigger, setClearSearchTrigger] = useState(0);
    const [shouldBlockSearch, setShouldBlockSearch] = useState(false);
    const [showComponent, setShowComponent] = useState(true);
    const previousFormState = useRef(null);
    const isClearing = useRef(false);
    const [tabData, setTabData] = useState(
        SearchConfig?.SearchConfig?.map((configItem, index) => ({
            key: index,
            label: configItem.label,
            active: index === initialActiveIndex,
        }))
    );

    useEffect(() => {
        const savedIndex = initialActiveIndex;
        const configList = SearchConfig?.SearchConfig || [];
        setSelectedTabIndex(savedIndex);
        setConfig(configList[savedIndex]);
        setTabData(
            configList.map((item, idx) => ({
                key: idx,
                label: item.label,
                active: idx === initialActiveIndex,
            }))
        );
        setIsConfigReady(true);
    }, [initialActiveIndex]);

    // Callback to monitor form value changes
    const onFormValueChange = (formState) => {
        // Prevent infinite loop - skip if we're already clearing
        if (isClearing.current) {
            return;
        }

        // Check if all search form fields are empty (indicating clear search was clicked)
        const searchForm = formState?.searchForm || {};
        const allFieldsEmpty = Object.keys(searchForm).every(key => {
            const value = searchForm[key];
            return !value || value === "" || (Array.isArray(value) && value.length === 0);
        });

        // Check if previous state had values
        const previousHadValues = previousFormState.current && Object.keys(previousFormState.current).some(key => {
            const value = previousFormState.current[key];
            return value && value !== "" && !(Array.isArray(value) && value.length === 0);
        });

        // If we had data before and now all fields are empty, user clicked clear search
        if (previousHadValues && allFieldsEmpty && Object.keys(searchForm).length > 0) {
            // Set flag to prevent re-entry
            isClearing.current = true;

            // Clear the query cache and force remount
            queryClient.clear();
            setClearSearchTrigger(prev => prev + 1);

            // Reset flag after a delay
            setTimeout(() => {
                isClearing.current = false;
            }, 500);
        }

        previousFormState.current = searchForm;
    };

    const onTabChange = (n) => {
        // Reset refs to prevent stale state
        previousFormState.current = null;
        isClearing.current = false;

        // Clear session storage to remove cached data
        Digit.SessionStorage.set("TL_SEARCH_SCREEN_SELECTED_TAB_INDEX", n);
        Digit.SessionStorage.set("TL_SEARCH_FORM_DATA", null);
        Digit.SessionStorage.set("TL_FILTER_FORM_DATA", null);
        Digit.SessionStorage.set("MOBILE_SEARCH_MODAL_FORM", null);

        // Clear all React Query cache to remove API cached results
        queryClient.clear();

        // Block search from executing
        setShouldBlockSearch(true);

        // Update tab state immediately
        setSelectedTabIndex(n);
        setTabData((prev) => prev?.map((i, c) => ({ ...i, active: c === n })));

        // Force complete unmount - remove component from DOM
        setShowComponent(false);
        setConfig(null);
        setIsConfigReady(false);

        // Increment trigger to force key change and complete remount
        setClearSearchTrigger(prev => prev + 1);

        // Use setTimeout to ensure component is completely removed then remounted
        setTimeout(() => {
            setConfig(SearchConfig?.SearchConfig?.[n]);
            setIsConfigReady(true);
            setShowComponent(true);
            // Unblock search after component has mounted
            setTimeout(() => setShouldBlockSearch(false), 100);
        }, 50);
    };

    // Create a modified config that blocks API calls when needed
    const modifiedConfig = useMemo(() => {
        if (!config) return null;

        if (shouldBlockSearch) {
            // Return config with API disabled
            return {
                ...config,
                apiDetails: {
                    ...config.apiDetails,
                    // This will prevent the API call
                    serviceName: "",
                }
            };
        }

        return config;
    }, [config, shouldBlockSearch]);

    if (!isConfigReady || !config) {
        return <Loader page={true} variant={"PageLoader"} />;
    }

    return (
        <React.Fragment>
            <div className="digit-inbox-search-wrapper">
                {showComponent && (
                    <InboxSearchComposer
                        key={`tl-search-tab-${selectedTabIndex}-clear-${clearSearchTrigger}`}
                        configs={modifiedConfig || config}
                        showTab={true}
                        tabData={tabData}
                        onTabChange={onTabChange}
                        onFormValueChange={onFormValueChange}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default Search;
