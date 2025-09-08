import React, { useEffect, useMemo, useState } from "react";
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
import { useCustomT } from "./useCustomT";

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

    // normalize the selected value to an option object
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
            select={(e) => onChange(e.code)}
            disabled={isLoading || !module || !master}
            selected={selectedOption}
        />
    );
}

function DependentFieldsWrapper({
    t,
    parentState,
    currentState,
    onExpressionChange,
    screenConfig,
    selectedFieldItem,
}) {
    const useT = useCustomT();

    // ---------- labels ----------
    const displayLogicLabel = t("DISPLAY_LOGIC") || "Display Logic";
    const noLogicAddedLabel = t("NO_LOGIC_ADDED") || "No logic added yet.";
    const addDisplayLogicLabel = t("ADD_DISPLAY_LOGIC") || "Add Display Logic";
    const editDisplayLogicLabel = t("EDIT_DISPLAY_LOGIC") || "Edit Display Logic";
    const joinWithLabel = t("HCM_JOIN_WITH") || "Join with";
    const selectPageLabel = t("HCM_SELECT_PAGE") || "Select Page";
    const selectFieldLabel = t("HCM_SELECT_FIELD") || "Select Field";
    const comparisonTypeLabel = t("HCM_COMPARISION_TYPE") || "Comparison";
    const selectValueLabel = t("HCM_SELECT_VALUE") || "Select Value";
    const enterValueLabel = t("ENTER_VALUE") || "Enter value";
    const removeConditionLabel = t("REMOVE_CONDITION") || "Delete Condition";
    const addConditionLabel = t("ADD_CONDITION") || "Add Condition";
    const closeLabel = t("CLOSE") || "Close";
    const submitLabel = t("SUBMIT") || "Confirm Logic";
    const andText = t("AND") || "And";
    const orText = t("OR") || "Or";
    const incompleteExprLabel = t("INCOMPLETE_EXPRESSION") || "(incomplete)";
    const completeAllMsg = t("PLEASE_COMPLETE_ALL_CONDITIONS") || "Please complete all conditions before confirming.";

    // ---------- constants & helpers ----------
    const LOGICALS = [
        { code: "&&", name: t("AND") || "AND" },
        { code: "||", name: t("OR") || "OR" },
    ];

    const PARSE_OPERATORS = useMemo(
        () => ["!=", ">=", "<=", "==", ">", "<"].sort((a, b) => b.length - a.length),
        []
    );

    const ALL_OPERATOR_OPTIONS = [
        { code: "==", name: t("EQUALS_TO") || "equals to" },
        { code: "!=", name: t("NOT_EQUALS_TO") || "not equals to" },
        { code: ">=", name: t("GREATER_THAN_OR_EQUALS_TO") || "greater than or equals to" },
        { code: "<=", name: t("LESS_THAN_OR_EQUALS_TO") || "less than or equals to" },
        { code: ">", name: t("GREATER_THAN") || "greater than" },
        { code: "<", name: t("LESS_THAN") || "less than" },
    ];

    const currentPage = screenConfig?.[0]?.name;
    const currentTemplate = parentState?.currentTemplate || [];

    // Extracts a numeric order from page.order (preferred) or from the leading "N" or "N.M" in page.name
    const parsePageOrder = (p) => {
        const raw = p?.order ?? p?.pageOrder;
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
        const match = String(p?.name ?? "").match(/^(\d+(?:\.\d+)?)/);
        return match ? Number(match[1]) : NaN;
    };

    // Figure out if the current page is a decimal order (sub-flow)
    const currPageObj = (parentState?.currentTemplate || []).find((p) => p?.name === screenConfig?.[0]?.name);
    const currOrder = parsePageOrder(currPageObj || {});
    const currIsDecimal = Number.isFinite(currOrder) && !Number.isInteger(currOrder);


    const pageOptions = useMemo(() => {
        const withoutTemplates =
            (parentState?.currentTemplate || []).filter((p) => p?.type !== "template");

        const idx = withoutTemplates.findIndex((p) => p?.name === currentPage);
        const upto = idx === -1 ? withoutTemplates : withoutTemplates.slice(0, idx + 1);

        // If current page is a sub-flow (e.g., 4.3), include current page
        // but exclude earlier sub-flow pages (e.g., 4.1, 4.2, 2.1, …)
        const filtered = currIsDecimal
            ? upto.filter((p) => {
                if (p?.name === currentPage) return true; // always keep current page
                const ord = parsePageOrder(p);
                // keep only pages with integer order or no detectable number
                return Number.isNaN(ord) || Number.isInteger(ord);
            })
            : upto;

        return filtered.map((p) => ({ code: p.name, name: p.name, type: p.type }));
    }, [parentState?.currentTemplate, currentPage, currIsDecimal]);



    // find page object by name
    const getPageObj = (pageCode) =>
        pageCode === currentPage
            ? currentState?.screenData?.[0]?.cards?.[0]
            : currentTemplate.find((p) => p.name === pageCode)?.cards?.[0];

    const getFieldOptions = (pageCode) => {
        const pageObj = getPageObj(pageCode);
        if (!pageObj?.fields) return [];
        return pageObj.fields
            .filter((f) => f?.type !== "template")
            .filter(
                (f) =>
                    pageCode !== currentPage || f?.order < (selectedFieldItem?.order || pageObj.fields.length)
            )
            .map((f) => ({
                code: f.jsonPath,
                name: f.jsonPath,
                label: f.label,
                format: f.format,
                type: f.type || f.format || "string",
                schemaCode: f.schemaCode,
                enums: f.dropDownOptions || [],
            }));
    };

    // direct field meta lookup
    const getFieldMeta = (pageCode, fieldCode) => {
        const pageObj = getPageObj(pageCode);
        const field = pageObj?.fields?.find((f) => f.jsonPath === fieldCode);
        return { pageObj, field };
    };

    const isStringLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        if (fmt === "dropdown" || fmt === "radio" || tpe === "selection") return true;
        return ["string", "text", "textinput", "textarea"].includes(tpe);
    };

    const isCheckboxField = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        return tpe === "checkbox";
    };

    // numeric detection
    const isNumericField = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        const numericTags = ["number", "numeric", "integer"];
        return numericTags.includes(tpe) || numericTags.includes(fmt);
    };

    // integer-only sanitizer
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
        if (!field || isStringLike(field))
            return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");
        return ALL_OPERATOR_OPTIONS;
    };

    // ---------- parsing / serialization ----------
    const serializeSingle = (c) => {
        if (
            !c?.selectedPage?.code ||
            !c?.selectedField?.code ||
            !c?.comparisonType?.code ||
            c?.fieldValue === ""
        )
            return "";
        return `${c.selectedPage.code}.${c.selectedField.code}${c.comparisonType.code}${c.fieldValue}`;
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
        selectedPage: {},
        selectedField: {},
        comparisonType: {},
        fieldValue: "",
        joiner: { code: "&&", name: "AND" },
    });

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
                const left = expression.slice(0, i);
                const right = expression.slice(i + operator.length);
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

    const buildConditionsFromExpression = (raw = "") => {
        if (!raw?.trim()) return [initialEmptyCondition()];
        const tokens = tokenize(raw);
        if (!tokens.length) return [initialEmptyCondition()];
        const conds = [];
        let pendingJoin = "&&";
        tokens.forEach((t) => {
            if (t.type === "op") {
                pendingJoin = t.value;
            } else {
                const base = parseSingle(t.value);
                conds.push(
                    conds.length === 0
                        ? { ...base, joiner: { code: "&&", name: "AND" } }
                        : {
                            ...base,
                            joiner: { code: pendingJoin, name: pendingJoin === "||" ? "OR" : "AND" },
                        }
                );
            }
        });
        return conds.length ? conds : [initialEmptyCondition()];
    };

    // ---------- state ----------
    // committed (saved) expression — used for outside summary and to notify parent
    const [committedExpression, setCommittedExpression] = useState(
        selectedFieldItem?.visibilityCondition?.expression?.trim() || ""
    );

    // draft conditions for the popup editor
    const [conditions, setConditions] = useState(() =>
        buildConditionsFromExpression(committedExpression)
    );

    // popup + errors
    const [showPopUp, setShowPopUp] = useState(false);
    const [globalFormError, setGlobalFormError] = useState("");

    // condition completeness
    const isConditionComplete = (c) =>
        Boolean(c?.selectedPage?.code) &&
        Boolean(c?.selectedField?.code) &&
        Boolean(c?.comparisonType?.code) &&
        String(c?.fieldValue ?? "").trim() !== "";

    // overall validity
    const allComplete = conditions.every(isConditionComplete);

    useEffect(() => {
        if (globalFormError && allComplete) setGlobalFormError("");
    }, [allComplete, globalFormError]);


    // ---------- popup helpers ----------
    const openPopup = () => {
        // seed draft from last committed expression whenever opening
        setConditions(buildConditionsFromExpression(committedExpression));
        setGlobalFormError("");
        setShowPopUp(true);
    };
    const closePopup = () => {
        // discard draft changes on close
        setConditions(buildConditionsFromExpression(committedExpression));
        setGlobalFormError("");
        setShowPopUp(false);
    };

    const updateCond = (index, patch) => {
        setConditions((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
    };

    const changeJoiner = (index, joinCode) => {
        if (index <= 0) return;
        setConditions((prev) =>
            prev.map((c, i) =>
                i === index
                    ? { ...c, joiner: { code: joinCode, name: joinCode === "||" ? "OR" : "AND" } }
                    : c
            )
        );
    };

    const addCondition = () => {
        setConditions((prev) => [...prev, initialEmptyCondition()]);
    };

    const removeCondition = (index) => {
        setConditions((prev) => {
            const next = prev.filter((_, i) => i !== index);
            if (!next.length) return [initialEmptyCondition()];
            next[0] = { ...next[0], joiner: { code: "&&", name: "AND" } };
            return next;
        });
    };

    // ---------- summary pill text ----------
    const findPageOptionByCode = (code) =>
        pageOptions.find((p) => p.code === code) || (code ? { code, name: code } : {});
    const findFieldOptionByCode = (pageCode, fieldCode) => {
        const opts = getFieldOptions(pageCode);
        return (
            opts.find((f) => f.code === fieldCode) ||
            (fieldCode ? { code: fieldCode, name: fieldCode, label: fieldCode } : {})
        );
    };

    const formatConditionLabel = (c) => {
        if (!c?.selectedPage?.code || !c?.selectedField?.code) return incompleteExprLabel;
        const { field } = getFieldMeta(c.selectedPage.code, c.selectedField.code);
        const fieldLabel = field?.label
            ? t(field.label) || field.label
            : `${c.selectedPage.code}.${c.selectedField.code}`;
        const op = c?.comparisonType?.code || "";
        let valueText = c?.fieldValue || "";
        valueText = `${valueText}`.replace(/[()]/g, "");
        return `${useT(fieldLabel)} ${t(op)} ${field?.format === "dropdown" || field?.format === "radio" || field?.type === "selection" || field?.type === "checkbox"
            ? useT(valueText)
            : valueText
            }`.trim();
    };

    // UI button label/icon based on committed expression
    const hasExisting = committedExpression.trim().length > 0;
    const primaryButtonLabel = hasExisting ? editDisplayLogicLabel : addDisplayLogicLabel;
    const primaryIcon = hasExisting ? "Edit" : "Add";

    // ---------- render ----------
    return (
        <Card type="secondary">
            {/* Title */}
            <div style={{ marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0 }}>{displayLogicLabel}</h3>
            </div>

            {/* Expression breakdown (committed only; never show incomplete) */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    maxWidth: "100%",
                    marginBottom: "0.75rem",
                }}
            >
                {(() => {
                    const committedConds = buildConditionsFromExpression(committedExpression);
                    const completeConds = committedConds.filter(isConditionComplete);
                    if (completeConds.length === 0) {
                        return <p style={{ opacity: 0.7, margin: 0 }}>{noLogicAddedLabel}</p>;
                    }
                    return completeConds.map((c, idx) => {
                        const label = formatConditionLabel(c) || incompleteExprLabel;
                        return (
                            <React.Fragment key={`out-cond-${idx}`}>
                                {idx > 0 && (
                                    <span
                                        style={{
                                            background: "#E8F0FE",
                                            color: "#1a73e8",
                                            borderRadius: 4,
                                            padding: "0.1rem 0.4rem",
                                            fontSize: "0.75rem",
                                            alignSelf: "center",
                                        }}
                                    >
                                        {c.joiner?.code === "||" ? orText : andText}
                                    </span>
                                )}
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.35rem",
                                        maxWidth: "100%",
                                    }}
                                >
                                    <Tag
                                        label={label}
                                        showIcon={false}
                                        stroke={true}
                                        style={{ background: "#EFF8FF", height: "fit-content", maxWidth: "100%" }}
                                        className={"version-tag"}
                                        labelStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                    />
                                </div>
                            </React.Fragment>
                        );
                    });
                })()}
            </div>

            {/* Add/Edit button */}
            <div>
                <Button
                    variation="secondary"
                    label={primaryButtonLabel}
                    onClick={openPopup}
                    icon={primaryIcon}
                    style={{ width: "fit-content" }}
                />
            </div>

            {/* PopUp */}
            {showPopUp && (
                <BodyPortal>
                    <div className="popup-portal-overlay">
                        <PopUp
                            className="digit-popup--fullscreen"
                            type={"default"}
                            heading={primaryButtonLabel}
                            children={[
                                <div key="builder" style={{ display: "grid", gap: "1rem" }}>
                                    {conditions.map((cond, idx) => {
                                        const fieldOptions = cond?.selectedPage?.code ? getFieldOptions(cond.selectedPage.code) : [];
                                        const selectedFieldObj = fieldOptions.find((f) => f.code === cond?.selectedField?.code);
                                        const operatorOptions = getOperatorOptions(selectedFieldObj);
                                        const selectedOperator = cond?.comparisonType?.code
                                            ? operatorOptions.find((o) => o.code === cond.comparisonType.code)
                                            : undefined;

                                        return (
                                            <div
                                                key={`cond-card-${idx}`}
                                                style={{
                                                    background: "#FAFAFA",
                                                    border: "1px solid #F5D8C6",
                                                    borderRadius: 8,
                                                    padding: "0.75rem",
                                                    display: "grid",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                {/* Join-with for items after the first */}
                                                {idx > 0 && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        <span style={{ fontWeight: 600 }}>{joinWithLabel}</span>
                                                        <div style={{ width: 160, maxWidth: "100%" }}>
                                                            <Dropdown
                                                                option={LOGICALS}
                                                                optionKey="name"
                                                                name={`joiner-${idx}`}
                                                                t={t}
                                                                select={(e) => changeJoiner(idx, e.code)}
                                                                selected={cond.joiner}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Row: Page | Field | Operator | Value | Delete */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "0.75rem",
                                                        alignItems: "flex-end",
                                                    }}
                                                >
                                                    {/* Page */}
                                                    <div style={{ minWidth: 220, flex: "1 1 240px" }}>
                                                        <LabelFieldPair vertical removeMargin>
                                                            <p style={{ margin: 0 }}>{selectPageLabel}</p>
                                                            <div className="digit-field" style={{ width: "100%" }}>
                                                                <Dropdown
                                                                    option={pageOptions}
                                                                    optionKey="code"
                                                                    name={`page-${idx}`}
                                                                    t={t}
                                                                    select={(e) =>
                                                                        updateCond(idx, {
                                                                            selectedPage: e,
                                                                            selectedField: {},
                                                                            fieldValue: "",
                                                                            comparisonType: {},
                                                                        })
                                                                    }
                                                                    selected={
                                                                        cond?.selectedPage?.code
                                                                            ? findPageOptionByCode(cond.selectedPage.code)
                                                                            : cond.selectedPage
                                                                    }
                                                                />
                                                            </div>
                                                        </LabelFieldPair>
                                                    </div>

                                                    {/* Field */}
                                                    <div style={{ minWidth: 260, flex: "1 1 280px" }}>
                                                        <LabelFieldPair vertical removeMargin>
                                                            <p style={{ margin: 0 }}>{selectFieldLabel}</p>
                                                            <div className="digit-field" style={{ width: "100%" }}>
                                                                <Dropdown
                                                                    option={fieldOptions}
                                                                    optionKey="label"
                                                                    name={`field-${idx}`}
                                                                    t={useT}
                                                                    select={(e) => {
                                                                        const nextOps = getOperatorOptions(e);
                                                                        const canKeep =
                                                                            cond?.comparisonType?.code &&
                                                                            nextOps.some((o) => o.code === cond.comparisonType.code);

                                                                        const isCk = isCheckboxField(e);
                                                                        updateCond(idx, {
                                                                            selectedField: e,
                                                                            fieldValue: isCk
                                                                                ? (["true", "false"].includes(String(cond.fieldValue).toLowerCase())
                                                                                    ? cond.fieldValue
                                                                                    : "false")
                                                                                : "",
                                                                            comparisonType: canKeep
                                                                                ? cond.comparisonType
                                                                                : (isCk ? { code: "==", name: t("EQUALS_TO") || "equals to" } : {}),
                                                                        });
                                                                    }}
                                                                    selected={
                                                                        cond?.selectedField?.code
                                                                            ? findFieldOptionByCode(cond?.selectedPage?.code, cond.selectedField.code)
                                                                            : cond.selectedField
                                                                    }
                                                                    disabled={!cond?.selectedPage?.code}
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
                                                                    name={`op-${idx}`}
                                                                    t={t}
                                                                    select={(e) => updateCond(idx, { comparisonType: e })}
                                                                    disabled={!cond?.selectedField?.code}
                                                                    selected={selectedOperator}
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
                                                                    // Checkbox as boolean value control
                                                                    if (selectedFieldObj && isCheckboxField(selectedFieldObj)) {
                                                                        const boolVal = String(cond.fieldValue).toLowerCase() === "true";
                                                                        return (
                                                                            <CheckBox
                                                                                mainClassName={"app-config-checkbox-main"}
                                                                                labelClassName={"app-config-checkbox-label"}
                                                                                onChange={(v) => {
                                                                                    const checked = typeof v === "boolean" ? v : !!v?.target?.checked;
                                                                                    updateCond(idx, { fieldValue: checked ? "true" : "false" });
                                                                                }}
                                                                                value={boolVal}
                                                                                label={t(selectedFieldObj?.label) || selectedFieldObj?.label || ""}
                                                                                isLabelFirst={false}
                                                                                disabled={!cond?.selectedField?.code}
                                                                            />
                                                                        );
                                                                    }

                                                                    const isSelect =
                                                                        selectedFieldObj &&
                                                                        (selectedFieldObj.format === "dropdown" ||
                                                                            selectedFieldObj.format === "radio" ||
                                                                            selectedFieldObj.type === "selection");

                                                                    if (isSelect) {
                                                                        // 1) inline enums
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
                                                                                    optionKey="code"
                                                                                    name={`val-${idx}`}
                                                                                    t={useT}
                                                                                    select={(e) => updateCond(idx, { fieldValue: e.code })}
                                                                                    disabled={!cond?.selectedField?.code}
                                                                                    selected={selectedEnum}
                                                                                />
                                                                            );
                                                                        }

                                                                        // 2) MDMS schema
                                                                        if (selectedFieldObj.schemaCode) {
                                                                            return (
                                                                                <MdmsValueDropdown
                                                                                    schemaCode={selectedFieldObj.schemaCode}
                                                                                    value={cond.fieldValue}
                                                                                    onChange={(code) => updateCond(idx, { fieldValue: code })}
                                                                                    t={useT}
                                                                                />
                                                                            );
                                                                        }

                                                                        // 3) fallback text
                                                                        return (
                                                                            <TextInput
                                                                                type="text"
                                                                                populators={{ name: `text-${idx}` }}
                                                                                placeholder={enterValueLabel}
                                                                                value={cond.fieldValue}
                                                                                onChange={(event) => updateCond(idx, { fieldValue: event.target.value })}
                                                                                disabled={!cond?.selectedField?.code}
                                                                            />
                                                                        );
                                                                    }

                                                                    // Non-select numeric/text
                                                                    const numericValue = isNumericField(selectedFieldObj);
                                                                    return (
                                                                        <TextInput
                                                                            type="text"
                                                                            populators={{ name: `text-${idx}` }}
                                                                            placeholder={numericValue ? t("ENTER_INTEGER_VALUE") || enterValueLabel : enterValueLabel}
                                                                            value={cond.fieldValue}
                                                                            onChange={(event) => {
                                                                                const raw = event.target.value;
                                                                                const next = numericValue ? sanitizeIntegerInput(raw) : raw;
                                                                                updateCond(idx, { fieldValue: next });
                                                                            }}
                                                                            disabled={!cond?.selectedField?.code}
                                                                        />
                                                                    );
                                                                })()}
                                                            </div>
                                                        </LabelFieldPair>
                                                    </div>

                                                    {/* Delete */}
                                                    <div
                                                        style={{
                                                            marginLeft: "auto",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.25rem",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => removeCondition(idx)}
                                                        title={removeConditionLabel}
                                                        aria-label={removeConditionLabel}
                                                        role="button"
                                                    >
                                                        <SVG.Delete fill={"#C84C0E"} width={"1.25rem"} height={"1.25rem"} />
                                                        <span style={{ color: "#C84C0E", fontSize: "0.875rem", fontWeight: 500 }}>
                                                            {removeConditionLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Add condition */}
                                    <div>
                                        <Button
                                            variation="secondary"
                                            label={addConditionLabel}
                                            icon="Add"
                                            onClick={addCondition}
                                            style={{ minWidth: "auto" }}
                                        />
                                    </div>

                                    {/* Global error (only if attempting to submit) */}
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
                                </div>,
                            ]}
                            onOverlayClick={closePopup}
                            onClose={closePopup}
                            equalWidthButtons={"false"}
                            footerChildren={[
                                <Button
                                    key="close"
                                    type={"button"}
                                    size={"large"}
                                    variation={"secondary"}
                                    label={closeLabel}
                                    onClick={closePopup}
                                />,
                                <Button
                                    key="submit"
                                    type={"button"}
                                    size={"large"}
                                    variation={"primary"}
                                    disabled={!allComplete}
                                    label={submitLabel}
                                    onClick={() => {
                                        if (!allComplete) {
                                            setGlobalFormError(completeAllMsg);
                                            return;
                                        }
                                        const expr = serializeAll(conditions);
                                        setCommittedExpression(expr);
                                        onExpressionChange?.(expr); // commit only on submit
                                        setShowPopUp(false);
                                    }}
                                />,
                            ]}
                        />
                    </div>
                </BodyPortal>
            )}
        </Card>
    );
}

export default React.memo(DependentFieldsWrapper);
