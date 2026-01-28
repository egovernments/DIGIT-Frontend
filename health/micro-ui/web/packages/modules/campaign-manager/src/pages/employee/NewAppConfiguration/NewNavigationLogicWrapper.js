import React, { useEffect, useMemo, useState, useCallback,Fragment } from "react";
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
    FieldV1,
} from "@egovernments/digit-ui-components";
import ReactDOM from "react-dom";
import { useCustomT, useCustomTranslate } from "./hooks/useCustomT";
import { updatePageConditionalNav } from "./redux/remoteConfigSlice";
import { fetchFlowPages, clearFlowPages } from "./redux/flowPagesSlice";
import { fetchPageFields } from "./redux/pageFieldsSlice";

/** Portal so the popup escapes side panels and fills the viewport layer */
function BodyPortal({ children }) {
    if (typeof document === "undefined") return null;
    return ReactDOM.createPortal(children, document.body);
}

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
            optionCardStyles={{ maxHeight: "15vh", overflow: "auto", zIndex: 10000 }}
            t={t}
            select={(e) => onChange(e.code)}
            disabled={isLoading || !module || !master}
            selected={selectedOption}
            showToolTip={true}
            isSearchable={true}
        />
    );
}

function NewNavigationLogicWrapper({ t, targetPages = []}) {
    const customT = useCustomTranslate();
    const dispatch = useDispatch();
    const tenantId = Digit?.ULBService?.getCurrentTenantId?.() || "mz";

    // Get data from Redux
    const currentData = useSelector((state) => state.remoteConfig.currentData);
    const flowPages = useSelector((state) => state.flowPages.pages);
    const flowPagesStatus = useSelector((state) => state.flowPages.status);
    const pageConfigs = useSelector((state) => state.pageFields.byPage);
    const pageFieldsLoading = useSelector((state) => state.pageFields.loadingPages);

    const moduleName = "HCM-ADMIN-CONSOLE";
    const masterName = "AppFlowConfig";
    const flowId = currentData?.module || "REGISTRATION";
    const campaignNumber = currentData?.project || "";
    const currentPageName = currentData?.page || currentData?.name || currentData?.pageName;


    // Clear flow pages when flowId or campaignNumber changes

    useEffect(() => {
        dispatch(clearFlowPages());
    }, [dispatch, flowId, campaignNumber]);
    // Fetch flows on mount or when campaign changes
    useEffect(() => {
        if (flowPagesStatus === 'idle' && campaignNumber) {
            dispatch(fetchFlowPages({
                tenantId,
                campaignNumber,
                flowId,
                moduleName,
                masterName,
            }));
        }
    }, [dispatch, flowPagesStatus, tenantId, campaignNumber, flowId, moduleName, masterName]);

    // Fetch current page fields if not already loaded
    useEffect(() => {
        if (currentPageName && flowId && campaignNumber &&
            !pageConfigs[currentPageName] && !pageFieldsLoading[currentPageName]) {
            dispatch(fetchPageFields({
                tenantId,
                flow: currentData?.flow,
                campaignNumber,
                pageName: currentPageName,
            }));
        }
    }, [dispatch, currentPageName, flowId, campaignNumber, pageConfigs, pageFieldsLoading, tenantId]);

    // ----- labels -----
    const navLogicTitle = t("NAVIGATION_LOGIC") || "Navigation Logic";
    const addRuleLabel = t("ADD_NAVIGATION_LOGIC") || "Add Rule";
    const editLabel = t("EDIT") || "Edit";
    const deleteRuleLabel = t("HCM_REMOVE_RULE") || "Delete Rule";
    const noRulesYet = t("HCM_NO_RULES_YET") || "No navigation rules added yet.";
    const joinWithLabel = t("HCM_JOIN_WITH") || "Join with";
    const selectFieldLabel = t("HCM_SELECT_FIELD") || "Select Field";
    const comparisonTypeLabel = t("HCM_COMPARISION_TYPE") || "Comparison";
    const selectValueLabel = t("HCM_SELECT_VALUE") || "Select Value";
    const enterValueLabel = t("ENTER_VALUE") || "Enter value";
    const targetPageLabel = t("HCM_TARGET_PAGE") || "Navigate to page";
    const removeConditionLabel = t("REMOVE_CONDITION") || "Delete Condition";
    const addConditionLabel = t("ADD_CONDITION") || "Add Condition";
    const closeLabel = t("CLOSE") || "Cancel";
    const submitLabel = t("CONFIRM_NAVIGATION_LOGIC") || "Submit";
    const andText = t("AND") || "And";
    const orText = t("OR") || "Or";
    const incompleteExprLabel = t("INCOMPLETE_EXPRESSION") || "(incomplete)";
    const completeAllMsg =
        t("PLEASE_COMPLETE_ALL_CONDITIONS") ||
        "Please complete all conditions and select a target page before confirming.";
    const logicLabel = t("HCM_LOGIC") || "Logic";

    // ----- constants / helpers -----
    const LOGICALS = [
        { code: "&&", name: t("AND") || "AND" },
        { code: "||", name: t("OR") || "OR" },
    ];
    const ALL_OPERATOR_OPTIONS = [
        { code: "==", name: t("EQUALS_TO") || "equals to" },
        { code: "!=", name: t("NOT_EQUALS_TO") || "not equals to" },
        { code: ">=", name: t("GREATER_THAN_OR_EQUALS_TO") || "greater than or equals to" },
        { code: "<=", name: t("LESS_THAN_OR_EQUALS_TO") || "less than or equals to" },
        { code: ">", name: t("GREATER_THAN") || "greater than" },
        { code: "<", name: t("LESS_THAN") || "less than" },
    ];

    const PARSE_OPERATORS = useMemo(
        () => ["!=", ">=", "<=", "==", ">", "<"].sort((a, b) => b.length - a.length),
        []
    );

    // Get current page fields from currentData or pageConfigs
    const currentPageObj = useMemo(() => {
        if (currentData?.body?.[0]) {
            return currentData.body[0];
        }
        if (currentPageName && pageConfigs[currentPageName]) {
            return pageConfigs[currentPageName].body?.[0];
        }
        return { fields: [] };
    }, [currentData, currentPageName, pageConfigs]);

    // All fields from current page (no order restriction, skip template fields)
    const currentPageFieldOptions = useMemo(() => {
        const fields = currentPageObj?.fields || [];
        return fields
            .filter((f) => f?.type !== "template" && f?.includeInForm !== false)
            .map((f) => ({
                code: f.jsonPath || f.fieldName || f.id,
                name: f.jsonPath || f.fieldName || f.id,
                label: f.label,
                format: f.format || f.appType,
                type: f.type || f.datatype || f.format || "string",
                enums: f.dropDownOptions || f.enums || f.options || [],
                schemaCode: f.schemaCode,
            }));
    }, [currentPageObj]);

    // Get existing conditional navigation
    const existingConditional = useMemo(() => {
        return Array.isArray(currentData?.conditionalNavigateTo)
            ? currentData.conditionalNavigateTo
            : [];
    }, [currentData]);

    // ---- date helpers ----
    const isDobLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return fmt === "dob";
    };

    const isDatePickerNotDob = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return (fmt === "date" || fmt === "datepicker") && fmt !== "dob";
    };

    const toDDMMYYYY = (iso) => {
        // Handle both event objects and direct values
        const dateValue = iso?.target?.value || iso;
        if (!dateValue) return "";

        // Check if it's an ISO timestamp string (contains 'T')
        const dateStr = String(dateValue);

        if (dateStr.includes('T')) {
            // It's an ISO timestamp - convert to local date to avoid timezone issues
            // Create a Date object and extract local date parts
            const dateObj = new Date(dateStr);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');

            return `${day}/${month}/${year}`;
        }

        // Simple YYYY-MM-DD format
        const [y, m, d] = dateStr.split("-");
        if (!y || !m || !d) return "";
        return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    };

    const toISOFromDDMMYYYY = (ddmmyyyy) => {
        if (!ddmmyyyy) return "";
        const [d, m, y] = String(ddmmyyyy).split("/");
        if (!y || !m || !d) return "";
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    };

    const getFieldMeta = (fieldCode) =>
        currentPageObj?.fields?.find((f) => (f.jsonPath || f.fieldName || f.id) === fieldCode) || null;

    const isStringLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        if (fmt === "dropdown" || fmt === "radio" || fmt === "select" || tpe === "selection") return true;
        return ["string", "text", "textinput", "textarea"].includes(tpe);
    };

    const isCheckboxField = (field) => {
        const tpe = (field?.format || "").toLowerCase();
        return tpe === "checkbox";
    };

    const isNumericLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return (
            ["number", "numeric", "integer"].includes(tpe) ||
            ["number", "numeric", "integer"].includes(fmt)
        );
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
        if (isCheckboxField(field)) {
            return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");
        }
        if (isDobLike(field) || isDatePickerNotDob(field) || isNumericLike(field)) {
            return ALL_OPERATOR_OPTIONS;
        }
        if (!field || isStringLike(field))
            return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");
        return ALL_OPERATOR_OPTIONS;
    };

    // ----- parse / serialize expression strings -----
    const parseSingle = (expression = "") => {
        for (const operator of PARSE_OPERATORS) {
            const i = expression.indexOf(operator);
            if (i !== -1) {
                const left = expression.slice(0, i).trim();
                const right = expression.slice(i + operator.length).trim();

                // handle calculateAgeInMonths(<page>.<field>)
                let leftPath = left;
                const ageFn = "calculateAgeInMonths(";
                if (left.startsWith(ageFn) && left.endsWith(")")) {
                    leftPath = left.slice(ageFn.length, -1);
                }

                const parts = (leftPath || "").split(".").map((s) => (s || "").trim());
                const fieldCode = parts.length > 1 ? parts.slice(1).join(".") : parts[0];

                return {
                    selectedField: fieldCode ? { code: fieldCode, name: fieldCode } : {},
                    comparisonType: { code: operator, name: operator },
                    fieldValue: (right || "").trim(),
                };
            }
        }
        return { selectedField: {}, comparisonType: {}, fieldValue: "" };
    };

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
            let nextOp;
            let nextIdx;
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

    const serializeSingle = (c) => {
        if (!currentPageName) return "";
        const field = getFieldMeta(c?.selectedField?.code);
        if (!c?.selectedField?.code || !c?.comparisonType?.code) return "";

        if (field && isDobLike(field)) {
            const months = String(c?.fieldValue ?? "").trim();
            if (months === "") return "";
            const left = `calculateAgeInMonths(${currentPageName}.${c.selectedField.code})`;
            return `${left}${c.comparisonType.code}${months}`;
        }

        if (field && isDatePickerNotDob(field)) {
            const ddmmyyyy = String(c?.fieldValue ?? "").trim();
            if (ddmmyyyy === "") return "";
            return `${currentPageName}.${c.selectedField.code}${c.comparisonType.code}${ddmmyyyy}`;
        }

        if (c?.fieldValue === "") return "";
        return `${currentPageName}.${c.selectedField.code}${c.comparisonType.code}${c.fieldValue}`;
    };

    const serializeAll = (conds) => {
        const out = [];
        conds.forEach((c, i) => {
            const seg = serializeSingle(c);
            if (!seg) return;
            if (i > 0) out.push(c.joiner?.code || "&&");
            out.push(seg);
        });
        return out.join(" ");
    };

    const initialEmptyCondition = () => ({
        selectedField: {},
        comparisonType: {},
        fieldValue: "",
        joiner: { code: "&&", name: "AND" },
    });

    const initialEmptyRule = () => ({
        conds: [initialEmptyCondition()],
        targetPage: {},
    });

    // // ---------- normalization helpers ----------
    // const allPageOptions = useMemo(() => {
    //     const seen = new Set();
    //     const list = [];
    //     const exclude = new Set([currentPageName]); // don't include current page
    //     const add = (p) => {
    //         if (!p?.name) return;
    //         if (exclude.has(p.name)) return;
    //         if (seen.has(p.name)) return;
    //         seen.add(p.name);
    //         list.push({ code: p.name, name: p.name, type: p.type });
    //     };
    //     flowPages.forEach(add);
    //     return list;
    // }, [flowPages, currentPageName]);

    //Temporary fix for allPageOptions to include only decimal order pages like 4.1, 4.2 etc. Till Navigation through AppConfig is implemented in Flutter App
    const allPageOptions = useMemo(() => {
        const seen = new Set();
        const list = [];
        const exclude = new Set([currentPageName]); // don't include current page

        const add = (p) => {
            if (!p?.name) return;
            if (exclude.has(p.name)) return;
            if (seen.has(p.name)) return;
            seen.add(p.name);
            list.push({ code: p.name.split('.')?.[1], name: p.name, type: p.type, order: p.order });
        };

        // Find the current flow data
        const currentFlow = flowPages?.find(flow => flow.flowId === currentData?.flow);

        if (currentFlow?.pages) {
            // Filter pages with decimal orders (4.1, 4.2, etc.)
            const decimalPages = currentFlow.pages.filter(page => {
                // Check if order is a decimal number (has a decimal point)
                return page.order && !Number.isInteger(page.order);
            });

            // Add only decimal order pages to the options
            decimalPages.forEach(add);
        }

        return list;
    }, [flowPages, currentPageName, currentData?.flow]);



    const findFieldOptionByCode = (code) =>
        currentPageFieldOptions.find((f) => f.code === code) || (code ? { code, name: code, label: code } : {});

    const findPageOptionByCode = (code) =>
        allPageOptions.find((p) => p.code === code) ||
        (code ? { code, name: code, type: flowPages.find((p) => p?.name === code)?.type } : {});

    const normalizeRule = (r) => {
        const conds = (r?.conds || []).map((c, idx) => {
            const normalizedField = c?.selectedField?.code ? findFieldOptionByCode(c.selectedField.code) : {};
            return {
                ...c,
                selectedField: normalizedField,
                joiner: idx === 0 ? { code: "&&", name: "AND" } : c.joiner || { code: "&&", name: "AND" },
            };
        });
        const name = r?.targetPage?.code || r?.targetPage?.name || "";
        return {
            ...r,
            conds: conds.length ? conds : [initialEmptyCondition()],
            targetPage: name ? findPageOptionByCode(name) : {},
        };
    };

    // ----- seed & syncing -----
    const makeRulesFromExisting = () => {
        const existing = existingConditional;
        if (!existing.length) return [];
        const seeded = existing.map((r) => {
            const expr = (r?.condition || "").trim();
            const tokens = tokenize(expr);
            let conds = [];
            if (!tokens.length) {
                conds = [initialEmptyCondition()];
            } else {
                let pendingJoin = "&&";
                tokens.forEach((t) => {
                    if (t.type === "op") pendingJoin = t.value;
                    else {
                        const base = parseSingle(t.value);
                        conds.push(
                            conds.length === 0
                                ? { ...base, joiner: { code: "&&", name: "AND" } }
                                : { ...base, joiner: { code: pendingJoin, name: pendingJoin === "||" ? "OR" : "AND" } }
                        );
                    }
                });
                if (!conds.length) conds = [initialEmptyCondition()];
            }
            const name = r?.navigateTo?.name || "";
            return {
                conds,
                targetPage: name ? { code: name, name } : {},
            };
        });
        return seeded.map(normalizeRule);
    };

    const [rules, setRules] = useState(() => makeRulesFromExisting());
    const [editorIndex, setEditorIndex] = useState(null);
    const [globalFormError, setGlobalFormError] = useState("");
    const [validationStarted, setValidationStarted] = useState(false);

    const showPopUp = editorIndex !== null;

    useEffect(() => {
        if (!showPopUp) {
            const fresh = makeRulesFromExisting();
            setRules(fresh);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(existingConditional), showPopUp]);

    // clear errors when popup closes
    useEffect(() => {
        if (!showPopUp) {
            if (globalFormError) setGlobalFormError("");
            if (validationStarted) setValidationStarted(false);
        }
    }, [showPopUp, globalFormError, validationStarted]);

    const openEditor = (idx) => {
        setRules((prev) => prev.map((r, i) => (i === idx ? normalizeRule(r) : r)));
        setGlobalFormError("");
        setValidationStarted(false);
        setEditorIndex(idx);
    };

    const addRule = () => {
        setGlobalFormError("");
        setValidationStarted(false);
        setRules((prev) => {
            const next = [...prev, initialEmptyRule()];
            const normalized = next.map((r, i) => (i === next.length - 1 ? normalizeRule(r) : r));
            setEditorIndex(normalized.length - 1);
            return normalized;
        });
    };

    const discardAndCloseEditor = () => {
        setRules(makeRulesFromExisting());
        setGlobalFormError("");
        setValidationStarted(false);
        setEditorIndex(null);
    };

    const updateRule = (idx, patch) =>
        setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

    const deleteRuleFromList = (idx) =>
        setRules((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            if (editorIndex !== null) {
                if (idx === editorIndex) setEditorIndex(null);
                else if (idx < editorIndex) setEditorIndex(editorIndex - 1);
            }
            syncParent(next);
            return next;
        });

    // ----- condition operations -----
    const updateCond = (ruleIdx, condIdx, patch) => {
        setRules((prev) =>
            prev.map((r, i) =>
                i !== ruleIdx
                    ? r
                    : { ...r, conds: r.conds.map((c, j) => (j === condIdx ? { ...c, ...patch } : c)) }
            )
        );

    }

    const changeJoiner = (ruleIdx, condIdx, joinCode) =>
        setRules((prev) =>
            prev.map((r, i) =>
                i !== ruleIdx
                    ? r
                    : {
                        ...r,
                        conds: r.conds.map((c, j) =>
                            j === condIdx
                                ? { ...c, joiner: { code: joinCode, name: joinCode === "||" ? "OR" : "AND" } }
                                : c
                        ),
                    }
            )
        );

    const addCondition = (ruleIdx) =>
        setValidationStarted(true) ||
        setRules((prev) =>
            prev.map((r, i) => (i === ruleIdx ? { ...r, conds: [...r.conds, initialEmptyCondition()] } : r))
        );

    const removeCondition = (ruleIdx, condIdx) =>
        setRules((prev) => {
            const next = prev.map((r, i) => {
                if (i !== ruleIdx) return r;
                const nextConds = r.conds.filter((_, j) => j !== condIdx);
                if (!nextConds.length) nextConds.push(initialEmptyCondition());
                nextConds[0] = { ...nextConds[0], joiner: { code: "&&", name: "AND" } };
                return { ...r, conds: nextConds };
            });
            syncParent(next);
            return next;
        });

    // ----- validation -----
    const isCondComplete = (c) =>
        Boolean(c?.selectedField?.code) &&
        Boolean(c?.comparisonType?.code) &&
        String(c?.fieldValue ?? "").trim() !== "";

    const isRuleComplete = (r) =>
        r?.conds?.every(isCondComplete) &&
        Boolean(r?.targetPage?.code || r?.targetPage?.name);

    const canSubmit = showPopUp && editorIndex !== null ? isRuleComplete(rules[editorIndex]) : false;

    useEffect(() => {
        if (!showPopUp || editorIndex === null) return;
        if (globalFormError && isRuleComplete(rules[editorIndex])) {
            setGlobalFormError("");
        }
    }, [rules, showPopUp, editorIndex, globalFormError]);

    // ----- payload builder & submit -----
    const buildPayload = (rs) =>
        rs
            .map((r) => {
                const name = r.targetPage?.code || r.targetPage?.name || "";
                const page =
                    allPageOptions.find((p) => p.code === name) ||
                    flowPages.find((p) => p?.name === name);
                const navigateType = page?.type === "template" ? "template" : "form";

                return {
                    condition: serializeAll(r.conds),
                    navigateTo: {
                        name,
                        type: navigateType,
                    },
                };
            })
            .filter((r) => r.condition && r.navigateTo.name);

    const syncParent = (nextRules) => {
        const payload = buildPayload(nextRules);
        dispatch(updatePageConditionalNav({ data: payload }));
    };

    const submitAndClose = () => {
        setValidationStarted(true);
        const isValid = editorIndex !== null && isRuleComplete(rules[editorIndex]);
        if (!isValid) {
            setGlobalFormError(completeAllMsg);
            return;
        }
        const next = buildPayload(rules);
        dispatch(updatePageConditionalNav({ data: next }));
        setGlobalFormError("");
        setValidationStarted(false);
        setEditorIndex(null);
    };

    // ----- display helpers -----
    const formatConditionLabel = (c) => {
        if (!c?.selectedField?.code) return incompleteExprLabel;
        const field = getFieldMeta(c.selectedField.code);
        const fieldLabel = field?.label ? t(field.label) || field.label : c.selectedField.code;
        const op = c?.comparisonType?.code || "";
        let valueText = c?.fieldValue || "";
        valueText = `${valueText}`.replace(/[()]/g, "");
        return `${customT(fieldLabel)} ${t(op)} ${field?.format === "dropdown" ||
                field?.format === "radio" ||
                field?.format === "select" ||
                field?.type === "selection" ||
                field?.type === "checkbox"
                ? customT(valueText)
                : valueText
            }`.trim();
    };

    const formatRuleSummary = (_rule, idx) => `${logicLabel} ${idx + 1}`;

    // Don't render until we have the necessary data
    if (!campaignNumber || !flowId || !currentPageName) {
        return (
            <Card type="secondary">
                <div style={{ padding: "1rem" }}>
                    <p style={{ opacity: 0.7, margin: 0 }}>
                        {t("LOADING_CONFIGURATION") || "Loading configuration..."}
                    </p>
                </div>
            </Card>
        );
    }

    // Skip rendering for template pages
    if (currentData?.type === "template") {
        return null;
    }

    // ---- small UI helpers to render the outside list with OR separators ----
    const JoinerRow = () => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Tag
                type={"monochrome"}
                label={`(${orText})`}
            />
            {/* <span
                style={{
                    background:"#EFF8FF",
                    height: "fit-content",
                }}
            >
                {orText.toUpperCase()}
            </span> */}
        </div>
    );

    const RuleRow = ({ idx }) => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "0.75rem",
            }}
        >
            <Tag
                label={formatRuleSummary(rules[idx], idx)}
                showIcon={false}
                stroke={true}
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #C84C0E",
                    borderRadius: 8,
                    height: "fit-content",
                    padding: "0.25rem 0.5rem",
                    width: "100%",
                    maxWidth: "100%",
                }}
                className={"version-tag"}
                labelStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
            />

            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", whiteSpace: "nowrap" }}>
                <div
                    role="button"
                    title={navLogicTitle}
                    aria-label={navLogicTitle}
                    onClick={() => openEditor(idx)}
                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                >
                    {SVG?.Edit ? (
                        <SVG.Edit fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} />
                    ) : (
                        <Button variation="secondary" label={navLogicTitle} title={navLogicTitle} onClick={() => openEditor(idx)} />
                    )}
                </div>

                {idx !== 0 && (<div
                    role="button"
                    title={deleteRuleLabel}
                    aria-label={deleteRuleLabel}
                    onClick={() => deleteRuleFromList(idx)}
                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                >
                    <SVG.Delete fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} />
                </div>)}
            </div>
        </div>
    );

    // ----- UI -----
    return (
        <Card type="secondary">
            {/* Title */}
            <div style={{ marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0 }}>{navLogicTitle}</h3>
            </div>

            {/* Rules list separated by centered OR */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                {rules.length === 0 ? (
                    <p style={{ opacity: 0.7, margin: 0 }}>{noRulesYet}</p>
                ) : (
                    <>
                        <RuleRow idx={0} />
                        {rules.slice(1).map((_, i) => (
                            <React.Fragment key={`rule-with-or-${i + 1}`}>
                                <JoinerRow />
                                <RuleRow idx={i + 1} />
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>

            {/* Add Logic button */}
            <div>
                <Button
                    variation="secondary"
                    label={addRuleLabel}
                    title={addRuleLabel}
                    onClick={addRule}
                    icon="Add"
                    style={{ width: "100%" }}
                />
            </div>

            {/* Single-rule editor popup */}
            {showPopUp && editorIndex !== null && rules[editorIndex] && (
                <BodyPortal>
                    <div className="popup-portal-overlay">
                        <PopUp
                            className="digit-popup--fullscreen popup-editor"
                            type={"default"}
                            heading={navLogicTitle}
                            children={[
                                <div key="single-rule-editor" style={{ display: "grid", gap: "1rem" }}>
                                    {(() => {
                                        const rule = rules[editorIndex];

                                        return (
                                            <div
                                                key={`rule-card-${editorIndex}`}
                                                style={{
                                                    display: "grid",
                                                    gap: "1rem",
                                                }}
                                            >
                                                {/* Conditions */}
                                                {rule.conds.map((cond, idx) => {
                                                    const selectedFieldObj = cond?.selectedField?.code
                                                        ? currentPageFieldOptions.find((f) => f.code === cond.selectedField.code)
                                                        : undefined;

                                                    const operatorOptions = getOperatorOptions(selectedFieldObj);
                                                    const selectedOperator = cond?.comparisonType?.code
                                                        ? operatorOptions.find((o) => o.code === cond.comparisonType.code)
                                                        : undefined;

                                                    const numericField = isNumericLike(selectedFieldObj);

                                                    return (
                                                        <React.Fragment key={`cond-row-${editorIndex}-${idx}`}>
                                                            {/* "And" tag OUTSIDE the card */}
                                                            {idx > 0 && (
                                                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0.5rem 0" }}>
                                                                    <Tag
                                                                        type={"monochrome"}
                                                                        label={t(cond.joiner?.name || (cond.joiner?.code === "&&" ? "AND" : "OR"))}
                                                                        stroke={true}
                                                                    />
                                                                </div>
                                                            )}
                                                            {/* {idx > 0 && (
                                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                                    <span style={{ fontWeight: 600 }}>{joinWithLabel}</span>
                                                                    <div style={{ width: 160, maxWidth: "100%" }}>
                                                                        <Dropdown
                                                                            option={LOGICALS}
                                                                            optionKey="name"
                                                                            name={`joiner-${editorIndex}-${idx}`}
                                                                            t={t}
                                                                            select={(e) => changeJoiner(editorIndex, idx, e.code)}
                                                                            selected={cond.joiner}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )} */}
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
                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-end" }}>
                                                                {/* Field */}
                                                                <div style={{ minWidth: 260, flex: "1 1 280px" }}>
                                                                    <LabelFieldPair vertical removeMargin>
                                                                        <p style={{ margin: 0 }}>{selectFieldLabel}</p>
                                                                        <div className="digit-field" style={{ width: "100%" }}>
                                                                            <Dropdown
                                                                                option={currentPageFieldOptions}
                                                                                optionKey="label"
                                                                                name={`field-${editorIndex}-${idx}`}
                                                                                t={customT}
                                                                                select={(e) => {
                                                                                    const nextOps = getOperatorOptions(e);
                                                                                    const canKeep =
                                                                                        cond?.comparisonType?.code &&
                                                                                        nextOps.some((o) => o.code === cond.comparisonType.code);

                                                                                    const isCk = isCheckboxField(e);
                                                                                    updateCond(editorIndex, idx, {
                                                                                        selectedField: e,
                                                                                        ...(isCk && { fieldValue: ["true", "false"].includes(String(cond.fieldValue).toLowerCase()) ? cond.fieldValue : "false" }),
                                                                                        comparisonType: canKeep
                                                                                            ? cond.comparisonType
                                                                                            : (isCk ? nextOps.find((o) => o.code === "==") : {}),
                                                                                    });
                                                                                }}
                                                                                optionCardStyles={{ maxHeight: "15vh", overflow: "auto", zIndex: 10000 }}
                                                                                selected={
                                                                                    cond?.selectedField?.code
                                                                                        ? currentPageFieldOptions.find((f) => f.code === cond.selectedField.code)
                                                                                        : cond.selectedField
                                                                                }
                                                                                showToolTip={true}
                                                                            />
                                                                        </div>
                                                                    </LabelFieldPair>
                                                                </div>

                                                                {/* Operator */}
                                                                <div style={{ minWidth: 220, flex: "0 1 220px" }}>
                                                                    <LabelFieldPair vertical removeMargin>
                                                                        <p style={{ margin: 0 }}>{comparisonTypeLabel}</p>
                                                                        <div className="digit-field" style={{ width: "100%" }}>
                                                                            <Dropdown
                                                                                option={operatorOptions}
                                                                                optionKey="name"
                                                                                name={`op-${editorIndex}-${idx}`}
                                                                                optionCardStyles={{ maxHeight: "15vh", overflow: "auto", zIndex: 10000 }}
                                                                                t={t}
                                                                                select={(e) => updateCond(editorIndex, idx, { comparisonType: e })}
                                                                                // disabled={!cond?.selectedField?.code}
                                                                                selected={selectedOperator}
                                                                                showToolTip={true}
                                                                            />
                                                                        </div>
                                                                    </LabelFieldPair>
                                                                </div>

                                                                {/* Value */}
                                                                <div style={{ minWidth: 220, flex: "0 1 220px" }}>
                                                                    <LabelFieldPair vertical removeMargin>
                                                                        <p style={{ margin: 0 }}>{selectValueLabel}</p>
                                                                        <div className="digit-field" style={{ width: "100%" }}>
                                                                            {(() => {
                                                                                if (selectedFieldObj && isCheckboxField(selectedFieldObj)) {
                                                                                    const boolVal = String(cond.fieldValue).toLowerCase() === "true";
                                                                                    return (
                                                                                        <CheckBox
                                                                                            mainClassName={"app-config-checkbox-main"}
                                                                                            labelClassName={"app-config-checkbox-label"}
                                                                                            onChange={(v) => {
                                                                                                const checked = typeof v === "boolean" ? v : !!v?.target?.checked;
                                                                                                updateCond(editorIndex, idx, { fieldValue: checked ? "true" : "false" });
                                                                                            }}
                                                                                            value={boolVal}
                                                                                            label={t(selectedFieldObj?.label) || selectedFieldObj?.label || ""}
                                                                                            isLabelFirst={false}
                                                                                            disabled={!cond?.selectedField?.code}
                                                                                        />
                                                                                    );
                                                                                }

                                                                                if (selectedFieldObj && isDobLike(selectedFieldObj)) {
                                                                                    return (
                                                                                        <TextInput
                                                                                            type="text"
                                                                                            populators={{ name: `months-${editorIndex}-${idx}` }}
                                                                                            placeholder={t("ENTER_INTEGER_VALUE") || enterValueLabel}
                                                                                            value={cond.fieldValue}
                                                                                            onChange={(event) =>
                                                                                                updateCond(editorIndex, idx, {
                                                                                                    fieldValue: sanitizeIntegerInput(event.target.value),
                                                                                                })
                                                                                            }
                                                                                            disabled={!cond?.selectedField?.code}
                                                                                        />
                                                                                    );
                                                                                }

                                                                                if (selectedFieldObj && isDatePickerNotDob(selectedFieldObj)) {
                                                                                    const iso = toISOFromDDMMYYYY(cond.fieldValue);
                                                                                    return (
                                                                                        <TextInput
                                                                                            type="date"
                                                                                            name={`date-${editorIndex}-${idx}`}
                                                                                            className="appConfigLabelField-Input"
                                                                                            value={iso}
                                                                                            populators={{
                                                                                                newDateFormat: true,
                                                                                            }}
                                                                                            onChange={(d) => {

                                                                                                updateCond(editorIndex, idx, {
                                                                                                    fieldValue: toDDMMYYYY(d),
                                                                                                })
                                                                                            }
                                                                                            }
                                                                                        />
                                                                                    );
                                                                                }

                                                                                const isSelect =
                                                                                    selectedFieldObj &&
                                                                                    (selectedFieldObj.format === "dropdown" ||
                                                                                        selectedFieldObj.format === "radio" ||
                                                                                        selectedFieldObj.format === "select" ||
                                                                                        selectedFieldObj.type === "selection");

                                                                                if (isSelect) {
                                                                                    if (Array.isArray(selectedFieldObj.enums) && selectedFieldObj.enums.length > 0) {
                                                                                        const enumOptions = selectedFieldObj.enums.map((en) => ({
                                                                                            code: String(en.code),
                                                                                            name: en.name,
                                                                                        }));
                                                                                        const selectedEnum =
                                                                                            enumOptions.find((o) => String(o.code) === String(cond.fieldValue)) ||
                                                                                            (cond.fieldValue
                                                                                                ? { code: String(cond.fieldValue), name: String(cond.fieldValue) }
                                                                                                : undefined);
                                                                                        return (
                                                                                            <Dropdown
                                                                                                option={enumOptions}
                                                                                                optionKey="name"
                                                                                                name={`val-${editorIndex}-${idx}`}
                                                                                                t={customT}
                                                                                                optionCardStyles={{ maxHeight: "15vh", overflow: "auto", zIndex: 10000 }}
                                                                                                select={(e) => updateCond(editorIndex, idx, { fieldValue: e.code })}
                                                                                                disabled={!cond?.selectedField?.code}
                                                                                                selected={selectedEnum}
                                                                                                showToolTip={true}
                                                                                                isSearchable={true}
                                                                                            />
                                                                                        );
                                                                                    }

                                                                                    if (selectedFieldObj.schemaCode) {
                                                                                        return (
                                                                                            <MdmsValueDropdown
                                                                                                schemaCode={selectedFieldObj.schemaCode}
                                                                                                value={cond.fieldValue}
                                                                                                onChange={(code) => updateCond(editorIndex, idx, { fieldValue: code })}
                                                                                                t={t}
                                                                                            />
                                                                                        );
                                                                                    }

                                                                                    return (
                                                                                        <TextInput
                                                                                            type="text"
                                                                                            populators={{ name: `text-${editorIndex}-${idx}` }}
                                                                                            placeholder={enterValueLabel}
                                                                                            value={cond.fieldValue}
                                                                                            onChange={(event) => updateCond(editorIndex, idx, { fieldValue: event.target.value })}
                                                                                            disabled={!cond?.selectedField?.code}
                                                                                        />
                                                                                    );
                                                                                }

                                                                                if (numericField) {
                                                                                    return (
                                                                                        <TextInput
                                                                                            type="text"
                                                                                            populators={{ name: `text-${editorIndex}-${idx}` }}
                                                                                            placeholder={t("ENTER_INTEGER_VALUE") || enterValueLabel}
                                                                                            value={cond.fieldValue}
                                                                                            onChange={(event) =>
                                                                                                updateCond(editorIndex, idx, {
                                                                                                    fieldValue: sanitizeIntegerInput(event.target.value),
                                                                                                })
                                                                                            }
                                                                                            disabled={!cond?.selectedField?.code}
                                                                                        />
                                                                                    );
                                                                                }

                                                                                return (
                                                                                    <TextInput
                                                                                        type="text"
                                                                                        populators={{ name: `text-${editorIndex}-${idx}` }}
                                                                                        placeholder={enterValueLabel}
                                                                                        value={cond.fieldValue}
                                                                                        onChange={(event) => updateCond(editorIndex, idx, { fieldValue: event.target.value })}
                                                                                        disabled={!cond?.selectedField?.code}
                                                                                    />
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    </LabelFieldPair>
                                                                </div>

                                                                {/* Remove condition - only show when more than 1 condition exists */}
                                                                {rule.conds.length > 1 && (
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: "0.25rem",
                                                                            cursor: "pointer",
                                                                            alignSelf: "flex-end",
                                                                            paddingBottom: "0.5rem",
                                                                        }}
                                                                        onClick={() => removeCondition(editorIndex, idx)}
                                                                        title={removeConditionLabel}
                                                                        aria-label={removeConditionLabel}
                                                                        role="button"
                                                                    >
                                                                        <SVG.Delete fill={"#C84C0E"} width={"1.25rem"} height={"1.25rem"} />
                                                                        <span style={{ color: "#C84C0E", fontSize: "0.875rem", fontWeight: 500 }}>
                                                                            {removeConditionLabel}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Per-condition error */}
                                                            {validationStarted && !isCondComplete(cond) && (
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
                                                                    <span>{completeAllMsg}</span>
                                                                    <SVG.Close
                                                                        width={"1.1rem"}
                                                                        height={"1.1rem"}
                                                                        fill={"#7F1D1D"}
                                                                        onClick={() => {
                                                                            setValidationStarted(false);
                                                                            setGlobalFormError(null)
                                                                        }}
                                                                        tabIndex={0}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                </div>
                                                            )}
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}

                                                {/* Add condition */}
                                                <div>
                                                    <Button
                                                        variation="secondary"
                                                        label={addConditionLabel}
                                                        title={addConditionLabel}
                                                        icon="Add"
                                                        onClick={() => addCondition(editorIndex)}
                                                        style={{ minWidth: "auto" }}
                                                    />
                                                </div>

                                                {/* Target page */}
                                                <div style={{ minWidth: 260 }}>
                                                    <LabelFieldPair vertical removeMargin>
                                                        <p style={{ margin: 0 }}>{targetPageLabel}</p>
                                                        <div className="digit-field" style={{ width: "100%" }}>
                                                            <Dropdown
                                                                option={targetPages?.length > 0 ? targetPages : allPageOptions}
                                                                optionKey="code"
                                                                name={`target-${editorIndex}`}
                                                                optionCardStyles={{ maxHeight: "15vh", overflow: "auto", zIndex: 10000 }}
                                                                t={t}
                                                                select={(e) => updateRule(editorIndex, { targetPage: e })}
                                                                selected={
                                                                    rules[editorIndex]?.targetPage?.code
                                                                        ? allPageOptions.find((p) => p.code === rules[editorIndex].targetPage.code) ||
                                                                        rules[editorIndex].targetPage
                                                                        : rules[editorIndex].targetPage
                                                                }
                                                                showToolTip={true}
                                                            />
                                                        </div>
                                                    </LabelFieldPair>
                                                </div>

                                                {/* GLOBAL ERROR (shows when Submit clicked with missing target page or incomplete conditions) */}
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
                                        );
                                    })()}
                                </div>
                            ]}
                            onOverlayClick={discardAndCloseEditor}
                            onClose={discardAndCloseEditor}
                            equalWidthButtons={false}
                            footerChildren={[
                                <Button
                                    key="close"
                                    type={"button"}
                                    size={"large"}
                                    variation={"secondary"}
                                    label={closeLabel}
                                    title={closeLabel}
                                    onClick={discardAndCloseEditor}
                                />,
                                <Button
                                    key="submit"
                                    type={"button"}
                                    size={"large"}
                                    variation={"primary"}
                                    label={submitLabel}
                                    title={submitLabel}
                                    onClick={submitAndClose}
                                />,
                            ]}
                            style={{maxWidth:"60%"}}
                        />
                    </div>
                </BodyPortal>
            )}
        </Card>
    );
}

export default React.memo(NewNavigationLogicWrapper);