// NewDependentFieldWrapper.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Dropdown,
    Card,
    LabelFieldPair,
    TextInput,
    Button,
    PopUp,
    Tag,
    SVG,
    CheckBox,
} from "@egovernments/digit-ui-components";
import ReactDOM from "react-dom";
import { useCustomT, useCustomTranslate } from "./hooks/useCustomT";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { fetchFlowPages } from "./redux/flowPagesSlice";
import { fetchPageFields } from "./redux/pageFieldsSlice";

/** Portal so the popup escapes side panels and fills the viewport layer */
function BodyPortal({ children }) {
    if (typeof document === "undefined") return null; // SSR guard
    return ReactDOM.createPortal(children, document.body);
}

/** MDMS Dropdown */
function MdmsValueDropdown({ schemaCode, value, onChange, t }) {
    const tenantId = Digit?.ULBService?.getCurrentTenantId?.();
    const [module = "", master = ""] = (schemaCode || "").split(".");

    const { isLoading, data: list = [] } = Digit.Hooks.useCustomMDMS(
        tenantId,
        module,
        [{ name: master }],
        {
            cacheTime: Infinity,
            staleTime: Infinity,
            select: (data) => data?.[module]?.[master] || [],
        },
        { schemaCode: "DROPDOWN_MASTER_DATA" },
        true // mdmsv2
    );

    const options = React.useMemo(
        () => (Array.isArray(list) ? list.map((it) => ({ code: it.code, name: it.name })) : []),
        [list]
    );

    const selectedOption = React.useMemo(() => {
        if (!value) return undefined;
        const match = options.find((o) => String(o.code) === String(value));
        return match || { code: value, name: value };
    }, [options, value]);

    return (
        <Dropdown
            option={options}
            optionKey="code"
            name={`mdms-${module}-${master}`}
            t={t}
            optionCardStyles={{ maxHeight: "15vh", overflow: "auto", zIndex: 10000 }}
            select={(e) => onChange(e.code)}
            selected={selectedOption}
            showToolTip={true}
            isSearchable={true}
        />
    );
}

