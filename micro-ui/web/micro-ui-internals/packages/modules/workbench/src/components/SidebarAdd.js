import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { TextInput, Dropdown, Switch, Button, MultiSelectDropdown, PopUp, Loader } from "@egovernments/digit-ui-components"; // Added Switch import

const fieldConfig = [
    { name: "path", type: "text", isRequired: true },
    { name: "enabled", type: "switch", isRequired: true },
    { name: "leftIcon", type: "dropdown", isRequired: true },
    { name: "displayName", type: "text", isRequired: true },
    { name: "orderNumber", type: "number" },
    { name: "navigationURL", type: "text", isRequired: true },
    { name: "user", type: "multiselect", isRequired: true }
];
// 
const SidebarAdd = (props) => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const typeOfScreen = searchParams.get("type");
    const id = searchParams.get("id");
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const curLocale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
    const locales = ["en_IN", "pt_IN", "fr_IN"].filter(local => local !== curLocale);
    const module = "digit-ui-menu-items";
    const { mutateAsync: localisationMutateAsync } = Digit.Hooks.workbench.useUpsertLocalisation(tenantId, module, curLocale);

    const history = useHistory(); // Get history object for navigation
    const [viewData, setViewData] = useState(null);
    const [formData, setFormData] = useState({
        path: "",
        enabled: true,
        leftIcon: "",
        displayName: "",
        orderNumber: 1,
        navigationURL: "",
        user: []
    });
    const disabled = typeOfScreen === "view" ? true : false;
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

    const [defUsers, setDefUsers] = useState([]);
    useEffect(() => {
        setViewData(data);
        let users;
        if (data1) users = data1.map(item => ({ code: item.data.rolecode, id: item.id, auditDetails: item.auditDetails}));
        setDefUsers(users);
        setFormData({
            path: data?.data?.path,
            enabled: data?.data?.enabled,
            leftIcon: data?.data?.leftIcon,
            displayName: data?.data?.displayName,
            orderNumber: data?.data?.orderNumber,
            navigationURL: data?.data?.navigationURL,
            user: typeOfScreen === "add" ? [] : users ? users : []
        })
    }, [data, typeOfScreen, data1]);


    const [newId, setNewId] = useState(null);
    const [iconNames, setIconNames] = useState([]);
    const extractExports = (text) => {
        const exportRegex = /export\s*{\s*([^}]+?)\s*}(?=\s+from|;|\n|$)/g;
        return Array.from(text.matchAll(exportRegex))
            .flatMap(match => match[1]
                .split(/\s*,\s*/)
                .map(name => name.trim().split(/\s+as\s+/i)[0])
            );
    };

