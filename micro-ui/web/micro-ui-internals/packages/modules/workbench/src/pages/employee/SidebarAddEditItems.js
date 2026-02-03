import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
// import { ActionBar } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { FormComposerV2, Button, PopUp, TextInput, Toast } from "@egovernments/digit-ui-components";
import SidebarAddEditConfig from "../../configs/SidebarAddEditConfig";

const SidebarAddEditItems = () => {

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    const history = useHistory();
    const { t } = useTranslation();
    const searchParams = new URLSearchParams(location.search);
    const typeOfAction = searchParams.get("type");
    const id = searchParams.get("id");
    const curLocale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
    const locales = ["en_IN", "pt_IN", "fr_IN"].filter(local => local !== curLocale);
    const module = "digit-ui-menu-items";
    const { mutateAsync: localisationMutateAsync } = Digit.Hooks.workbench.useUpsertLocalisation(tenantId, module, curLocale);
    const [showToast, setShowToast]=useState(null);
    const [formData, setFormData] = useState(null);

    const res = {
        url: `/${mdms_context_path}/v2/_search`,
        params: {
            tenantId: tenantId
        },
        body: {
            MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: `ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                filters: {
                    url: "url"
                },
                uniqueIdentifiers: [id],
                isActive: true
            }
        },
        config: {
            cacheTime: 0, // Disable caching
            staleTime: 0, // Always treat as stale
            select: (res) => {
                return res?.mdms?.[0];
            }
        }
    }
    const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(res);

    const [iconNames, setIconNames] = useState(null);
    const extractExports = (text) => {
        const exportRegex = /export\s*{\s*([^}]+?)\s*}(?=\s+from|;|\n|$)/g;
        return Array.from(text.matchAll(exportRegex))
            .flatMap(match => match[1]
                .split(/\s*,\s*/)
                .map(name => name.trim().split(/\s+as\s+/i)[0])
            );
    };


    const FILE_URL = "https://raw.githubusercontent.com/egovernments/DIGIT-Frontend/refs/heads/develop/micro-ui/web/micro-ui-internals/packages/svg-components/src/index.js";
    useEffect(() => {
        fetch(FILE_URL)
            .then(response => response.text())
            .then(text => {
                const icons = extractExports(text);
                const iconObjects = icons.map(icon => ({ code: icon }));
                // SidebarAddEditConfig({ t, typeOfAction: typeOfAction })[0].body.forEach((field) => {
                //     if (field.populators?.name === "leftIcon") {
                //         field.populators.options = iconObjects; 
                //     }
                // });   

                setIconNames(iconObjects);
            });

    }, [])

    const { data: USER_ROLE } = Digit.Hooks.useCustomMDMS(tenantId, "ACCESSCONTROL-ROLES", [{ name: "roles" }], {
        config: {
            cacheTime: 0,
            staleTime: 0,
        },
        select: (data) => {
            return data;
        },
    });

    const res1 = {
        url: `/${mdms_context_path}/v2/_search`,
        params: {
            tenantId: tenantId
        },
        body: {
            MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: `ACCESSCONTROL-ROLEACTIONS.roleactions`,
                filters: {
                    actionid: id
                },
                isActive: true
            }
        },
        config: {
            cacheTime: 0, // Disable caching
            staleTime: 0, // Always treat as stale
            select: (res) => {
                return res?.mdms;
            }
        }
    }
    const { isLoading: isLoading1, data: data1, isFetching: isFetching1 } = Digit.Hooks.useCustomAPIHook(res1);
    const [defUsers, setDefUsers] = useState(null);

    useEffect(() => {
    
        if (!data1) return; // If data1 is undefined, exit early
    
        if (Array.isArray(data1) && data1.length > 0) {
            const users = data1.map(item => ({
                code: item?.data?.rolecode, 
                id: item?.id, 
                auditDetails: item?.auditDetails
            }));
            setDefUsers(users);
        } else {
            setDefUsers([]);
        }
    }, [data1]); // Runs whenever data1 changes
    

    const generateDataObject = (formData, nId, type) => {
        if (type === "add" || type === "update") {
            return {
                leftIcon: formData?.leftIcon?.code,
                id: Number(nId),
                path: formData?.path,
                enabled: formData?.enabled,
                displayName: formData?.displayName?.trim(), // Trim spaces from start and end
                orderNumber: Number(formData?.orderNumber) || 1,
                navigationURL: formData?.navigationURL,
                url: "url"
            };
        }
        return {};

    };

    const defaultValues = useMemo(() => ({
        displayName: data?.data?.displayName,
        enabled: data?.data?.enabled,
        path: data?.data?.path,
        leftIcon: { code: data?.data?.leftIcon },
        navigationURL: data?.data?.navigationURL,
        orderNumber: data?.data?.orderNumber,
        users: defUsers && defUsers.length > 0 ? defUsers : []
    }), [data, defUsers, id]); // Recalculates when dependencies change


    const onSubmitUpdate = async () => {

        const dataObject = generateDataObject(formData, id, "update");

        try {

            const res1 = await Digit.CustomService.getResponse({
                url: `/${mdms_context_path}/v2/_update/ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                params: {
                    tenantId: tenantId
                },
                body: {
                    Mdms: {
                        tenantId: tenantId,
                        schemaCode: `ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                        uniqueIdentifier: Number(id),
                        id: data?.id,
                        // data: {
                        //     leftIcon: formData?.leftIcon?.code,
                        //     id: Number(id),
                        //     path: formData?.path,
                        //     enabled: formData?.enabled,
                        //     displayName: formData?.displayName,
                        //     orderNumber: Number(formData?.orderNumber) || 1,
                        //     navigationURL: formData?.navigationURL,
                        //     url: "url"
    
                        // },
                        data: dataObject,
                        isActive: true,
                        auditDetails: data?.auditDetails
                    }
                }
            });

            // Extract user data
            const userCodes = formData?.users || [];

            // Identify new additions (users in formData but not in defUsers)
            const newAdd = userCodes.filter(user =>
                !defUsers.some(defUser => defUser.code === user.code)
            );

            // Identify old deletions (users in defUsers but not in formData)
            const oldDel = defUsers.filter(defUser =>
                !userCodes.some(user => user.code === defUser.code)
            );


            // Create API requests for new additions (isActive: true)
            const newAddRequests = newAdd.map(async (user) => {
                const res = await Digit.CustomService.getResponse({
                    url: `/${mdms_context_path}/v2/_create/ACCESSCONTROL-ROLEACTIONS.roleactions`,
                    params: { tenantId },
                    body: {
                        Mdms: {
                            tenantId,
                            schemaCode: `ACCESSCONTROL-ROLEACTIONS.roleactions`,
                            data: {
                                actionid: `${id}`,
                                rolecode: user.code, // Use full user object
                                tenantid: tenantId,
                                actioncode: ""
                            },
                            isActive: true
                        }
                    }
                });
                return res;
            });

            // Create API requests for old deletions (isActive: false)
            const oldDelRequests = oldDel.map(async (user) => {
                const res = await Digit.CustomService.getResponse({
                    url: `/${mdms_context_path}/v2/_update/ACCESSCONTROL-ROLEACTIONS.roleactions`,
                    params: { tenantId },
                    body: {
                        Mdms: {
                            tenantId,
                            id: user.id,
                            schemaCode: `ACCESSCONTROL-ROLEACTIONS.roleactions`,
                            uniqueIdentifier: `${id}.${user.code}`,
                            data: {
                                actionid: `${id}`,
                                rolecode: user.code, // Use full user object
                                tenantid: tenantId,
                                actioncode: ""
                            },
                            isActive: false,
                            auditDetails: user.auditDetails
                        }
                    }
                });
                return res;
            });

            // Combine and execute all requests
            const results = await Promise.all([...newAddRequests, ...oldDelRequests]);

            history.push(`/${window.contextPath}/employee/workbench/sidebar-items?id=${id}`, {
            });

        } catch (error) {
            console.error("Error during API calls:", error);
            setShowPopup(false);
            setShowToast({type:"error", label:error?.response?.data?.Errors?.[0]?.message});
        }

    }

    const [newId, setNewId] = useState(null);

    const onSubmitAdd = async () => {

        try {

            const res = await Digit.CustomService.getResponse({
                url: `/${mdms_context_path}/v2/_search`,
                params: {
                    tenantId: tenantId
                },
                body: {
                    MdmsCriteria: {
                        tenantId: tenantId,
                        schemaCode: `ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                        filters: {
                            url: "url"
                        },
                        limit: 1,
                        offset: 0,
                        isActive: true
                    }
                },
            });
            setNewId(res?.mdms?.[0]?.data?.id + 1);
            const nId = res?.mdms?.[0]?.data?.id + 1;
    
            const dataObject = generateDataObject(formData, nId, "update");
    
    
            const res1 = await Digit.CustomService.getResponse({
                url: `/${mdms_context_path}/v2/_create/ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                params: {
                    tenantId: tenantId
                },
                body: {
                    Mdms: {
                        tenantId: tenantId,
                        schemaCode: `ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                        uniqueIdentifier: nId,
                        // data: {
                        //     leftIcon: formData?.leftIcon?.code,
                        //     id: nId,
                        //     path: formData?.path,
                        //     enabled: formData?.enabled || true,
                        //     displayName: formData?.displayName,
                        //     orderNumber: Number(formData?.orderNumber) || 1,
                        //     navigationURL: formData?.navigationURL,
                        //     url: "url"
    
                        // },
                        data: dataObject,
                        isActive: formData?.enabled,
                    }
                }
            });
            // Assuming formData?.user is an array of objects with a 'code' field
            const userCodes = formData?.users || [];

            // Call the API for each 'code' in the array
            const apiRequests = userCodes.map(async (user) => {
                const res = await Digit.CustomService.getResponse({
                    url: `/${mdms_context_path}/v2/_create/ACCESSCONTROL-ROLEACTIONS.roleactions`,
                    params: {
                        tenantId: tenantId
                    },
                    body: {
                        Mdms: {
                            tenantId: tenantId,
                            schemaCode: `ACCESSCONTROL-ROLEACTIONS.roleactions`,
                            // uniqueIdentifier: nId,
                            data: {
                                actionid: `${nId}`,
                                rolecode: user.code,  // Assuming user.code contains the role code
                                tenantid: tenantId,
                                actioncode: ""
                            },
                            isActive: true,
                        }
                    }
                });

                return res; // You can also collect the responses if needed
            });

            // Wait for all API calls to finish
            const results = await Promise.all(apiRequests);
            history.push(`/${window.contextPath}/employee/workbench/sidebar-items?id=${nId}`, {
            });
        } catch (error) {
            console.error("Error during API calls:", error);
            setShowPopup(false);
            setShowToast({type:"error", label:error?.response?.data?.Errors?.[0]?.message});
        }

    }

    const [showPopup, setShowPopup] = useState(false);
    const [translations, setTranslations] = useState(
        locales.map(locale => ({ locale, message: " ", module: module }))
    );
    const [finalCall, setFinalCall] = useState(false);

    const handleTranslationChange = (locale, message) => {
        setTranslations(prev =>
            prev.map(trans =>
                trans.locale === locale ? { ...trans, message } : trans
            )
        );
    };

    // const updateTrimmedTextFields = async () => {
    //     setFormData(prevFormData => {
    //         const updatedFormData = { ...prevFormData };

    //         fieldConfig.forEach(field => {
    //             if (field.type === "text" && typeof updatedFormData[field.name] === "string") {
    //                 updatedFormData[field.name] = updatedFormData[field.name].trim();
    //             }
    //         });

    //         return updatedFormData;
    //     });
    // };


    const beginLocalisation = async (data) => {
        setFormData(data);
        setShowPopup(true);
    }

    useEffect(() => {
        if (formData) setShowPopup(true);
    }, formData);

    const addLocalisation = async () => {

        // const res = await updateTrimmedTextFields();
        if (formData?.displayName) {
            formData.displayName = formData.displayName.trim();
        }

        const temp = formData?.displayName?.trim().toUpperCase().replace(/\s+/g, "_");
        const code = `ACTION_TEST_${temp}`
        // const code = formData?.displayName
        setTranslations(prevTranslations => [
            ...prevTranslations.map(translation => ({
                ...translation,
                code: code // Now code is defined inside the function
            })),
            { locale: curLocale, message: formData?.displayName, module: module, code: code } // Adding new object
        ]);
        setFinalCall(true);
    }

    const [load, setLoad] = useState(false);

    const callUpsert = async () => {
        setLoad(true);
        const groupedTranslations = translations.reduce((acc, item) => {
            if (!acc[item.locale]) {
                acc[item.locale] = [];
            }
            acc[item.locale].push(item);
            return acc;
        }, {});

        try {
            const results = await Promise.all(
                Object.values(groupedTranslations).map(async (entries) => {
                    const result = await localisationMutateAsync(entries);
                    return result;
                })
            );

            const res =
                typeOfAction === "add" ? await onSubmitAdd()
                    : typeOfAction === "update" ? await onSubmitUpdate()
                        : null;

            setLoad(false);



        } catch (error) {
            console.error("Error occurred in one or more locales:", error);
            setLoad(false);
        }
    };

    useEffect(() => {
        if (finalCall) {
            callUpsert()
        }
    }, [finalCall])

    return (
        <div>
            {!isLoading && iconNames && defUsers && <FormComposerV2
                showMultipleCardsWithoutNavs={false}
                config={SidebarAddEditConfig({ t, typeOfAction: typeOfAction, icon: iconNames, users: USER_ROLE?.["ACCESSCONTROL-ROLES"]?.roles })}
                fieldStyle={{ marginRight: 0 }}
                defaultValues={typeOfAction === "update" ? defaultValues : {}}
                noBreakLine={true}
                onFormValueChange={() => { }}
                actionClassName={"sidebaradd"}
                label={typeOfAction === "update" ? t("SIDEBAR_UPDATE") : t("SIDEBAR_ADD")}
                // noCardStyle={f}
                onSubmit={beginLocalisation}
                showWrapperContainers={false}
                inLine={true}
                submitInForm
            />}
            {showPopup && <PopUp
                // className="localisation-popup-container"
                heading={t("ADD_TRANSLATIONS")}
                onClose={() => setShowPopup(false)}
            >
                <div className="localisation-inputs">
                    {locales.map((locale) => (
                        <div key={locale} className="localisation-row">
                            <label className="locale-label">
                                {t(locale)}
                            </label>
                            <TextInput
                                type="text"
                                value={translations.find(t => t.locale === locale)?.message || ""}
                                onChange={(e) => handleTranslationChange(locale, e.target.value)}
                                placeholder={t("ENTER_TRANSLATION")}
                            />
                        </div>
                    ))}
                    {<Button
                        className=""
                        variation="secondary"
                        label={t("SIDEBAR_SUBMIT")}
                        title={t("SIDEBAR_SUBMIT")}
                        onClick={addLocalisation}
                    />}
                </div>
            </PopUp>}
            {
                showToast && <Toast
                                label={showToast?.label}
                                type={showToast?.type}
                />
            }
            {/* {
                <Button
                    className=""
                    variation="secondary"
                    label={t("SIDEBAR_UPDATE_CONTENT")}
                    title={t("SIDEBAR_UPDATE_CONTENT_ADD")}
                    onClick={onSubmit}
                />
            } */}
        </div>
    )
};
export default SidebarAddEditItems;