function NewDependentFieldWrapper({ t }) {
    const useT = useCustomTranslate();
    const dispatch = useDispatch();
    const tenantId = Digit?.ULBService?.getCurrentTenantId?.() || "mz";

    // Redux selectors
    const selectedField = useSelector((state) => state.remoteConfig.selectedField);
    const currentData = useSelector((state) => state.remoteConfig.currentData);
    const flowPages = useSelector((state) => state.flowPages.pages);
    const flowPagesStatus = useSelector((state) => state.flowPages.status);
    const pageConfigs = useSelector((state) => state.pageFields.byPage);
    const pageFieldsLoading = useSelector((state) => state.pageFields.loadingPages);

    const moduleName = "HCM-ADMIN-CONSOLE";
    const masterName = "AppFlowConfig";

    const flowId = currentData?.module || "REGISTRATION";
    const campaignNumber = currentData?.project || "";
    const currentPageName = currentData?.page;

    // Fetch flows on mount or when campaign changes
    useEffect(() => {
        if (flowPagesStatus === "idle" && campaignNumber) {
            dispatch(
                fetchFlowPages({
                    tenantId,
                    campaignNumber,
                    flowId,
                    moduleName,
                    masterName,
                })
            );
        }
    }, [dispatch, flowPagesStatus, tenantId, campaignNumber, flowId, moduleName, masterName]);

    // Fetch current page fields if not already loaded
    useEffect(() => {
        if (
            currentPageName &&
            flowId &&
            campaignNumber &&
            !pageConfigs[currentPageName] &&
            !pageFieldsLoading[currentPageName]
        ) {
            dispatch(
                fetchPageFields({
                    tenantId,
                    flow: currentFlow?.name,
                    campaignNumber,
                    pageName: currentPageName,
                })
            );
        }
    }, [dispatch, currentPageName, flowId, campaignNumber, pageConfigs, pageFieldsLoading, tenantId]);

    // ---------- labels ----------
    const displayLogicLabel = t("DISPLAY_LOGIC") || "Display Logic";
    const noLogicAddedLabel = t("NO_LOGIC_ADDED") || "No logic added yet.";
    const addDisplayLogicLabel = t("ADD_DISPLAY_LOGIC") || "Add Display Logic";
    const editLabel = t("EDIT") || "Edit";
    const deleteRuleLabel = t("HCM_REMOVE_RULE") || "Delete Rule";
    const selectPageLabel = t("HCM_SELECT_PAGE") || "Select Page";
    const selectFieldLabel = t("HCM_SELECT_FIELD") || "Select Field";
    const comparisonTypeLabel = t("HCM_COMPARISION_TYPE") || "Comparison";
    const selectValueLabel = t("HCM_SELECT_VALUE") || "Select Value";
    const enterValueLabel = t("ENTER_VALUE") || "Enter value";
    const closeLabel = t("CLOSE") || "Cancel";
    const submitLabel = t("CONFIRM_DISPLAY_LOGIC") || "Submit";
    const addConditionLabel = t("ADD_CONDITION") || "Add Condition";
    const removeConditionLabel = t("REMOVE_CONDITION") || "Remove Condition";
    const compareFieldToggleLabel = t("COMPARE_WITH_FIELD") || "Compare with another field";
    const completeAllMsg =
        t("PLEASE_COMPLETE_ALL_CONDITIONS") || "Please complete all condition fields before confirming.";
    const logicLabel = t("HCM_LOGIC") || "Logic";
    const selectPageFirstLabel = t("SELECT_PAGE_FIRST") || "Select page first";

    // ---------- constants & helpers ----------
    const LOGICALS = [
        { code: "&&", name: t("AND") || "AND" },
        { code: "||", name: t("OR") || "OR" },
    ];
    const ALL_OPERATOR_OPTIONS = [
        { code: "==", name: "EQUALS_TO" },
        { code: "!=", name: "NOT_EQUALS_TO" },
        { code: ">=", name: "GREATER_THAN_OR_EQUALS_TO" },
        { code: "<=", name: "LESS_THAN_OR_EQUALS_TO" },
        { code: ">", name: "GREATER_THAN" },
        { code: "<", name: "LESS_THAN" },
        { code: "contains", name: "CONTAINS" },
    ];
    const PARSE_OPERATORS = useMemo(
        () => ["!=", ">=", "<=", "==", ">", "<"].sort((a, b) => b.length - a.length),
        []
    );

    // ---------- helpers to read existing expression ----------
    const getExpressionArray = () => {
        const expr = selectedField?.visibilityCondition?.expression;
        // If string (old) -> wrap into single object
        if (typeof expr === "string" && expr.trim()) {
            return [{ condition: expr.trim() }];
        }
        // If array of objects with condition key
        if (Array.isArray(expr)) {
            return expr.map((e) => ({ condition: String(e.condition || "").trim() }));
        }
        return [];
    };

    // Find the current flow from flowPages
    const currentFlow = useMemo(() => {
        if (!flowPages || !flowId) return null;
        return flowPages.find((flow) => flow.name === currentData?.flow || flow.flowId === currentData?.flow);
    }, [flowPages, flowId]);


    // Extract pages from the current flow
    const currentFlowPages = useMemo(() => {
        if (!currentFlow || !currentFlow.pages) return [];
        return currentFlow.pages;
    }, [currentFlow]);


    // Prepare page options (only pages up to current page order)
    const pageOptions = useMemo(() => {
        if (!currentFlowPages.length || !currentPageName) return [];

        const currentPageFullName = currentPageName?.includes(".") ? currentPageName : `${flowId}.${currentPageName}`;

        const currentPage = currentFlowPages.find(
            (p) => p.name === currentPageFullName || p.name === currentPageName || p.name.endsWith(`.${currentPageName}`)
        );


        const currentPageOrder = currentPage?.order || Number.MAX_VALUE;

        const availablePages = currentFlowPages.filter((p) => p.order <= currentPageOrder);

        return availablePages.map((p) => {
            const code = p.name.includes(".") ? p.name.split(".").pop() : p.name;
            return {
                code,
                name: p.name,
                displayName: Digit.Utils.locale.getTransformedLocale(`APP_CONFIG_PAGE_${p.name}`),
                order: p.order,
            };
        });
    }, [currentFlowPages, currentPageName, flowId]);

    // Get page object (fields) -- current page uses currentData body, else pageConfigs
    const getPageObj = (pageCode) => {
        if (pageCode === currentPageName) {
            return currentData?.body?.[0];
        }

        const pageConfig = pageConfigs[pageCode];
        if (pageConfig) {
            return pageConfig.body?.[0] || { fields: [] };
        }
        return { fields: [] };
    };

    // Helper: obtain code of the field currently being edited (selectedField)
    const getCurrentEditingFieldCode = () =>
        selectedField?.fieldName || selectedField?.jsonPath || selectedField?.id || selectedField?.code || "";

    // Extract product variants from session storage
    const productVariants = useMemo(() => {
        try {
            const sessionData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
            if (!sessionData) return [];

            const deliveryData = sessionData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;

            if (!deliveryData || !Array.isArray(deliveryData)) return [];

            // Extract all product variants from all cycles and deliveries
            const variantsMap = new Map();

            deliveryData?.forEach(campaign => {
                if (campaign?.cycles && Array.isArray(campaign.cycles)) {
                    campaign.cycles.forEach(cycle => {
                        if (cycle?.deliveries && Array.isArray(cycle.deliveries)) {
                            cycle.deliveries.forEach(delivery => {
                                if (delivery?.doseCriteria && Array.isArray(delivery.doseCriteria)) {
                                    delivery.doseCriteria.forEach(criteria => {
                                        if (criteria?.ProductVariants && Array.isArray(criteria.ProductVariants)) {
                                            criteria.ProductVariants.forEach(variant => {
                                                if (variant?.productVariantId && variant?.name) {
                                                    // Use productVariantId as key to avoid duplicates
                                                    variantsMap.set(variant.productVariantId, {
                                                        code: variant.productVariantId,
                                                        name: variant.name,
                                                        productVariantId: variant.productVariantId
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

            return Array.from(variantsMap.values());
        } catch (error) {
            console.error("Error extracting product variants:", error);
            return [];
        }
    }, []);

    // Get field options for a page
    // IMPORTANT: we exclude the selectedField (the one being configured) from options
    const getFieldOptions = (pageCode) => {
        const pageObj = getPageObj(pageCode);
        if (!pageObj?.fields) return [];
        const currentEditingFieldCode = getCurrentEditingFieldCode();
        return pageObj.fields
            .filter((f) => {
                const fieldType = String(f?.type || "").toLowerCase();
                // if (["template", "dynamic", "custom"].includes(fieldType)) return false;
                const isHidden = f?.hidden === true;
                const includeInForm = f?.includeInForm;
                if (isHidden && !includeInForm) return false;
                return true;
            })
            .map((f) => ({
                code: f.fieldName || f.jsonPath || f.id,
                name: f.fieldName || f.jsonPath || f.id,
                label: f.label || f.fieldName,
                format: f.format,
                type: f.type || f.datatype || f.format || "string",
                schemaCode: f.schemaCode,
                enums: f.enums || f.dropDownOptions || f.options || [],
                isMultiselect: f.isMultiselect || false,
            }))
            .filter((f) => f.code !== getCurrentEditingFieldCode()); // exclude the field being edited
    };

    // Fetch fields when a page is selected
    const handlePageSelection = useCallback(
        (pageCode) => {
            if (!flowId || !campaignNumber) return;
            const cleanPageCode = pageCode.includes(".") ? pageCode.split(".").pop() : pageCode;
            if (!pageConfigs[cleanPageCode] && !pageFieldsLoading[cleanPageCode]) {
                dispatch(
                    fetchPageFields({
                        tenantId,
                        flow: currentFlow?.name,
                        campaignNumber,
                        pageName: cleanPageCode,
                    })
                );
            }
        },
        [dispatch, pageConfigs, pageFieldsLoading, tenantId, flowId, campaignNumber]
    );

    // ---------- field-type helpers ----------
    const isStringLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        if (fmt === "dropdown" || fmt === "radio" || tpe === "selection") return true;
        return ["string", "text", "textinput", "textarea"].includes(tpe);
    };

    const isCheckboxField = (field) => (field?.format || "").toLowerCase() === "checkbox";

    const isNumericField = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        const numericTags = ["number", "numeric", "integer"];
        return numericTags.includes(tpe) || numericTags.includes(fmt);
    };

    const isDobLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return fmt === "dob";
    };

    const isDatePickerNotDob = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return fmt === "date";
    };

    const isSelectLike = (field) => {
        const fmt = (field?.format || "").toLowerCase();
        const tpe = (field?.type || "").toLowerCase();
        return (
            fmt === "dropdown" ||
            fmt === "radio" ||
            tpe === "selection" ||
            (Array.isArray(field?.enums) && field.enums.length > 0) ||
            !!field?.schemaCode
        );
    };

    const isProductVariantOrMultiselect = (field) => {
        const code = field?.code || field?.fieldName || "";
        const isProductVariant = code === "productdetail" || code === "resourceCard";
        const isMultiselect = field?.isMultiselect === true;
        return isProductVariant || isMultiselect;
    };

    const toDDMMYYYY = (iso) => {
        const dateOnly = String(iso).split("T")[0];
        const [y, m, d] = dateOnly.split("-");
        if (!y || !m || !d) return "";
        return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    };

    const toISOFromDDMMYYYY = (ddmmyyyy) => {
        if (!ddmmyyyy) return "";
        const [d, m, y] = String(ddmmyyyy).split("/");
        if (!y || !m || !d) return "";
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    };

    const sanitizeIntegerInput = (raw) => {
        const s = String(raw ?? "");
        if (s === "" || s === "+" || s === "-") return s;
        if (/^[+-]?\d+$/.test(s)) return s;
        const sign = s[0] === "+" || s[0] === "-" ? s[0] : "";
        const digits = s.replace(/[^0-9]/g, "");
        return sign + digits;
    };

    const getOperatorOptions = (field) => {
        if (!field) return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");

        // For product variant fields or multiselect, only show "contains"
        if (isProductVariantOrMultiselect(field)) {
            return [{ code: "contains", name: "CONTAINS" }];
        }

        if (isCheckboxField(field)) {
            return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");
        }
        if (isDobLike(field) || isDatePickerNotDob(field) || isNumericField(field)) {
            return ALL_OPERATOR_OPTIONS;
        }
        if (isSelectLike(field) || isStringLike(field)) {
            return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");
        }
        return ALL_OPERATOR_OPTIONS;
    };

    const getSelectedOperatorFromOptions = (field, comp) => {
        const opts = getOperatorOptions(field);
        if (!comp?.code) return undefined;
        return opts.find((o) => o.code === comp.code);
    };

    // ---------- parse / serialize for sub-conditions ----------
    // parseSingle: parse a simple comparison like `page.field==value` or `page.field==page2.field2`
    const parseSingle = (expression = "", defaultLeftPage = currentPageName) => {
        let expr = (expression || "").trim();

        // Check for contains() function (for product variants/multiselect)
        const containsFn = "contains(";
        if (expr.startsWith(containsFn) && expr.endsWith(")")) {
            // Extract: contains(page.field, 'value')
            const innerExpr = expr.slice(containsFn.length, -1).trim();
            const commaIdx = innerExpr.indexOf(",");
            if (commaIdx !== -1) {
                const leftRaw = innerExpr.slice(0, commaIdx).trim();
                const rightRaw = innerExpr.slice(commaIdx + 1).trim();

                // Parse left side (page.field)
                const leftParts = leftRaw.split(".").map((s) => s.trim());
                let leftPage = defaultLeftPage;
                let leftField = "";
                if (leftParts.length === 1) {
                    leftField = leftParts[0];
                } else if (leftParts.length >= 2) {
                    leftPage = leftParts[0] || defaultLeftPage;
                    leftField = leftParts.slice(1).join(".");
                }

                // Parse right side (remove quotes if present)
                let rightValue = rightRaw.replace(/^['"]|['"]$/g, "");

                return {
                    leftPage,
                    leftField,
                    comparisonType: { code: "contains", name: "CONTAINS" },
                    isFieldComparison: false,
                    rightPage: null,
                    rightField: null,
                    fieldValue: rightValue,
                    isAge: false,
                    isContains: true,
                };
            }
        }

        for (const operator of PARSE_OPERATORS) {
            const i = expr.indexOf(operator);
            if (i !== -1) {
                const leftRaw = expr.slice(0, i).trim();
                const rightRaw = expr.slice(i + operator.length).trim();

                // left might be "calculateAgeInMonths(page.field)" handled as before
                let left = leftRaw;
                const ageFn = "calculateAgeInMonths(";
                let isAge = false;
                if (leftRaw.startsWith(ageFn) && leftRaw.endsWith(")")) {
                    left = leftRaw.slice(ageFn.length, -1);
                    isAge = true;
                }

                // left page.field
                const leftParts = (left || "").split(".").map((s) => (s || "").trim());
                let leftPage = defaultLeftPage;
                let leftField = "";
                if (leftParts.length === 1) {
                    leftField = leftParts[0];
                } else if (leftParts.length >= 2) {
                    leftPage = leftParts[0] || defaultLeftPage;
                    leftField = leftParts.slice(1).join(".");
                }

                // now right; determine if right is a page.field pattern
                const rightParts = (rightRaw || "").split(".").map((s) => (s || "").trim());
                let isFieldComparison = false;
                let rightPage = null;
                let rightField = null;
                let rightValue = rightRaw;

                if (rightParts.length >= 2) {
                    // treat as field comparison
                    isFieldComparison = true;
                    rightPage = rightParts[0];
                    rightField = rightParts.slice(1).join(".");
                    rightValue = "";
                }

                // special: if rightRaw looks like a quoted string keep as-is; else keep as raw
                return {
                    leftPage,
                    leftField,
                    comparisonType: { code: operator, name: operator },
                    isFieldComparison,
                    rightPage,
                    rightField,
                    fieldValue: isFieldComparison ? "" : rightValue,
                    isAge,
                    isContains: false,
                };
            }
        }
        return {
            leftPage: defaultLeftPage,
            leftField: "",
            comparisonType: {},
            isFieldComparison: false,
            rightPage: null,
            rightField: null,
            fieldValue: "",
            isAge: false,
            isContains: false,
        };
    };

    // tokenize splits by top-level && and || preserving order
    const tokenize = (expr = "") => {
        if (!expr) return [];
        const tokens = [];
        let i = 0;
        while (i < expr.length) {
            const andPos = expr.indexOf("&&", i);
            const orPos = expr.indexOf("||", i);
            const hasAnd = andPos !== -1;
            const hasOr = orPos !== -1;
            if (!hasAnd && !hasOr) {
                const last = expr.slice(i).trim();
                if (last) tokens.push({ type: "cond", value: last });
                break;
            }
            let nextOp = null;
            let nextIdx = -1;
            if (hasAnd && hasOr) {
                if (andPos < orPos) {
                    nextOp = "&&";
                    nextIdx = andPos;
                } else {
                    nextOp = "||";
                    nextIdx = orPos;
                }
            } else if (hasAnd) {
                nextOp = "&&";
                nextIdx = andPos;
            } else {
                nextOp = "||";
                nextIdx = orPos;
            }
            const before = expr.slice(i, nextIdx).trim();
            if (before) tokens.push({ type: "cond", value: before });
            tokens.push({ type: "op", value: nextOp });
            i = nextIdx + nextOp.length;
        }
        return tokens;
    };

    // Build serialized single condition from sub-condition object
    const serializeSingle = (c) => {
        if (!c?.leftPage || !c?.leftField || !c?.comparisonType?.code) return "";

        // left
        let left = `${c.leftPage}.${c.leftField}`;

        // Handle contains() function for product variants/multiselect
        if (c.isContains || c.comparisonType.code === "contains") {
            if (String(c.fieldValue ?? "").trim() === "") return "";
            return `contains(${left}, '${c.fieldValue}')`;
        }

        // Handle age calculation
        if (c.isAge) {
            left = `calculateAgeInMonths(${left})`;
        }

        // Handle field comparison
        if (c.isFieldComparison) {
            if (!c.rightPage || !c.rightField) return "";
            return `${left}${c.comparisonType.code}${c.rightPage}.${c.rightField}`;
        }

        // Handle value comparison
        if (String(c.fieldValue ?? "").trim() === "") return "";

        // for date types we expect dd/mm/yyyy format in UI; navigation did similar
        if (c.isDate) {
            return `${left}${c.comparisonType.code}${c.fieldValue}`;
        }
        return `${left}${c.comparisonType.code}${c.fieldValue}`;
    };

    // Build string of all sub-conditions joined by their joiner
    const buildConditionStringFromConds = (conds) =>
        conds
            .map((seg, i) => {
                const single = serializeSingle(seg);
                if (!single) return "";
                // joiner is between previous and this, so we add operator before this segment if i>0
                if (i > 0) {
                    const joiner = seg.joiner?.code || "&&";
                    return `${joiner} ${single}`;
                }
                return single;
            })
            .filter(Boolean)
            .join(" ");

    // ---------- rules state ----------
    // rulesFromExisting: create editable structure from the existing visibilityCondition expression array
    const rulesFromExisting = useMemo(() => {
        const arr = getExpressionArray(); // array of { condition: "..." }
        if (!arr.length) return [];

        return arr.map((obj) => {
            const expr = obj.condition || "";
            const tokens = tokenize(expr);
            const conds = [];
            let pendingJoin = "&&";

            tokens.forEach((t) => {
                if (t.type === "op") {
                    pendingJoin = t.value;
                } else {
                    const parsed = parseSingle(t.value.trim(), currentPageName);

                    conds.push({
                        ...parsed,

                        // AUTO-SELECT Compare-With-Field WHEN RIGHT-SIDE IS A FIELD
                        isFieldComparison: parsed.isFieldComparison,
                        rightPage: parsed.isFieldComparison ? parsed.rightPage : null,
                        rightField: parsed.isFieldComparison ? parsed.rightField : null,

                        // If it's field comparison → no literal value
                        fieldValue: parsed.isFieldComparison ? "" : parsed.fieldValue,

                        joiner:
                            conds.length === 0
                                ? { code: "&&", name: "AND" }
                                : {
                                    code: pendingJoin,
                                    name: pendingJoin === "||" ? "OR" : "AND",
                                },

                        // Keep date info if useful
                        isDate: parsed.isDate || false,

                        // Keep contains info
                        isContains: parsed.isContains || false,
                    });

                    pendingJoin = "&&";
                }
            });

            // If no conds (edge case)
            if (!conds.length) {
                conds.push({
                    leftPage: currentPageName,
                    leftField: "",
                    comparisonType: {},
                    isFieldComparison: false,
                    rightPage: null,
                    rightField: null,
                    fieldValue: "",
                    joiner: { code: "&&", name: "AND" },
                    isContains: false,
                });
            }

            return { conds };
        });
    }, [selectedField, currentPageName, pageConfigs, flowPages]);


    const [rules, setRules] = useState(() => rulesFromExisting);
    const [editorIndex, setEditorIndex] = useState(null);
    const [draftRule, setDraftRule] = useState(null);
    const [globalFormError, setGlobalFormError] = useState("");
    const [validationStarted, setValidationStarted] = useState(false);

    const showPopUp = editorIndex !== null;

    useEffect(() => {
        setRules(rulesFromExisting);
    }, [rulesFromExisting]);

    // When user opens a rule editor, set draft to a deep copy
    const openEditor = (idx) => {
        const r = rules[idx] || { conds: [{ leftPage: currentPageName, leftField: "", comparisonType: {}, isFieldComparison: false, fieldValue: "", joiner: { code: "&&", name: "AND" }, isContains: false }] };
        // Normalize conds: resolve pages/fields metadata if needed later in UI
        const cloned = JSON.parse(JSON.stringify(r));
        setDraftRule(cloned);
        setGlobalFormError("");
        setValidationStarted(false);
        setEditorIndex(idx);
        // Ensure pages fields are fetched for pages used in these conds
        (cloned.conds || []).forEach((c) => {
            if (c.leftPage) handlePageSelection(c.leftPage);
            if (c.rightPage) handlePageSelection(c.rightPage);
        });
    };

    const openEditorForNew = () => {
        const newRule = {
            conds: [
                {
                    leftPage: currentPageName,
                    leftField: "",
                    comparisonType: {},
                    isFieldComparison: false,
                    rightPage: null,
                    rightField: null,
                    fieldValue: "",
                    joiner: { code: "&&", name: "AND" },
                    isContains: false,
                },
            ],
        };
        setDraftRule(newRule);
        setEditorIndex("new");
        setGlobalFormError("");
        setValidationStarted(false);
    };

    const discardAndCloseEditor = () => {
        setDraftRule(null);
        setValidationStarted(false);
        setGlobalFormError("");
        setEditorIndex(null);
    };

    const deleteRuleFromList = (idx) =>
        setRules((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            // sync to redux
            const payload = next
                .map((r) => {
                    const condStr = buildConditionStringFromConds(r.conds || []);
                    return condStr ? { condition: condStr } : null;
                })
                .filter(Boolean);
            dispatch(
                updateSelectedField({
                    visibilityCondition: {
                        ...selectedField?.visibilityCondition,
                        expression: payload,
                    },
                })
            );
            return next;
        });

    const isSubCondComplete = (c) =>
        Boolean(c?.leftPage) &&
        Boolean(c?.leftField) &&
        Boolean(c?.comparisonType?.code) &&
        (c.isFieldComparison ? Boolean(c?.rightPage && c?.rightField) : String(c?.fieldValue ?? "").trim() !== "");

    const isRuleComplete = (r) => (r?.conds || []).every(isSubCondComplete);

    // Add sub-condition (Option B behavior: joiner selection visible after adding row)
    const addSubCondition = () => {
        setValidationStarted(true);
        setDraftRule((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            next.conds.push({
                leftPage: currentPageName,
                leftField: "",
                comparisonType: {},
                isFieldComparison: false,
                rightPage: null,
                rightField: null,
                fieldValue: "",
                joiner: { code: "&&", name: "AND" },
                isContains: false,
            });
            return next;
        });
    };

    const removeSubCondition = (idx) => {
        setDraftRule((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            next.conds = next.conds.filter((_, i) => i !== idx);
            if (!next.conds.length) {
                next.conds.push({
                    leftPage: currentPageName,
                    leftField: "",
                    comparisonType: {},
                    isFieldComparison: false,
                    rightPage: null,
                    rightField: null,
                    fieldValue: "",
                    joiner: { code: "&&", name: "AND" },
                    isContains: false,
                });
            } else {
                // Ensure first cond joiner is always defaulted to &&
                next.conds[0].joiner = { code: "&&", name: "AND" };
            }
            return next;
        });
    };

    const updateSubCond = (index, patch) => {
        setDraftRule((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            next.conds = next.conds.map((c, i) => (i === index ? { ...c, ...patch } : c));
            return next;
        });
    };

    const changeJoinerForCond = (idx, joinCode) => {
        setDraftRule((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            // joiner sits on the cond that comes AFTER the joiner (we follow earlier navigation scheme)
            if (next.conds[idx]) {
                next.conds[idx].joiner = { code: joinCode, name: joinCode === "||" ? "OR" : "AND" };
            }
            return next;
        });
    };

    // Submit draft rule into rules array and sync to redux
    const submitAndClose = () => {
        setValidationStarted(true);
        if (!draftRule || !isRuleComplete(draftRule)) {
            setGlobalFormError(completeAllMsg);
            return;
        }

        const condString = buildConditionStringFromConds(draftRule.conds || []);
        if (!condString) {
            setGlobalFormError(completeAllMsg);
            return;
        }

        if (editorIndex === "new") {
            const next = [...rules, { conds: draftRule.conds }];
            setRules(next);
            const payload = next
                .map((r) => {
                    const cStr = buildConditionStringFromConds(r.conds || []);
                    return cStr ? { condition: cStr } : null;
                })
                .filter(Boolean);
            dispatch(
                updateSelectedField({
                    visibilityCondition: {
                        ...selectedField?.visibilityCondition,
                        expression: payload,
                    },
                })
            );
        } else if (typeof editorIndex === "number") {
            const next = rules.map((r, i) => (i === editorIndex ? { conds: draftRule.conds } : r));
            setRules(next);
            const payload = next
                .map((r) => {
                    const cStr = buildConditionStringFromConds(r.conds || []);
                    return cStr ? { condition: cStr } : null;
                })
                .filter(Boolean);
            dispatch(
                updateSelectedField({
                    visibilityCondition: {
                        ...selectedField?.visibilityCondition,
                        expression: payload,
                    },
                })
            );
        }
        discardAndCloseEditor();
    };

    // UI helpers
    const RuleRow = ({ idx, onEdit, onDelete }) => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "0.75rem",
            }}
        >
            <Tag
                label={`${logicLabel} ${idx + 1}`}
                showIcon={false}
                stroke={true}
                style={{
                    background: "#EFF8FF",
                    height: "fit-content",
                }}
                className={"version-tag"}
                labelStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
            />

            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", whiteSpace: "nowrap" }}>
                <div
                    role="button"
                    title={addDisplayLogicLabel}
                    aria-label={addDisplayLogicLabel}
                    onClick={() => onEdit(idx)}
                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                >
                    {SVG?.Edit ? <SVG.Edit fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} /> : <Button variation="secondary" label={addDisplayLogicLabel} onClick={() => onEdit(idx)} />}
                </div>

                <div
                    role="button"
                    title={deleteRuleLabel}
                    aria-label={deleteRuleLabel}
                    onClick={() => onDelete(idx)}
                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                >
                    {SVG?.Delete ? <SVG.Delete fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} /> : <Button variation="secondary" label={deleteRuleLabel} onClick={() => onDelete(idx)} />}
                </div>
            </div>
        </div>
    );

    // Format cond preview for list (simple)
    const formatRulePreview = (r) => {
        try {
            return r?.conds?.map((c, i) => {
                const leftLabel = c.leftField ? `${c.leftPage}.${c.leftField}` : "(field)";
                const op = c.comparisonType?.code || "?";
                const rightLabel = c.isFieldComparison ? `${c.rightPage}.${c.rightField}` : `${c.fieldValue || "(value)"}`;
                if (i === 0) return `${leftLabel} ${op} ${rightLabel}`;
                return `${c.joiner?.code || "&&"} ${leftLabel} ${op} ${rightLabel}`;
            }).join(" ");
        } catch (e) {
            return "(incomplete)";
        }
    };

    // Don't render until we have the necessary data
    if (!campaignNumber || !flowId) {
        return (
            <Card type="secondary">
                <div style={{ padding: "1rem" }}>
                    <p style={{ opacity: 0.7, margin: 0 }}>{t("LOADING_CONFIGURATION") || "Loading configuration..."}</p>
                </div>
            </Card>
        );
    }

    // ---------- UI ----------
    return (
        <Card type="secondary">
            <div style={{ marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0 }}>{displayLogicLabel}</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                {(!rules || rules.length === 0) ? (
                    <p style={{ opacity: 0.7, margin: 0 }}>{noLogicAddedLabel}</p>
                ) : (
                    <>
                        <RuleRow idx={0} onEdit={openEditor} onDelete={deleteRuleFromList} />
                        {rules.slice(1).map((r, i) => (
                            <React.Fragment key={`logic-block-${i + 1}`}>
                                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <span style={{ background: "#FFFFFFFF", color: "#C84C0E", borderRadius: 4, border: "1px solid #C84C0E", padding: "0.1rem 0.5rem", fontSize: "0.75rem", fontWeight: 600 }}>
                                        {t("OR") || "OR"}
                                    </span>
                                </div>
                                <RuleRow idx={i + 1} onEdit={openEditor} onDelete={deleteRuleFromList} />
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>

            <div>
                <Button variation="secondary" label={addDisplayLogicLabel} onClick={openEditorForNew} icon="Add" style={{ width: "100%" }} />
            </div>

            {/* Editor popup */}
            {showPopUp && draftRule && (
                <BodyPortal>
                    <div className="popup-portal-overlay">
                        <PopUp
                            className="digit-popup--fullscreen popup-editor"
                            type={"default"}
                            heading={addDisplayLogicLabel}
                            children={[
                                <div key="single-rule-editor" style={{ display: "grid", gap: "1rem" }}>
                                    <div style={{ display: "grid", gap: "0.75rem" }}>
                                        {/* list of sub-conditions */}
                                        {draftRule.conds.map((cond, idx) => {
                                            // derive left page/field options
                                            const leftPageSelected = cond.leftPage;
                                            const leftFieldOptions = leftPageSelected ? getFieldOptions(leftPageSelected) : [];
                                            const selectedLeftField = leftFieldOptions.find((f) => f.code === cond.leftField) || cond.leftField;

                                            // right side options when field comparison
                                            const rightPageSelected = cond.rightPage;
                                            // when showing rightFieldOptions, exclude the selectedField (global) as well
                                            const rightFieldOptions = rightPageSelected ? getFieldOptions(rightPageSelected) : [];
                                            const selectedRightField = rightFieldOptions.find((f) => f.code === cond.rightField) || cond.rightField;

                                            const selectedLeftFieldMeta = leftFieldOptions.find((f) => f.code === cond.leftField);
                                            const operatorOptions = getOperatorOptions(selectedLeftFieldMeta);
                                            const selectedOperator = selectedLeftFieldMeta ? getSelectedOperatorFromOptions(selectedLeftFieldMeta, cond.comparisonType) : getSelectedOperatorFromOptions(null, cond.comparisonType);

                                            const isSelect = selectedLeftFieldMeta && (selectedLeftFieldMeta.format === "dropdown" || selectedLeftFieldMeta.format === "radio" || selectedLeftFieldMeta.type === "selection");
                                            const isCheckbox = selectedLeftFieldMeta && isCheckboxField(selectedLeftFieldMeta);
                                            const isDob = selectedLeftFieldMeta && isDobLike(selectedLeftFieldMeta);
                                            const isDate = selectedLeftFieldMeta && (isDatePickerNotDob(selectedLeftFieldMeta));
                                            const isProductVariantOrMultiselectField = selectedLeftFieldMeta && isProductVariantOrMultiselect(selectedLeftFieldMeta);
                                            const useMdms = selectedLeftFieldMeta && (["dropdown", "radio"].includes((selectedLeftFieldMeta.format || "").toLowerCase())) && !!selectedLeftFieldMeta.schemaCode; // Option A behavior

                                            return (
                                                <React.Fragment
                                                    key={`cond-row-${idx}`}
                                                >
                                                    {/* Show centered joiner Tag between conditions */}
                                                    {idx > 0 && (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                margin: "0.5rem 0",
                                                            }}
                                                        >
                                                            <Tag
                                                                type={"monochrome"}
                                                                label={t(
                                                                    cond.joiner?.name ||
                                                                    (cond.joiner?.code ===
                                                                        "&&"
                                                                        ? "AND"
                                                                        : "OR")
                                                                )}
                                                                stroke={true}
                                                            />
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            background: "#FAFAFA",
                                                            border: "1px solid #D6D5D4",
                                                            borderRadius: 4,
                                                            padding: "0.75rem",
                                                            display: "grid",
                                                            gap: "0.5rem",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                gap: "0.75rem",
                                                                alignItems: "flex-end",
                                                            }}
                                                        >
                                                            {/* Left Page */}
                                                            <div
                                                                style={{
                                                                    minWidth: 220,
                                                                    flex: "1 1 240px",
                                                                }}
                                                            >
                                                                <LabelFieldPair
                                                                    vertical
                                                                    removeMargin
                                                                >
                                                                    <p
                                                                        style={{ margin: 0 }}
                                                                    >
                                                                        {selectPageLabel}
                                                                    </p>
                                                                    <div
                                                                        className="digit-field"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <Dropdown
                                                                            showToolTip={true}
                                                                            option={pageOptions}
                                                                            optionKey="displayName"
                                                                            optionCardStyles={{
                                                                                maxHeight: "15vh",
                                                                                overflow: "auto",
                                                                                zIndex: 10000,
                                                                            }}
                                                                            name={`left-page-${idx}`}
                                                                            t={t}
                                                                            select={(e) => {
                                                                                handlePageSelection(
                                                                                    e.code
                                                                                );
                                                                                updateSubCond(
                                                                                    idx,
                                                                                    {
                                                                                        leftPage:
                                                                                            e.code,
                                                                                        leftField: "",
                                                                                        comparisonType: {},
                                                                                        fieldValue:
                                                                                            "",
                                                                                        isFieldComparison: false,
                                                                                        rightPage: null,
                                                                                        rightField: null,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            selected={
                                                                                cond.leftPage
                                                                                    ? pageOptions.find(
                                                                                        (p) =>
                                                                                            p.code ===
                                                                                            cond.leftPage
                                                                                    ) || {
                                                                                        code:
                                                                                            cond.leftPage,
                                                                                        displayName:
                                                                                            cond.leftPage,
                                                                                    }
                                                                                    : {
                                                                                        code:
                                                                                            cond.leftPage,
                                                                                    }
                                                                            }
                                                                        />
                                                                    </div>
                                                                </LabelFieldPair>
                                                            </div>

                                                            {/* Left Field */}
                                                            <div
                                                                style={{
                                                                    minWidth: 260,
                                                                    flex: "1 1 280px",
                                                                }}
                                                            >
                                                                <LabelFieldPair
                                                                    vertical
                                                                    removeMargin
                                                                >
                                                                    <p
                                                                        style={{ margin: 0 }}
                                                                    >
                                                                        {selectFieldLabel}
                                                                    </p>
                                                                    <div
                                                                        className="digit-field"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <Dropdown
                                                                            showToolTip={true}
                                                                            option={
                                                                                cond.leftPage
                                                                                    ? leftFieldOptions
                                                                                    : []
                                                                            }
                                                                            optionKey="label"
                                                                            name={`left-field-${idx}`}
                                                                            t={useT}
                                                                            optionCardStyles={{
                                                                                maxHeight: "15vh",
                                                                                overflow: "auto",
                                                                                zIndex: 10000,
                                                                            }}
                                                                            select={(e) => {
                                                                                const nextOps = getOperatorOptions(
                                                                                    e
                                                                                );
                                                                                const canKeep =
                                                                                    cond
                                                                                        ?.comparisonType
                                                                                        ?.code &&
                                                                                    nextOps.some(
                                                                                        (o) =>
                                                                                            o.code ===
                                                                                            cond
                                                                                                .comparisonType
                                                                                                ?.code
                                                                                    );

                                                                                const isCk = isCheckboxField(
                                                                                    e
                                                                                );
                                                                                updateSubCond(
                                                                                    idx,
                                                                                    {
                                                                                        leftField:
                                                                                            e.code,
                                                                                        isAge: isDob
                                                                                            ? true
                                                                                            : false,
                                                                                        comparisonType: canKeep
                                                                                            ? cond.comparisonType
                                                                                            : isCk
                                                                                                ? nextOps.find(
                                                                                                    (o) =>
                                                                                                        o.code ===
                                                                                                        "=="
                                                                                                )
                                                                                                : {},
                                                                                        fieldValue: isCk
                                                                                            ? [
                                                                                                "true",
                                                                                                "false",
                                                                                            ].includes(
                                                                                                String(
                                                                                                    cond.fieldValue
                                                                                                ).toLowerCase()
                                                                                            )
                                                                                                ? cond.fieldValue
                                                                                                : "false"
                                                                                            : "",
                                                                                    }
                                                                                );
                                                                            }}
                                                                            selected={
                                                                                cond.leftPage &&
                                                                                    cond.leftField
                                                                                    ? leftFieldOptions.find(
                                                                                        (f) =>
                                                                                            f.code ===
                                                                                            cond.leftField
                                                                                    ) || {
                                                                                        code:
                                                                                            cond.leftField,
                                                                                        label:
                                                                                            cond.leftField,
                                                                                    }
                                                                                    : {
                                                                                        code: "",
                                                                                        label: selectPageFirstLabel,
                                                                                    }
                                                                            }
                                                                            disabled={
                                                                                !cond.leftPage
                                                                            }
                                                                        />
                                                                    </div>
                                                                </LabelFieldPair>
                                                            </div>

                                                            {/* Operator */}
                                                            <div
                                                                style={{
                                                                    minWidth: 220,
                                                                    flex: "0 1 220px",
                                                                }}
                                                            >
                                                                <LabelFieldPair
                                                                    vertical
                                                                    removeMargin
                                                                >
                                                                    <p
                                                                        style={{ margin: 0 }}
                                                                    >
                                                                        {comparisonTypeLabel}
                                                                    </p>
                                                                    <div
                                                                        className="digit-field"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <Dropdown
                                                                            showToolTip={true}
                                                                            option={
                                                                                operatorOptions
                                                                            }
                                                                            optionKey="name"
                                                                            optionCardStyles={{
                                                                                maxHeight: "15vh",
                                                                                overflow: "auto",
                                                                                zIndex: 10000,
                                                                            }}
                                                                            name={`op-${idx}`}
                                                                            t={t}
                                                                            select={(e) =>
                                                                                updateSubCond(
                                                                                    idx,
                                                                                    {
                                                                                        comparisonType: e,
                                                                                    }
                                                                                )
                                                                            }
                                                                            selected={
                                                                                selectedOperator
                                                                            }
                                                                            disabled={
                                                                                !cond.leftField
                                                                            }
                                                                        />
                                                                    </div>
                                                                </LabelFieldPair>
                                                            </div>

                                                            {/* Right: either value input OR page+field when isFieldComparison */}
                                                            <div
                                                                style={{
                                                                    minWidth: 260,
                                                                    flex: "1 1 280px",
                                                                }}
                                                            >
                                                                <LabelFieldPair
                                                                    vertical
                                                                    removeMargin
                                                                >
                                                                    <div
                                                                        className="digit-field"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        {/* Toggle for field comparison */}
                                                                        {!isProductVariantOrMultiselectField && (
                                                                            <div
                                                                                style={{
                                                                                    marginBottom:
                                                                                        "0.25rem",
                                                                                }}
                                                                            >
                                                                                <CheckBox
                                                                                    mainClassName={
                                                                                        "app-config-checkbox-main"
                                                                                    }
                                                                                    labelClassName={
                                                                                        "app-config-checkbox-label"
                                                                                    }
                                                                                    onChange={(
                                                                                        v
                                                                                    ) => {
                                                                                        const checked =
                                                                                            typeof v ===
                                                                                                "boolean"
                                                                                                ? v
                                                                                                : !!v
                                                                                                    ?.target
                                                                                                    ?.checked;
                                                                                        updateSubCond(
                                                                                            idx,
                                                                                            {
                                                                                                isFieldComparison: checked,
                                                                                                fieldValue: checked
                                                                                                    ? ""
                                                                                                    : cond.fieldValue,
                                                                                                rightPage: checked
                                                                                                    ? currentPageName
                                                                                                    : null,
                                                                                                rightField: checked
                                                                                                    ? ""
                                                                                                    : null,
                                                                                            }
                                                                                        );
                                                                                        if (checked)
                                                                                            handlePageSelection(
                                                                                                currentPageName
                                                                                            );
                                                                                    }}
                                                                                    value={
                                                                                        !!cond.isFieldComparison
                                                                                    }
                                                                                    label={
                                                                                        compareFieldToggleLabel
                                                                                    }
                                                                                    checked={
                                                                                        !!cond.isFieldComparison
                                                                                    }
                                                                                    isLabelFirst={
                                                                                        false
                                                                                    }
                                                                                    disabled={
                                                                                        !cond.leftField
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {/* If field comparison: show Page + Field dropdowns */}
                                                                        {cond.isFieldComparison ? (
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    gap: "0.5rem",
                                                                                    alignItems:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        minWidth: 160,
                                                                                        flex:
                                                                                            "1 1 160px",
                                                                                    }}
                                                                                >
                                                                                    <Dropdown
                                                                                        showToolTip={true}
                                                                                        option={
                                                                                            pageOptions
                                                                                        }
                                                                                        optionKey="displayName"
                                                                                        name={`right-page-${idx}`}
                                                                                        t={t}
                                                                                        optionCardStyles={{
                                                                                            maxHeight:
                                                                                                "15vh",
                                                                                            overflow:
                                                                                                "auto",
                                                                                            zIndex: 10000,
                                                                                        }}
                                                                                        select={(
                                                                                            e
                                                                                        ) => {
                                                                                            handlePageSelection(
                                                                                                e.code
                                                                                            );
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    rightPage:
                                                                                                        e.code,
                                                                                                    rightField:
                                                                                                        "",
                                                                                                }
                                                                                            );
                                                                                        }}
                                                                                        selected={
                                                                                            cond.rightPage
                                                                                                ? pageOptions.find(
                                                                                                    (p) =>
                                                                                                        p.code ===
                                                                                                        cond.rightPage
                                                                                                ) || {
                                                                                                    code:
                                                                                                        cond.rightPage,
                                                                                                    displayName:
                                                                                                        cond.rightPage,
                                                                                                }
                                                                                                : {}
                                                                                        }
                                                                                        disabled={
                                                                                            !cond.leftField
                                                                                        }
                                                                                    />
                                                                                </div>

                                                                                <div
                                                                                    style={{
                                                                                        minWidth: 160,
                                                                                        flex:
                                                                                            "1 1 160px",
                                                                                    }}
                                                                                >
                                                                                    <Dropdown
                                                                                        showToolTip={true}
                                                                                        option={
                                                                                            cond.rightPage
                                                                                                ? rightFieldOptions
                                                                                                : []
                                                                                        }
                                                                                        optionKey="label"
                                                                                        name={`right-field-${idx}`}
                                                                                        t={useT}
                                                                                        optionCardStyles={{
                                                                                            maxHeight:
                                                                                                "15vh",
                                                                                            overflow:
                                                                                                "auto",
                                                                                            zIndex: 10000,
                                                                                        }}
                                                                                        select={(e) =>
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    rightField:
                                                                                                        e.code,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        selected={
                                                                                            cond.rightPage &&
                                                                                                cond.rightField
                                                                                                ? rightFieldOptions.find(
                                                                                                    (f) =>
                                                                                                        f.code ===
                                                                                                        cond.rightField
                                                                                                ) || {
                                                                                                    code:
                                                                                                        cond.rightField,
                                                                                                    label:
                                                                                                        cond.rightField,
                                                                                                }
                                                                                                : {
                                                                                                    code:
                                                                                                        "",
                                                                                                    label: selectPageFirstLabel,
                                                                                                }
                                                                                        }
                                                                                        disabled={
                                                                                            !cond.rightPage
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                {/* Value input handling: when schemaCode exists & format is dropdown/radio -> use MdmsValueDropdown (Option A) */}
                                                                                {useMdms ? (
                                                                                    <MdmsValueDropdown
                                                                                        showToolTip={true}
                                                                                        schemaCode={
                                                                                            selectedLeftFieldMeta?.schemaCode
                                                                                        }
                                                                                        value={
                                                                                            cond.fieldValue
                                                                                        }
                                                                                        onChange={(
                                                                                            v
                                                                                        ) =>
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    fieldValue: v,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        t={t}
                                                                                    />
                                                                                ) : isCheckbox ? (
                                                                                    <CheckBox
                                                                                        mainClassName={
                                                                                            "app-config-checkbox-main"
                                                                                        }
                                                                                        labelClassName={
                                                                                            "app-config-checkbox-label"
                                                                                        }
                                                                                        onChange={(
                                                                                            v
                                                                                        ) => {
                                                                                            const checkedVal =
                                                                                                typeof v ===
                                                                                                    "boolean"
                                                                                                    ? v
                                                                                                    : !!v
                                                                                                        ?.target
                                                                                                        ?.checked;
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    fieldValue: checkedVal
                                                                                                        ? "true"
                                                                                                        : "false",
                                                                                                }
                                                                                            );
                                                                                        }}
                                                                                        value={
                                                                                            String(
                                                                                                cond.fieldValue
                                                                                            ).toLowerCase() ===
                                                                                            "true"
                                                                                        }
                                                                                        label={
                                                                                            t(
                                                                                                selectedLeftFieldMeta?.label
                                                                                            ) ||
                                                                                            selectedLeftFieldMeta?.label ||
                                                                                            ""
                                                                                        }
                                                                                        isLabelFirst={
                                                                                            false
                                                                                        }
                                                                                        disabled={
                                                                                            !cond.leftField
                                                                                        }
                                                                                    />
                                                                                ) : isDob ? (
                                                                                    <TextInput
                                                                                        type="number"
                                                                                        populators={{
                                                                                            name: `months-${editorIndex}-${idx}`,
                                                                                        }}
                                                                                        placeholder={
                                                                                            t(
                                                                                                "ENTER_INTEGER_VALUE"
                                                                                            ) ||
                                                                                            enterValueLabel
                                                                                        }
                                                                                        value={
                                                                                            cond.fieldValue
                                                                                        }
                                                                                        onChange={(
                                                                                            event
                                                                                        ) =>
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    isAge: true, // 👈 IMPORTANT
                                                                                                    isFieldComparison: false,
                                                                                                    fieldValue: sanitizeIntegerInput(
                                                                                                        event
                                                                                                            .target
                                                                                                            .value
                                                                                                    ),
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                ) : isDate ? (
                                                                                    <TextInput
                                                                                        type="date"
                                                                                        name={`date-${idx}`}
                                                                                        className="appConfigLabelField-Input"
                                                                                        value={toISOFromDDMMYYYY(
                                                                                            cond.fieldValue
                                                                                        )}
                                                                                        populators={{
                                                                                            newDateFormat: true,
                                                                                            useFixedPosition: true
                                                                                        }}
                                                                                        onChange={(
                                                                                            d
                                                                                        ) =>
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    fieldValue: toDDMMYYYY(
                                                                                                        d
                                                                                                    ),
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            !cond.leftField
                                                                                        }
                                                                                    />
                                                                                ) : isSelect &&
                                                                                    !useMdms ? (
                                                                                    // select from enum values
                                                                                    (() => {
                                                                                        const enumOptions = (
                                                                                            selectedLeftFieldMeta?.enums ||
                                                                                            []
                                                                                        ).map(
                                                                                            (en) => ({
                                                                                                code: String(
                                                                                                    en.code
                                                                                                ),
                                                                                                name:
                                                                                                    en.name ||
                                                                                                    en.code,
                                                                                            })
                                                                                        );
                                                                                        const selectedEnum = enumOptions.find(
                                                                                            (eo) =>
                                                                                                eo.code ===
                                                                                                String(
                                                                                                    cond.fieldValue
                                                                                                )
                                                                                        );
                                                                                        return (
                                                                                            <Dropdown
                                                                                                showToolTip={true}
                                                                                                option={
                                                                                                    enumOptions
                                                                                                }
                                                                                                optionKey="name"
                                                                                                name={`enum-${idx}`}
                                                                                                optionCardStyles={{
                                                                                                    maxHeight:
                                                                                                        "15vh",
                                                                                                    overflow:
                                                                                                        "auto",
                                                                                                    zIndex: 10000,
                                                                                                }}
                                                                                                t={useT}
                                                                                                select={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    updateSubCond(
                                                                                                        idx,
                                                                                                        {
                                                                                                            fieldValue:
                                                                                                                e.code,
                                                                                                        }
                                                                                                    )
                                                                                                }
                                                                                                selected={
                                                                                                    selectedEnum
                                                                                                }
                                                                                                disabled={
                                                                                                    !cond.leftField
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    })()
                                                                                ) : isProductVariantOrMultiselectField &&
                                                                                    productVariants?.length >
                                                                                    0 ? (
                                                                                    (() => {
                                                                                        const selectedProductVariant = productVariants.find(
                                                                                            (eo) =>
                                                                                                eo.productVariantId ===
                                                                                                String(
                                                                                                    cond.fieldValue
                                                                                                )
                                                                                        );
                                                                                        return (
                                                                                            <Dropdown
                                                                                                showToolTip={true}
                                                                                                option={
                                                                                                    productVariants
                                                                                                }
                                                                                                optionKey="name"
                                                                                                optionCardStyles={{
                                                                                                    maxHeight:
                                                                                                        "15vh",
                                                                                                    overflow:
                                                                                                        "auto",
                                                                                                    zIndex: 10000,
                                                                                                }}
                                                                                                name={`product-variant-${idx}`}
                                                                                                t={t}
                                                                                                select={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    updateSubCond(
                                                                                                        idx,
                                                                                                        {
                                                                                                            fieldValue:
                                                                                                                e.code,
                                                                                                        }
                                                                                                    )
                                                                                                }
                                                                                                selected={
                                                                                                    selectedProductVariant
                                                                                                }
                                                                                                disabled={
                                                                                                    !cond.leftField
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    })()
                                                                                ) : (
                                                                                    <TextInput
                                                                                        type={
                                                                                            isNumericField(
                                                                                                selectedLeftFieldMeta
                                                                                            )
                                                                                                ? "number"
                                                                                                : "text"
                                                                                        }
                                                                                        placeholder={
                                                                                            enterValueLabel
                                                                                        }
                                                                                        value={
                                                                                            cond.fieldValue
                                                                                        }
                                                                                        onChange={(
                                                                                            ev
                                                                                        ) => {
                                                                                            const v =
                                                                                                ev?.target
                                                                                                    ?.value ??
                                                                                                "";
                                                                                            updateSubCond(
                                                                                                idx,
                                                                                                {
                                                                                                    fieldValue: isNumericField(
                                                                                                        selectedLeftFieldMeta
                                                                                                    )
                                                                                                        ? sanitizeIntegerInput(
                                                                                                            v
                                                                                                        )
                                                                                                        : v,
                                                                                                }
                                                                                            );
                                                                                        }}
                                                                                        disabled={
                                                                                            !cond.leftField
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </LabelFieldPair>
                                                            </div>
                                                        </div>

                                                        {/* Footer row below each condition - only show Remove button for non-last conditions */}
                                                        {idx !==
                                                            draftRule.conds.length -
                                                            1 && (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent:
                                                                            "flex-end",
                                                                        alignItems: "center",
                                                                        marginTop: "0.5rem",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: "0.25rem",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() =>
                                                                            removeSubCondition(
                                                                                idx
                                                                            )
                                                                        }
                                                                        title={
                                                                            removeConditionLabel
                                                                        }
                                                                        aria-label={
                                                                            removeConditionLabel
                                                                        }
                                                                        role="button"
                                                                    >
                                                                        <SVG.Delete
                                                                            fill={"#C84C0E"}
                                                                            width={"1.25rem"}
                                                                            height={"1.25rem"}
                                                                        />
                                                                        <span
                                                                            style={{
                                                                                color: "#C84C0E",
                                                                                fontSize:
                                                                                    "0.875rem",
                                                                                fontWeight: 500,
                                                                            }}
                                                                        >
                                                                            {removeConditionLabel}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}

                                        {/* Add Condition button after the last condition */}
                                        <div style={{ marginTop: "0.5rem" }}>
                                            <Button variation="secondary" label={addConditionLabel} onClick={addSubCondition} />
                                        </div>

                                        {/* show any form-level error here */}
                                        {globalFormError ? (
                                            <div
                                                style={{
                                                    border: "1px solid #FCA5A5",
                                                    background: "#FEF2F2",
                                                    color: "#B91C1C",
                                                    borderRadius: 6,
                                                    padding: "0.5rem 0.75rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "0.75rem",
                                                }}
                                            >
                                                <span>{globalFormError}</span>
                                                <SVG.Close
                                                    width={"1.1rem"}
                                                    height={"1.1rem"}
                                                    fill={"#7F1D1D"}
                                                    onClick={() => setGlobalFormError("")}
                                                    tabIndex={0}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>,
                            ]}
                            footerChildren={
                                [
                                    <Button
                                        key="close"
                                        type={"button"}
                                        size={"large"}
                                        variation={"secondary"}
                                        label={closeLabel}
                                        onClick={discardAndCloseEditor}
                                    />,
                                    <Button
                                        key="submit"
                                        type={"button"}
                                        size={"large"}
                                        variation={"primary"}
                                        label={submitLabel}
                                        onClick={submitAndClose}
                                        disabled={!isRuleComplete(draftRule)}
                                    />
                                ]
                                // <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", width: "100%" }}>
                                //     <Button variation="tertiary" label={closeLabel} onClick={discardAndCloseEditor} />
                                //     <Button variation="primary" label={submitLabel} onClick={submitAndClose} />
                                // </div>
                            }
                            onOverlayClick={discardAndCloseEditor}
                            onClose={discardAndCloseEditor}
                        />
                    </div>
                </BodyPortal>
            )}
        </Card>
    );
}

export default NewDependentFieldWrapper;