// this should be made dynamic
    const FILE_URL = "https://raw.githubusercontent.com/egovernments/DIGIT-Frontend/refs/heads/develop/micro-ui/web/micro-ui-internals/packages/svg-components/src/index.js";
    useEffect(() => {
        fetch(FILE_URL)
            .then(response => response.text())
            .then(text => {
                const icons = extractExports(text);
                const iconObjects = icons.map(icon => ({ code: icon }));
                setIconNames(iconObjects);
            });

    }, [])

    const { data: USER_ROLE } = Digit.Hooks.useCustomMDMS(tenantId, "ACCESSCONTROL-ROLES", [{ name: "roles" }], {
        select: (data) => {
            return data;
            ;
        },
    });

    const handleChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: Array.isArray(value) ?
                value.map(item => ({
                    code: item[1].code,
                    name: item[1].name
                }))
                : typeof value === "string" ? value : value
        }));
    };

    const [showPopup, setShowPopup] = useState(false);
    const [translations, setTranslations] = useState(
        locales.map(locale => ({ locale, message: "", module: module }))
    );
    const [finalCall, setFinalCall] = useState(false);

    const handleTranslationChange = (locale, message) => {
        setTranslations(prev =>
            prev.map(trans =>
                trans.locale === locale ? { ...trans, message } : trans
            )
        );
    };

    const updateTrimmedTextFields = async () => {
        setFormData(prevFormData => {
            const updatedFormData = { ...prevFormData };

            fieldConfig.forEach(field => {
                if (field.type === "text" && typeof updatedFormData[field.name] === "string") {
                    updatedFormData[field.name] = updatedFormData[field.name].trim();
                }
            });

            return updatedFormData;
        });
    };




    const addLocalisation = async () => {

        const res = await updateTrimmedTextFields();

        const temp = formData?.displayName?.trim().toUpperCase().replace(/\s+/g, "_");
        const code = `ACTION_TEST_${temp}`
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
                typeOfScreen === "add" ? await onSubmitAdd()
                    : typeOfScreen === "update" ? await onSubmitUpdate()
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

    const onSubmitAdd = async () => {
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
                    data: {
                        leftIcon: formData?.leftIcon,
                        id: nId,
                        path: formData?.path,
                        enabled: formData?.enabled,
                        displayName: formData?.displayName,
                        orderNumber: formData?.orderNumber,
                        navigationURL: formData?.navigationURL,
                        url: "url"

                    },
                    isActive: true,
                }
            }
        });

        try {
            // Assuming formData?.user is an array of objects with a 'code' field
            const userCodes = formData?.user || [];

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

            history.push(`/${window.contextPath}/employee/workbench/sidebar-add-content?type=view&id=${nId}`, {
                data: viewData
            });
        } catch (error) {
            console.error("Error during API calls:", error);
        }

    }
    const onSubmitOpenUpdate = () => {
        history.push(`/${window.contextPath}/employee/workbench/sidebar-add-content?type=update&id=${id}`,
            {
                data: viewData
            }
        );

    }
    const onSubmitUpdate = async () => {
        const res1 = await Digit.CustomService.getResponse({
            url: `/${mdms_context_path}/v2/_update/ACCESSCONTROL-ACTIONS-TEST.actions-test`,
            params: {
                tenantId: tenantId
            },
            body: {
                Mdms: {
                    tenantId: tenantId,
                    schemaCode: `ACCESSCONTROL-ACTIONS-TEST.actions-test`,
                    uniqueIdentifier: viewData?.data?.id,
                    id: viewData?.id,
                    data: {
                        leftIcon: formData?.leftIcon,
                        id: viewData?.data?.id,
                        path: formData?.path,
                        enabled: formData?.enabled,
                        displayName: formData?.displayName,
                        orderNumber: formData?.orderNumber,
                        navigationURL: formData?.navigationURL,
                        url: "url"

                    },
                    isActive: true,
                    auditDetails: viewData?.auditDetails
                }
            }
        });

        try {
            // Extract user data
            const userCodes = formData?.user || [];
        
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
                                actionid: `${viewData?.data?.id}`,
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
                            uniqueIdentifier: `${viewData?.data?.id}.${user.code}`,
                            data: {
                                actionid: `${viewData?.data?.id}`,
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
            
            history.push(`/${window.contextPath}/employee/workbench/sidebar-add-content?type=view&id=${id}`, {
                data: viewData
            });
        
        } catch (error) {
            console.error("Error during API calls:", error);
        }
        
    }

    const renderField = (field) => {
        if (field.name === "id") return null;
        if (disabled && (field.type === "multiselect" || field.type === "switch")) return null;
        return (
            <div key={field.name} style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem"
            }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <label style={{ fontWeight: "500" }}>{t(field.label || field.name.toUpperCase())}</label>
                    {field.isRequired && <span className="mandatory-span">*</span>}
                </div>

                {field.type === "multiselect" ? (
                    <MultiSelectDropdown
                        options={USER_ROLE?.["ACCESSCONTROL-ROLES"]?.roles || []}
                        selected={formData[field.name]}
                        optionsKey="name"
                        onSelect={(value) => handleChange(field.name, value)}
                        t={t}
                        style={{ width: "100%" }}
                    />
                ) : field.type === "switch" ? (
                    <Switch
                        isCheckedInitially={true}
                        checked={formData[field.name]}
                        onToggle={(value) => handleChange(field.name, value)}
                        style={{ width: "fit-content" }}
                    />
                ) : field.type === "dropdown" ? (
                    typeOfScreen === "add" || typeOfScreen === "update" ?
                        <Dropdown
                            selected={formData?.[field.name]}
                            option={iconNames}
                            select={(value) => handleChange(field.name, value?.code)}
                            optionKey="code"
                            t={t}
                            style={{ width: "100%" }}
                        /> :
                        <TextInput
                            disabled={disabled}
                            isRequired={field.isRequired}
                            type={"text"}
                            value={formData[field.name]}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            style={{ width: "100%" }}
                        />

                ) : (
                    <TextInput
                        disabled={disabled}
                        isRequired={field.isRequired}
                        type={field.type === "number" ? "number" : "text"}
                        value={formData[field.name]}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        style={{ width: "100%" }}
                    />
                )}
            </div>
        );
    };

    return (
        <div>
            {load && <Loader />}
            {!load && <div>
                <div style={{ marginTop: "1rem", maxWidth: "100rem", marginLeft: "1rem" }}>
                    {fieldConfig.map(renderField)}
                </div>
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

                {typeOfScreen === "add" && <Button
                    className=""
                    variation="secondary"
                    label={t("SIDEBAR_ADD_CONTENT")}
                    title={t("SIDEBAR_ADD_CONTENT_ADD")}
                    onClick={() => { setShowPopup(true) }}
                />}
                {typeOfScreen === "view" && <Button
                    className=""
                    variation="secondary"
                    label={t("SIDEBAR_UPDATE_CONTENT")}
                    title={t("SIDEBAR_UPDATE_CONTENT_ADD")}
                    onClick={onSubmitOpenUpdate}
                />}
                {typeOfScreen === "update" && <Button
                    className=""
                    variation="secondary"
                    label={t("SIDEBAR_UPDATE_CONTENT")}
                    title={t("SIDEBAR_UPDATE_CONTENT_ADD")}
                    onClick={() => { setShowPopup(true) }}
                />}

            </div>}
        </div>
    )

};

export default SidebarAdd;
