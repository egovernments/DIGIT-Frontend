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
import { useCustomT } from "./hooks/useCustomT";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { fetchFlowPages } from "./redux/flowPagesSlice";
import { fetchPageFields } from "./redux/pageFieldsSlice";

/** Portal so the popup escapes side panels and fills the viewport layer */
function BodyPortal({ children }) {
    if (typeof document === "undefined") return null; // SSR guard
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
            t={t}
            optionCardStyles={{ maxHeight: 300, overflow: "auto", position: "relative", zIndex: 10000 }}
            select={(e) => onChange(e.code)}
            disabled={isLoading || !module || !master}
            selected={selectedOption}
        />
    );
}

function NewDependentFieldWrapper({ t }) {
    const useT = useCustomT();
    const dispatch = useDispatch();
    const tenantId = Digit?.ULBService?.getCurrentTenantId?.() || "mz";

    // Get data from Redux
    const selectedField = useSelector((state) => state.remoteConfig.selectedField);
    const currentData = useSelector((state) => state.remoteConfig.currentData);
    
    // FIXED: Access pages directly from state.flowPages.pages
    const flowPages = useSelector((state) => state.flowPages.pages);
    const flowPagesStatus = useSelector((state) => state.flowPages.status);
    const pageConfigs = useSelector((state) => state.pageFields.byPage);
    const pageFieldsLoading = useSelector((state) => state.pageFields.loadingPages);
    const moduleName = "HCM-ADMIN-CONSOLE";
    const masterName = "AppFlowConfig";

    const flowId = currentData?.flow || "REGISTRATION";
    const campaignNumber = currentData?.project || "";
    const currentPageName = currentData?.page;

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
    }, [dispatch, flowPagesStatus, tenantId, campaignNumber]);

    // Fetch current page fields if not already loaded
    useEffect(() => {
        if (currentPageName && flowId && campaignNumber &&
            !pageConfigs[currentPageName] && !pageFieldsLoading[currentPageName]) {
            dispatch(fetchPageFields({
                tenantId,
                flow: flowId,
                campaignNumber,
                pageName: currentPageName,
            }));
        }
    }, [dispatch, currentPageName, flowId, campaignNumber, pageConfigs, pageFieldsLoading, tenantId]);

    // Pre-fetch all pages in the flow for better UX
    useEffect(() => {
        if (flowId && campaignNumber && flowPages.length > 0) {
            flowPages.forEach(page => {
                if (!pageConfigs[page.name] && !pageFieldsLoading[page.name]) {
                    dispatch(fetchPageFields({
                        tenantId,
                        flow: flowId,
                        campaignNumber,
                        pageName: page.name,
                    }));
                }
            });
        }
    }, [dispatch, flowId, campaignNumber, flowPages, pageConfigs, pageFieldsLoading, tenantId]);

    // ---------- labels ----------
    const displayLogicLabel = t("DISPLAY_LOGIC") || "Display Logic";
    const noLogicAddedLabel = t("NO_LOGIC_ADDED") || "No logic added yet.";
    const addDisplayLogicLabel = t("ADD_DISPLAY_LOGIC") || "Add Display Logic";
    const editLabel = t("EDIT") || "Edit";
    const deleteRuleLabel = t("HCM_REMOVE_RULE") || "Delete Rule";
    const joinWithLabel = t("HCM_JOIN_WITH") || "Join with";
    const selectPageLabel = t("HCM_SELECT_PAGE") || "Select Page";
    const selectFieldLabel = t("HCM_SELECT_FIELD") || "Select Field";
    const comparisonTypeLabel = t("HCM_COMPARISION_TYPE") || "Comparison";
    const selectValueLabel = t("HCM_SELECT_VALUE") || "Select Value";
    const enterValueLabel = t("ENTER_VALUE") || "Enter value";
    const closeLabel = t("CLOSE") || "Cancel";
    const submitLabel = t("SUBMIT") || "Submit";
    const andText = t("AND") || "And";
    const orText = t("OR") || "Or";
    const completeAllMsg =
        t("PLEASE_COMPLETE_ALL_CONDITIONS") ||
        "Please complete all condition fields before confirming.";
    const logicLabel = t("HCM_LOGIC") || "Logic";

    // ---------- constants & helpers ----------
    const LOGICALS = [
        { code: "&&", name: t("AND") || "AND" },
        { code: "||", name: t("OR") || "OR" },
    ];
    const ALL_OPERATOR_OPTIONS = [
        { code: "==", name: "EQUALS_TO"},
        { code: "!=", name: "NOT_EQUALS_TO" },
        { code: ">=", name: "GREATER_THAN_OR_EQUALS_TO" },
        { code: "<=", name: "LESS_THAN_OR_EQUALS_TO"},
        { code: ">", name: "GREATER_THAN"},
        { code: "<", name: "LESS_THAN" },
    ];
    const PARSE_OPERATORS = useMemo(
        () => ["!=", ">=", "<=", "==", ">", "<"].sort((a, b) => b.length - a.length),
        []
    );

    // Safe extraction of expression
    const getExpressionString = () => {
        const expr = selectedField?.visibilityCondition?.expression;
        if (typeof expr === 'string') {
            return expr.trim();
        }
        if (expr && typeof expr === 'object' && expr.expression) {
            return String(expr.expression).trim();
        }
        return "";
    };

    // Build page options from flowPages directly
    const pageOptions = useMemo(() => {
        // Get current page index
        const currentPageIndex = flowPages.findIndex((p) => p?.name === currentPageName);

        // Only show pages up to and including current page
        const availablePages = currentPageIndex >= 0
            ? flowPages.slice(0, currentPageIndex + 1)
            : flowPages;

        return availablePages.map((p) => ({
            code: p.name,
            name: p.name,
            order: p.order
        }));
    }, [flowPages, currentPageName]);

    // Updated getPageObj to use fetched page configs
    const getPageObj = (pageCode) => {
        if (pageCode === currentPageName) {
            // Use currentData for current page (it's already loaded)
            return currentData?.body?.[0];
        }

        // Check if we have fetched the page configuration
        const pageConfig = pageConfigs[pageCode];
        if (pageConfig) {
            return pageConfig.body?.[0] || { fields: [] };
        }

        // Return empty object if no data yet
        return { fields: [] };
    };

    // Get field options for a page
    const getFieldOptions = (pageCode) => {
        const pageObj = getPageObj(pageCode);
        if (!pageObj?.fields) return [];

        return pageObj.fields
            .filter((f) => {
                // Skip template, dynamic, and custom fields
                const fieldType = String(f?.type || "").toLowerCase();
                if (["template", "dynamic", "custom"].includes(fieldType)) return false;

                // Skip hidden fields unless explicitly included in form
                const isHidden = f?.hidden === true;
                const includeInForm = f?.includeInForm;
                if (isHidden && !includeInForm) return false;

                return true;
            })
            .filter((f) => {
                // For current page, only show fields before the selected field
                if (pageCode === currentPageName && selectedField) {
                    return f?.order < (selectedField?.order || Number.MAX_VALUE);
                }
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
                order: f.order,
            }));
    };

    // Fetch fields when a page is selected
    const handlePageSelection = useCallback((pageCode) => {
        if (!flowId || !campaignNumber) {
            console.warn("Missing flow or campaign information");
            return;
        }

        // Fetch fields for the selected page if not already cached
        if (!pageConfigs[pageCode] && !pageFieldsLoading[pageCode]) {
            dispatch(fetchPageFields({
                tenantId,
                flow: flowId,
                campaignNumber,
                pageName: pageCode,
            }));
        }
    }, [dispatch, pageConfigs, pageFieldsLoading, tenantId, flowId, campaignNumber]);

    // Don't render until we have the necessary data
    if (!campaignNumber || !flowId) {
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

    // type helpers
    const getFieldMeta = (pageCode, fieldCode) => {
        const pageObj = getPageObj(pageCode);
        const field = pageObj?.fields?.find((f) => (f.jsonPath || f.fieldName || f.id) === fieldCode);
        return { pageObj, field };
    };

    const isStringLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        if (fmt === "dropdown" || fmt === "radio" || tpe === "selection") return true;
        return ["string", "text", "textinput", "textarea"].includes(tpe);
    };

    const isCheckboxField = (field) => (field?.type || "").toLowerCase() === "checkbox";

    const isNumericField = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        const numericTags = ["number", "numeric", "integer"];
        return numericTags.includes(tpe) || numericTags.includes(fmt);
    };

    const isDobLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return tpe === "datepicker" && fmt === "dob";
    };

    const isDatePickerNotDob = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return tpe === "datepicker" && fmt !== "dob";
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

    const toDDMMYYYY = (iso) => {
        if (!iso) return "";
        const [y, m, d] = String(iso).split("-");
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

    // ---------- parse / serialize ----------
    const serializeRule = (r) => {
        if (!r?.selectedPage?.code || !r?.selectedField?.code || !r?.comparisonType?.code)
            return "";
        const { field } = getFieldMeta(r.selectedPage.code, r.selectedField.code);

        if (field && isDobLike(field)) {
            const months = String(r?.fieldValue ?? "").trim();
            if (months === "") return "";
            const left = `calculateAgeInMonths(${r.selectedPage.code}.${r.selectedField.code})`;
            return `${left}${r.comparisonType.code}${months}`;
        }
        if (field && isDatePickerNotDob(field)) {
            const ddmmyyyy = String(r?.fieldValue ?? "").trim();
            if (ddmmyyyy === "") return "";
            return `${r.selectedPage.code}.${r.selectedField.code}${r.comparisonType.code}${ddmmyyyy}`;
        }
        if (String(r?.fieldValue ?? "").trim() === "") return "";
        return `${r.selectedPage.code}.${r.selectedField.code}${r.comparisonType.code}${r.fieldValue}`;
    };

    const buildFinalExpression = (rulesArr) =>
        rulesArr
            .map((r, i) => (i > 0 ? `${r.joiner?.code || "&&"} ${serializeRule(r)}` : serializeRule(r)))
            .filter((seg) => !!seg)
            .join(" ");

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

    const parseSingle = (expression = "") => {
        for (const operator of PARSE_OPERATORS) {
            const i = expression.indexOf(operator);
            if (i !== -1) {
                const leftRaw = expression.slice(0, i).trim();
                const right = expression.slice(i + operator.length).trim();

                let left = leftRaw;
                const ageFn = "calculateAgeInMonths(";
                if (leftRaw.startsWith(ageFn) && leftRaw.endsWith(")")) {
                    left = leftRaw.slice(ageFn.length, -1);
                }

                const [pageCode = "", fieldCode = ""] = (left || "")
                    .split(".")
                    .map((s) => (s || "").trim());

                return {
                    selectedPage: pageCode ? { code: pageCode, name: pageCode } : {},
                    selectedField: fieldCode ? { code: fieldCode, name: fieldCode } : {},
                    comparisonType: { code: operator, name: operator },
                    fieldValue: (right || "").trim(),
                };
            }
        }
        return { selectedPage: {}, selectedField: {}, comparisonType: {}, fieldValue: "" };
    };

    // ---------- rules state ----------
    const committedExpression = getExpressionString();

    const rulesFromExisting = useMemo(() => {
        if (!committedExpression) return [];
        const tokens = tokenize(committedExpression);
        if (!tokens.length) return [];
        const out = [];
        let pendingJoin = "&&";
        tokens.forEach((t) => {
            if (t.type === "op") pendingJoin = t.value;
            else {
                const base = parseSingle(t.value);
                out.push({
                    ...base,
                    joiner:
                        out.length === 0
                            ? { code: "&&", name: "AND" }
                            : { code: pendingJoin, name: pendingJoin === "||" ? "OR" : "AND" },
                });
            }
        });
        return out;
    }, [committedExpression]);

    const [rules, setRules] = useState(() => rulesFromExisting);
    const [editorIndex, setEditorIndex] = useState(null);
    const [draftRule, setDraftRule] = useState(null);
    const [globalFormError, setGlobalFormError] = useState("");
    const [validationStarted, setValidationStarted] = useState(false);

    const showPopUp = editorIndex !== null;

    useEffect(() => {
        setRules(rulesFromExisting);
    }, [rulesFromExisting]);

    const isRuleComplete = (r) =>
        Boolean(r?.selectedPage?.code) &&
        Boolean(r?.selectedField?.code) &&
        Boolean(r?.comparisonType?.code) &&
        String(r?.fieldValue ?? "").trim() !== "";

    // ---------- actions ----------
    const openEditorForNew = () => {
        const jr = {
            selectedPage: {},
            selectedField: {},
            comparisonType: {},
            fieldValue: "",
            joiner: { code: "&&", name: "AND" }
        };
        setDraftRule(jr);
        setValidationStarted(false);
        setGlobalFormError("");
        setEditorIndex("new");
    };

    const openEditor = (idx) => {
        const rule = rules[idx];
        setDraftRule({ ...rule });
        setValidationStarted(false);
        setGlobalFormError("");
        setEditorIndex(idx);

        // Fetch fields for the selected page if not already loaded
        if (rule?.selectedPage?.code) {
            handlePageSelection(rule.selectedPage.code);
        }
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
            const expressionString = buildFinalExpression(next);
            // Update Redux
            dispatch(updateSelectedField({
                visibilityCondition: {
                    ...selectedField?.visibilityCondition,
                    expression: expressionString,
                },
            }));
            return next;
        });

    const submitAndClose = () => {
        setValidationStarted(true);
        if (!isRuleComplete(draftRule)) {
            setGlobalFormError(completeAllMsg);
            return;
        }
        if (editorIndex === "new") {
            const next = [...rules, draftRule];
            setRules(next);
            const expressionString = buildFinalExpression(next);
            // Update Redux
            dispatch(updateSelectedField({
                visibilityCondition: {
                    ...selectedField?.visibilityCondition,
                    expression: expressionString,
                },
            }));
        } else if (typeof editorIndex === "number") {
            const next = rules.map((r, i) => (i === editorIndex ? draftRule : r));
            setRules(next);
            const expressionString = buildFinalExpression(next);
            // Update Redux
            dispatch(updateSelectedField({
                visibilityCondition: {
                    ...selectedField?.visibilityCondition,
                    expression: expressionString,
                },
            }));
        }
        discardAndCloseEditor();
    };

    // ---------- UI helpers ----------
    const JoinerRow = ({ code }) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <span
                style={{
                    background: "#ffffffff",
                    color: "#C84C0E",
                    borderRadius: 4,
                    border: "1px solid #C84C0E",
                    padding: "0.1rem 0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                }}
            >
                {code === "||" ? orText.toUpperCase() : andText.toUpperCase()}
            </span>
        </div>
    );

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
                    title={editLabel}
                    aria-label={editLabel}
                    onClick={() => onEdit(idx)}
                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                >
                    {SVG?.Edit ? (
                        <SVG.Edit fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} />
                    ) : (
                        <Button variation="secondary" label={editLabel} onClick={() => onEdit(idx)} />
                    )}
                </div>

                <div
                    role="button"
                    title={deleteRuleLabel}
                    aria-label={deleteRuleLabel}
                    onClick={() => onDelete(idx)}
                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                >
                    {SVG?.Delete ? (
                        <SVG.Delete fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} />
                    ) : (
                        <Button variation="secondary" label={deleteRuleLabel} onClick={() => onDelete(idx)} />
                    )}
                </div>
            </div>
        </div>
    );

    // ---------- UI ----------
    return (
        <Card type="secondary">
            <div style={{ marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0 }}>{displayLogicLabel}</h3>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                }}
            >
                {(!rules || rules.length === 0) ? (
                    <p style={{ opacity: 0.7, margin: 0 }}>{noLogicAddedLabel}</p>
                ) : (
                    <>
                        <RuleRow idx={0} onEdit={openEditor} onDelete={deleteRuleFromList} />
                        {rules.slice(1).map((r, i) => (
                            <React.Fragment key={`logic-block-${i + 1}`}>
                                <JoinerRow code={r?.joiner?.code} />
                                <RuleRow idx={i + 1} onEdit={openEditor} onDelete={deleteRuleFromList} />
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>

            <div>
                <Button
                    variation="secondary"
                    label={addDisplayLogicLabel}
                    onClick={openEditorForNew}
                    icon="Add"
                    style={{ width: "100%" }}
                />
            </div>

            {/* Full Editor Popup with all field type handling */}
            {showPopUp && draftRule && (
                <BodyPortal>
                    <div className="popup-portal-overlay">
                        <PopUp
                            className="digit-popup--fullscreen"
                            type={"default"}
                            heading={editLabel}
                            children={[
                                <div key="single-rule-editor" style={{ display: "grid", gap: "1rem" }}>
                                    <div
                                        style={{
                                            background: "#FAFAFA",
                                            border: "1px solid #F5D8C6",
                                            borderRadius: 8,
                                            padding: "0.75rem",
                                            display: "grid",
                                            gap: "0.75rem",
                                        }}
                                    >
                                        {/* Join-with dropdown */}
                                        {editorIndex === "new" && rules.length > 0 && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <span style={{ fontWeight: 600 }}>{joinWithLabel}</span>
                                                <div style={{ width: 160, maxWidth: "100%" }}>
                                                    <Dropdown
                                                        option={LOGICALS}
                                                        optionKey="name"
                                                        name={`joiner-new`}
                                                        t={t}
                                                        select={(e) =>
                                                            setDraftRule((prev) => ({
                                                                ...prev,
                                                                joiner: { code: e.code, name: e.code === "||" ? "OR" : "AND" },
                                                            }))
                                                        }
                                                        selected={draftRule.joiner}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
                                            {/* Page Dropdown */}
                                            <div style={{ minWidth: 220, flex: "1 1 240px" }}>
                                                <LabelFieldPair vertical removeMargin>
                                                    <p style={{ margin: 0 }}>{selectPageLabel}</p>
                                                    <div className="digit-field" style={{ width: "100%" }}>
                                                        <Dropdown
                                                            option={pageOptions}
                                                            optionKey="code"
                                                            name={`page-editor`}
                                                            t={useT}
                                                            select={(e) => {
                                                                handlePageSelection(e.code);
                                                                setDraftRule((prev) => ({
                                                                    ...prev,
                                                                    selectedPage: e,
                                                                    selectedField: {},
                                                                    comparisonType: {},
                                                                    fieldValue: "",
                                                                }));
                                                            }}
                                                            selected={
                                                                draftRule?.selectedPage?.code
                                                                    ? pageOptions.find((p) => p.code === draftRule.selectedPage.code) ||
                                                                    draftRule.selectedPage
                                                                    : draftRule.selectedPage
                                                            }
                                                        />
                                                    </div>
                                                </LabelFieldPair>
                                            </div>

                                            {/* Field Dropdown */}
                                            <div style={{ minWidth: 260, flex: "1 1 280px" }}>
                                                <LabelFieldPair vertical removeMargin>
                                                    <p style={{ margin: 0 }}>{selectFieldLabel}</p>
                                                    <div className="digit-field" style={{ width: "100%" }}>
                                                        <Dropdown
                                                            option={
                                                                draftRule?.selectedPage?.code
                                                                    ? getFieldOptions(draftRule.selectedPage.code)
                                                                    : []
                                                            }
                                                            optionKey="label"
                                                            name={`field-editor`}
                                                            t={useT}
                                                            select={(e) => {
                                                                const nextOps = getOperatorOptions(e);
                                                                const canKeep =
                                                                    draftRule?.comparisonType?.code &&
                                                                    nextOps.some((o) => o.code === draftRule.comparisonType.code);

                                                                const isCk = isCheckboxField(e);
                                                                setDraftRule((prev) => ({
                                                                    ...prev,
                                                                    selectedField: e,
                                                                    fieldValue: isCk
                                                                        ? (["true", "false"].includes(String(prev.fieldValue).toLowerCase())
                                                                            ? prev.fieldValue
                                                                            : "false")
                                                                        : "",
                                                                    comparisonType: canKeep
                                                                        ? nextOps.find((o) => o.code === prev.comparisonType.code)
                                                                        : (isCk ? nextOps.find((o) => o.code === "==") : {}),
                                                                }));
                                                            }}
                                                            selected={
                                                                draftRule?.selectedField?.code
                                                                    ? (draftRule?.selectedPage?.code ? getFieldOptions(draftRule.selectedPage.code) : []).find(
                                                                        (f) => f.code === draftRule.selectedField.code
                                                                    ) || draftRule.selectedField
                                                                    : draftRule.selectedField
                                                            }
                                                            disabled={!draftRule?.selectedPage?.code}
                                                        />
                                                    </div>
                                                </LabelFieldPair>
                                            </div>

                                            {/* Operator Dropdown */}
                                            <div style={{ minWidth: 220, flex: "0 1 220px" }}>
                                                <LabelFieldPair vertical removeMargin>
                                                    <p style={{ margin: 0 }}>{comparisonTypeLabel}</p>
                                                    <div className="digit-field" style={{ width: "100%" }}>
                                                        {(() => {
                                                            const selectedFieldObj =
                                                                draftRule?.selectedPage?.code && draftRule?.selectedField?.code
                                                                    ? getFieldOptions(draftRule.selectedPage.code).find(
                                                                        (f) => f.code === draftRule.selectedField.code
                                                                    )
                                                                    : null;
                                                            const operatorOptions = getOperatorOptions(selectedFieldObj);
                                                            const selectedOperator = getSelectedOperatorFromOptions(
                                                                selectedFieldObj,
                                                                draftRule?.comparisonType
                                                            );

                                                            return (
                                                                <Dropdown
                                                                    option={operatorOptions}
                                                                    optionKey="name"
                                                                    name={`op-editor`}
                                                                    optionCardStyles={{ maxHeight: 300, overflow: "auto", position: "relative", zIndex: 10000 }}
                                                                    t={t}
                                                                    select={(e) => setDraftRule((prev) => ({ ...prev, comparisonType: e }))}
                                                                    disabled={!draftRule?.selectedField?.code}
                                                                    selected={selectedOperator}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                </LabelFieldPair>
                                            </div>

                                            {/* Value Input - with full field type handling */}
                                            <div style={{ minWidth: 220, flex: "0 1 220px" }}>
                                                <LabelFieldPair vertical removeMargin>
                                                    <p style={{ margin: 0 }}>{selectValueLabel}</p>
                                                    <div className="digit-field" style={{ width: "100%" }}>
                                                        {(() => {
                                                            const selectedFieldObj =
                                                                draftRule?.selectedPage?.code && draftRule?.selectedField?.code
                                                                    ? getFieldOptions(draftRule.selectedPage.code).find(
                                                                        (f) => f.code === draftRule.selectedField.code
                                                                    )
                                                                    : null;

                                                            // Checkbox Field
                                                            if (selectedFieldObj && isCheckboxField(selectedFieldObj)) {
                                                                const boolVal = String(draftRule.fieldValue).toLowerCase() === "true";
                                                                return (
                                                                    <CheckBox
                                                                        mainClassName={"app-config-checkbox-main"}
                                                                        labelClassName={"app-config-checkbox-label"}
                                                                        onChange={(v) => {
                                                                            const checked = typeof v === "boolean" ? v : !!v?.target?.checked;
                                                                            setDraftRule((prev) => ({ ...prev, fieldValue: checked ? "true" : "false" }));
                                                                        }}
                                                                        value={boolVal}
                                                                        label={t(selectedFieldObj?.label) || selectedFieldObj?.label || ""}
                                                                        isLabelFirst={false}
                                                                        disabled={!draftRule?.selectedField?.code}
                                                                    />
                                                                );
                                                            }

                                                            // DOB Field (Age in months)
                                                            if (selectedFieldObj && isDobLike(selectedFieldObj)) {
                                                                return (
                                                                    <TextInput
                                                                        type="text"
                                                                        populators={{ name: `months-editor` }}
                                                                        placeholder={t("ENTER_INTEGER_VALUE") || enterValueLabel}
                                                                        value={draftRule.fieldValue}
                                                                        onChange={(event) =>
                                                                            setDraftRule((prev) => ({
                                                                                ...prev,
                                                                                fieldValue: sanitizeIntegerInput(event.target.value),
                                                                            }))
                                                                        }
                                                                        disabled={!draftRule?.selectedField?.code}
                                                                    />
                                                                );
                                                            }

                                                            // Date Picker (not DOB)
                                                            if (selectedFieldObj && isDatePickerNotDob(selectedFieldObj)) {
                                                                const iso = toISOFromDDMMYYYY(draftRule.fieldValue);
                                                                return (
                                                                    <TextInput
                                                                        type="date"
                                                                        populators={{ name: `date-editor` }}
                                                                        value={iso}
                                                                        onChange={(event) =>
                                                                            setDraftRule((prev) => ({
                                                                                ...prev,
                                                                                fieldValue: toDDMMYYYY(event?.target?.value),
                                                                            }))
                                                                        }
                                                                        disabled={!draftRule?.selectedField?.code}
                                                                    />
                                                                );
                                                            }

                                                            const isSelect = selectedFieldObj && isSelectLike(selectedFieldObj);

                                                            if (isSelect) {
                                                                // Dropdown with enum options
                                                                if (Array.isArray(selectedFieldObj.enums) && selectedFieldObj.enums.length > 0) {
                                                                    const enumOptions = selectedFieldObj.enums.map((en) => ({
                                                                        code: String(en.code),
                                                                        name: en.name,
                                                                    }));
                                                                    const selectedEnum =
                                                                        enumOptions.find((o) => String(o.code) === String(draftRule.fieldValue)) ||
                                                                        (draftRule.fieldValue
                                                                            ? { code: String(draftRule.fieldValue), name: String(draftRule.fieldValue) }
                                                                            : undefined);
                                                                    return (
                                                                        <Dropdown
                                                                            option={enumOptions}
                                                                            optionCardStyles={{ maxHeight: 300, overflow: "auto", position: "relative", zIndex: 10000 }}
                                                                            optionKey="code"
                                                                            name={`val-editor`}
                                                                            t={useT}
                                                                            select={(e) =>
                                                                                setDraftRule((prev) => ({ ...prev, fieldValue: e.code }))
                                                                            }
                                                                            disabled={!draftRule?.selectedField?.code}
                                                                            selected={selectedEnum}
                                                                        />
                                                                    );
                                                                }

                                                                // MDMS Dropdown
                                                                if (selectedFieldObj.schemaCode) {
                                                                    return (
                                                                        <MdmsValueDropdown
                                                                            schemaCode={selectedFieldObj.schemaCode}
                                                                            value={draftRule.fieldValue}
                                                                            onChange={(code) => setDraftRule((prev) => ({ ...prev, fieldValue: code }))}
                                                                            t={useT}
                                                                        />
                                                                    );
                                                                }

                                                                // Fallback text input for other select-like fields
                                                                return (
                                                                    <TextInput
                                                                        type="text"
                                                                        populators={{ name: `text-editor` }}
                                                                        placeholder={enterValueLabel}
                                                                        value={draftRule.fieldValue}
                                                                        onChange={(event) =>
                                                                            setDraftRule((prev) => ({ ...prev, fieldValue: event.target.value }))
                                                                        }
                                                                        disabled={!draftRule?.selectedField?.code}
                                                                    />
                                                                );
                                                            }

                                                            // Numeric fields
                                                            const numericValue = isNumericField(selectedFieldObj);
                                                            return (
                                                                <TextInput
                                                                    type="text"
                                                                    populators={{ name: `text-editor` }}
                                                                    placeholder={
                                                                        numericValue ? t("ENTER_INTEGER_VALUE") || enterValueLabel : enterValueLabel
                                                                    }
                                                                    value={draftRule.fieldValue}
                                                                    onChange={(event) => {
                                                                        const raw = event.target.value;
                                                                        const next = numericValue ? sanitizeIntegerInput(raw) : raw;
                                                                        setDraftRule((prev) => ({ ...prev, fieldValue: next }));
                                                                    }}
                                                                    disabled={!draftRule?.selectedField?.code}
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                </LabelFieldPair>
                                            </div>

                                            {/* Validation error message */}
                                            {validationStarted && !isRuleComplete(draftRule) && (
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
                                                        width: "100%",
                                                    }}
                                                >
                                                    <span>{completeAllMsg}</span>
                                                    {SVG?.Close ? (
                                                        <SVG.Close
                                                            width={"1.1rem"}
                                                            height={"1.1rem"}
                                                            fill={"#7F1D1D"}
                                                            onClick={() => {
                                                                setGlobalFormError(null);
                                                                setValidationStarted(false);
                                                            }}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    ) : (
                                                        <span
                                                            style={{ cursor: "pointer", color: "#7F1D1D" }}
                                                            onClick={() => {
                                                                setGlobalFormError(null);
                                                                setValidationStarted(false);
                                                            }}
                                                        >
                                                            ×
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>,
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
                                />,
                            ]}
                        />
                    </div>
                </BodyPortal>
            )}
        </Card>
    );
}

export default React.memo(NewDependentFieldWrapper);