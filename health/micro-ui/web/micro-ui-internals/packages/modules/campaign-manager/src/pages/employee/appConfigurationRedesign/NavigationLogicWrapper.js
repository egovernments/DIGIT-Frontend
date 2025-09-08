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
            select={(e) => onChange(e.code)}
            disabled={isLoading || !module || !master}
            selected={selectedOption}
        />
    );
}

/** Portal so the popup escapes side panels and fills the viewport layer */
function BodyPortal({ children }) {
    if (typeof document === "undefined") return null;
    return ReactDOM.createPortal(children, document.body);
}

function NavigationLogicWrapper({
    t,
    parentState,
    currentState,
    onConditionalNavigateChange,
}) {
    const customT = useCustomT();

    // ----- labels -----
    const navLogicTitle = t("NAVIGATION_LOGIC") || "Navigation Logic";
    const addRuleLabel = t("HCM_ADD_RULE") || "Add Logic";
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
    const submitLabel = t("SUBMIT") || "Submit";
    const andText = t("AND") || "And";
    const orText = t("OR") || "Or";
    const incompleteExprLabel = t("INCOMPLETE_EXPRESSION") || "(incomplete)";
    const completeAllMsg =
        t("PLEASE_COMPLETE_ALL_CONDITIONS") ||
        "Please complete all conditions and select a target page before confirming.";

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

    const currentPage = currentState?.name;
    const currentTemplate = parentState?.currentTemplate || [];
    const currentPageObj = currentState?.cards?.[0];
    const existingConditional = Array.isArray(currentState?.conditionalNavigateTo)
        ? currentState.conditionalNavigateTo
        : [];

    // All fields from current page (no order restriction, skip template fields)
    const currentPageFieldOptions = useMemo(() => {
        const fields = currentPageObj?.fields || [];
        return fields
            .filter((f) => f?.type !== "template")
            .map((f) => ({
                code: f.jsonPath,
                name: f.jsonPath,
                label: f.label,
                format: f.format,
                type: f.type || f.datatype || f.format || "string",
                enums: f.dropDownOptions || [],
                schemaCode: f.schemaCode,
            }));
    }, [currentPageObj]);

    // Target page dropdown: ALL pages
    const allPageOptions = useMemo(() => {
        const seen = new Set();
        const list = [];

        const add = (p) => {
            if (!p?.name || seen.has(p.name)) return;
            seen.add(p.name);
            list.push({ code: p.name, name: p.name, type: p.type }); // <-- keep page type
        };

        // Prefer the template object for the current page (so we get its type)
        const currFromTemplate = currentTemplate.find((p) => p?.name === currentPage);
        add(currFromTemplate || { name: currentPage, type: currentState?.type || "object" });

        currentTemplate.forEach(add);
        return list;
    }, [currentTemplate, currentPage, currentState?.type]);


    const getFieldMeta = (fieldCode) =>
        currentPageObj?.fields?.find((f) => f.jsonPath === fieldCode) || null;

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
            // restrict to equality operators for checkbox
            return ALL_OPERATOR_OPTIONS.filter((o) => o.code === "==" || o.code === "!=");
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
                const left = expression.slice(0, i);
                const right = expression.slice(i + operator.length);
                const parts = (left || "").split(".").map((s) => (s || "").trim());
                const fieldCode = parts.length > 1 ? parts.slice(1).join(".") : parts[0]; // drop page prefix
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
        if (!currentPage) return "";
        if (!c?.selectedField?.code || !c?.comparisonType?.code || c?.fieldValue === "") return "";
        return `${currentPage}.${c.selectedField.code}${c.comparisonType.code}${c.fieldValue}`;
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

    // ---------- normalization helpers ----------
    const findFieldOptionByCode = (code) =>
        currentPageFieldOptions.find((f) => f.code === code) || (code ? { code, name: code, label: code } : {});
    const findPageOptionByCode = (code) =>
        allPageOptions.find((p) => p.code === code) ||
        (code ? { code, name: code, type: currentTemplate.find((p) => p?.name === code)?.type } : {});

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

    const showPopUp = editorIndex !== null;

    useEffect(() => {
        if (!showPopUp) {
            const fresh = makeRulesFromExisting();
            setRules(fresh);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(existingConditional), showPopUp]);

    const openEditor = (idx) => {
        setRules((prev) => prev.map((r, i) => (i === idx ? normalizeRule(r) : r)));
        setGlobalFormError("");
        setEditorIndex(idx);
    };

    const addRule = () => {
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
        setEditorIndex(null);
    };

    const updateRule = (idx, patch) =>
        setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

    const deleteRuleFromList = (idx) =>
        setRules((prev) => prev.filter((_, i) => i !== idx));

    // ----- condition operations -----
    const updateCond = (ruleIdx, condIdx, patch) =>
        setRules((prev) =>
            prev.map((r, i) =>
                i !== ruleIdx
                    ? r
                    : { ...r, conds: r.conds.map((c, j) => (j === condIdx ? { ...c, ...patch } : c)) }
            )
        );

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
        setRules((prev) =>
            prev.map((r, i) => (i === ruleIdx ? { ...r, conds: [...r.conds, initialEmptyCondition()] } : r))
        );

    const removeCondition = (ruleIdx, condIdx) =>
        setRules((prev) =>
            prev.map((r, i) => {
                if (i !== ruleIdx) return r;
                const nextConds = r.conds.filter((_, j) => j !== condIdx);
                if (!nextConds.length) nextConds.push(initialEmptyCondition());
                nextConds[0] = { ...nextConds[0], joiner: { code: "&&", name: "AND" } };
                return { ...r, conds: nextConds };
            })
        );

    // ----- validation -----
    const isCondComplete = (c) =>
        Boolean(c?.selectedField?.code) &&
        Boolean(c?.comparisonType?.code) &&
        String(c?.fieldValue ?? "").trim() !== "";

    const isRuleComplete = (r) =>
        r?.conds?.every(isCondComplete) &&
        Boolean(r?.targetPage?.code || r?.targetPage?.name);

    const canSubmit = showPopUp && editorIndex !== null ? isRuleComplete(rules[editorIndex]) : false;

    // Auto-clear global error when form becomes valid
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
                // find the page to get its type
                const page =
                    allPageOptions.find((p) => p.code === name) ||
                    currentTemplate.find((p) => p?.name === name);

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


    const submitAndClose = () => {
        if (!canSubmit) {
            setGlobalFormError(completeAllMsg);
            return;
        }
        const next = buildPayload(rules);
        onConditionalNavigateChange?.(next);
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
        return `${customT(fieldLabel)} ${t(op)} ${field?.format === "dropdown" || field?.format === "radio" || field?.type === "selection" || field?.type === "checkbox"
            ? customT(valueText)
            : valueText
            }`.trim();
    };

    const formatRuleSummary = (rule) => {
        const segs = [];
        rule.conds.forEach((c, idx) => {
            const lbl = formatConditionLabel(c);
            if (idx > 0) segs.push(c.joiner?.code === "||" ? orText : andText);
            segs.push(lbl);
        });
        const condText = segs.join(" ");
        const goTo = t(rule.targetPage?.name || rule.targetPage?.code || "HCM_UNSET");
        return `${condText || incompleteExprLabel} → ${t("HCM_NAVIGATE_TO") || "navigate to"} ${goTo}`;
    };

    // ----- UI -----
    return (
        <Card type="secondary">
            {/* Title */}
            <div style={{ marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0 }}>{navLogicTitle}</h3>
            </div>

            {/* Rules list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {rules.length === 0 ? (
                    <p style={{ opacity: 0.7, margin: 0 }}>{noRulesYet}</p>
                ) : (
                    rules.map((r, idx) => (
                        <div key={`rule-preview-${idx}`} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            <Tag
                                label={formatRuleSummary(r)}
                                showIcon={false}
                                stroke={true}
                                style={{ background: "#EFF8FF", height: "fit-content", maxWidth: "100%" }}
                                className={"version-tag"}
                                labelStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem" }}>
                                <div
                                    role="button"
                                    title={editLabel}
                                    aria-label={editLabel}
                                    onClick={() => openEditor(idx)}
                                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                                >
                                    {SVG?.Edit ? (
                                        <SVG.Edit fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} />
                                    ) : (
                                        <Button variation="secondary" label={editLabel} onClick={() => openEditor(idx)} />
                                    )}
                                </div>
                                <div
                                    role="button"
                                    title={deleteRuleLabel}
                                    aria-label={deleteRuleLabel}
                                    onClick={() => deleteRuleFromList(idx)}
                                    style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
                                >
                                    <SVG.Delete fill={"#C84C0E"} width={"1.1rem"} height={"1.1rem"} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Logic button */}
            <div>
                <Button
                    variation="secondary"
                    label={addRuleLabel}
                    onClick={addRule}
                    icon="Add"
                    style={{ width: "fit-content" }}
                />
            </div>

            {/* Single-rule editor popup */}
            {showPopUp && editorIndex !== null && rules[editorIndex] && (
                <BodyPortal>
                    <div className="popup-portal-overlay">
                        <PopUp
                            className="digit-popup--fullscreen"
                            type={"default"}
                            heading={editLabel}
                            children={[
                                <div key="single-rule-editor" style={{ display: "grid", gap: "1rem" }}>
                                    {(() => {
                                        const rule = rules[editorIndex];

                                        return (
                                            <div
                                                key={`rule-card-${editorIndex}`}
                                                style={{
                                                    background: "#FAFAFA",
                                                    border: "1px solid #F5D8C6",
                                                    borderRadius: 8,
                                                    padding: "0.75rem",
                                                    display: "grid",
                                                    gap: "0.75rem",
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
                                                        <div
                                                            key={`cond-row-${editorIndex}-${idx}`}
                                                            style={{
                                                                background: "#FFF",
                                                                border: "1px dashed #EAC5AD",
                                                                borderRadius: 8,
                                                                padding: "0.75rem",
                                                                display: "grid",
                                                                gap: "0.5rem",
                                                            }}
                                                        >
                                                            {idx > 0 && (
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
                                                            )}

                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
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
                                                                                        ? currentPageFieldOptions.find((f) => f.code === cond.selectedField.code)
                                                                                        : cond.selectedField
                                                                                }
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
                                                                                t={t}
                                                                                select={(e) => updateCond(editorIndex, idx, { comparisonType: e })}
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
                                                                                // Checkbox value as boolean using CheckBox
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
                                                                                                name={`val-${editorIndex}-${idx}`}
                                                                                                t={customT}
                                                                                                select={(e) => updateCond(editorIndex, idx, { fieldValue: e.code })}
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
                                                                                                onChange={(code) => updateCond(editorIndex, idx, { fieldValue: code })}
                                                                                                t={customT}
                                                                                            />
                                                                                        );
                                                                                    }

                                                                                    // 3) fallback text
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

                                                                                // Non-select numeric/text
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

                                                                {/* Remove condition */}
                                                                <div
                                                                    style={{
                                                                        marginLeft: "auto",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "0.25rem",
                                                                        cursor: "pointer",
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
                                                                option={allPageOptions}
                                                                optionKey="code"
                                                                name={`target-${editorIndex}`}
                                                                t={t}
                                                                select={(e) => updateRule(editorIndex, { targetPage: e })}
                                                                selected={
                                                                    rules[editorIndex]?.targetPage?.code
                                                                        ? allPageOptions.find((p) => p.code === rules[editorIndex].targetPage.code) ||
                                                                        rules[editorIndex].targetPage
                                                                        : rules[editorIndex].targetPage
                                                                }
                                                            />
                                                        </div>
                                                    </LabelFieldPair>
                                                </div>

                                                {/* Global error (dismissible) */}
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
                                </div>,
                            ]}
                            onOverlayClick={discardAndCloseEditor}
                            onClose={discardAndCloseEditor}
                            equalWidthButtons={"false"}
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
                                    disabled={!canSubmit}
                                    label={submitLabel}
                                    onClick={submitAndClose}
                                />,
                            ]}
                        />
                    </div>
                </BodyPortal>
            )}
        </Card>
    );
}

export default React.memo(NavigationLogicWrapper);
