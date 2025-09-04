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
    true //mdmsv2
  );

  const options = React.useMemo(
    () =>
      Array.isArray(list)
        ? list.map((it) => ({ code: it.code, name: it.name }))
        : [],
    [list]
  );

  // IMPORTANT: normalize the selected value to an option object
  const selectedOption = React.useMemo(() => {
    if (!value) return undefined;
    const match = options.find((o) => String(o.code) === String(value));
    // If the code isn't in options yet (or ever), keep a shallow object so Dropdown can show it
    return match || { code: value, name: value };
  }, [options, value]);

  return (
    <Dropdown
      option={options}
      optionKey="code"
      name={`mdms-${module}-${master}`}
      t={t}                           // pass custom translator if names are i18n keys
      select={(e) => onChange(e.code)}
      disabled={isLoading || !module || !master}
      selected={selectedOption}       // <-- object, not just the string code
    />
  );
}


/** Portal so the popup escapes side panels and fills the viewport layer */
function BodyPortal({ children }) {
    if (typeof document === "undefined") return null; // SSR guard
    return ReactDOM.createPortal(children, document.body);
}

/**
 * NavigationLogicWrapper (page-level, single-rule editor, submit-only)
 *
 * Emits on Submit:
 *   conditionalNavigateTo: [
 *     { condition: "<currentPage>.<jsonPath><op><value>", navigateTo: { name: "<page>", type: "form" } }
 *   ]
 *
 * Props:
 * - t
 * - parentState  // provides currentTemplate (array of pages)
 * - currentState // { name, cards: [{ fields: [...] }], conditionalNavigateTo?: [...] }
 * - onConditionalNavigateChange(array)
 */
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
                schemaCode: f.schemaCode
            }));
    }, [currentPageObj]);

    // Target page dropdown: ALL pages (no hard type check)
    const allPageOptions = useMemo(() => {
        const seen = new Set();
        const list = [];
        if (currentPage) {
            seen.add(currentPage);
            list.push({ code: currentPage, name: currentPage });
        }
        for (const p of currentTemplate) {
            if (p?.name && !seen.has(p.name)) {
                seen.add(p.name);
                list.push({ code: p.name, name: p.name });
            }
        }
        return list;
    }, [currentTemplate, currentPage]);

    const getFieldMeta = (fieldCode) => {
        const field = currentPageObj?.fields?.find((f) => f.jsonPath === fieldCode);
        return field || null;
    };

    const isStringLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        if (fmt === "dropdown" || fmt === "radio") return true;
        return ["string", "text", "textinput"].includes(tpe);
    };

    const isNumericLike = (field) => {
        const tpe = (field?.type || "").toLowerCase();
        const fmt = (field?.format || "").toLowerCase();
        return ["number", "numeric", "integer"].includes(tpe) || ["number", "numeric", "integer"].includes(fmt);
    };

    const getOperatorOptions = (field) => {
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
                const fieldCode = parts.length > 1 ? parts.slice(1).join(".") : parts[0]; // drop any page prefix
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
                if (andPos < orPos) { nextOp = "&&"; nextIdx = andPos; }
                else { nextOp = "||"; nextIdx = orPos; }
            } else if (hasAnd) { nextOp = "&&"; nextIdx = andPos; }
            else { nextOp = "||"; nextIdx = orPos; }
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
        targetPage: {}, // {code, name}
        targetType: "form",
    });

    // ---------- normalization helpers ----------
    const findFieldOptionByCode = (code) =>
        currentPageFieldOptions.find((f) => f.code === code) || (code ? { code, name: code, label: code } : {});
    const findPageOptionByCode = (code) =>
        allPageOptions.find((p) => p.code === code) || (code ? { code, name: code } : {});
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
            targetType: r?.targetType || "form",
        };
    };

    // ----- seed & syncing (no live emits) -----
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
                targetType: r?.navigateTo?.type || "form",
            };
        });
        return seeded.map(normalizeRule);
    };

    const [rules, setRules] = useState(() => makeRulesFromExisting());
    const [editorIndex, setEditorIndex] = useState(null); // which rule is being edited
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
        setEditorIndex(null);
    };

    const updateRule = (idx, patch) =>
        setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

    const deleteRuleFromList = (idx) =>
        setRules((prev) => prev.filter((_, i) => i !== idx));

    // ----- condition operations (within a single rule) -----
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
                        "condition": "referralDetails.referralReason!= '' || referralDetails.referralType!= null",
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

    // ----- payload builder & submit -----
    const buildPayload = (rs) =>
        rs
            .map((r) => ({
                condition: serializeAll(r.conds),
                navigateTo: {
                    name: r.targetPage?.code || r.targetPage?.name || "",
                    type: r.targetType || "form",
                },
            }))
            .filter((r) => r.condition && r.navigateTo.name);

    const submitAndClose = () => {
        const next = buildPayload(rules);
        onConditionalNavigateChange?.(next); // emit only on Submit
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
        return `${customT(fieldLabel)} ${t(op)} ${(field?.format === "dropdown" || field?.format === "radio") ? customT(valueText) : valueText}`.trim();
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

            {/* Rules list with actions BELOW the tag, right-aligned */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {rules.length === 0 ? (
                    <p style={{ opacity: 0.7, margin: 0 }}>{noRulesYet}</p>
                ) : (
                    rules.map((r, idx) => (
                        <div key={`rule-preview-${idx}`} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            {/* Tag row (unchanged) */}
                            <Tag
                                label={formatRuleSummary(r)}
                                showIcon={false}
                                stroke={true}
                                style={{ background: "#EFF8FF", height: "fit-content", maxWidth: "100%" }}
                                className={"version-tag"}
                                labelStyle={{ whiteSpace: "normal", wordBreak: "break-word" }}
                            />
                            {/* Actions row BELOW, right aligned */}
                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem" }}>
                                {/* Edit */}
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
                                {/* Delete (local; commit on Submit) */}
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

            {/* Add Logic button (outside the popup) */}
            <div>
                <Button
                    variation="secondary"
                    label={addRuleLabel}
                    onClick={addRule}
                    icon="Add"
                    style={{ width: "fit-content" }}
                />
            </div>

            {/* Single-rule editor popup (Submit commits; Cancel discards) */}
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
                                                {/* Conditions (allow multiple conditions inside a rule) */}
                                                {rule.conds.map((cond, idx) => {
                                                    const selectedFieldObj = cond?.selectedField?.code
                                                        ? currentPageFieldOptions.find((f) => f.code === cond.selectedField.code)
                                                        : undefined;
                                                    const operatorOptions = getOperatorOptions(selectedFieldObj);
                                                    const selectedOperator = cond?.comparisonType?.code
                                                        ? operatorOptions.find((o) => o.code === cond.comparisonType.code)
                                                        : undefined;

                                                    // numeric regex guard
                                                    const numericRegex = /^[+-]?\d*$/;
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
                                                                {/* Field (from current page) */}
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
                                                                                    updateCond(editorIndex, idx, {
                                                                                        selectedField: e,
                                                                                        fieldValue: "",
                                                                                        comparisonType: canKeep ? cond.comparisonType : {},
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
                                                                                const isSelect =
                                                                                    selectedFieldObj &&
                                                                                    (selectedFieldObj.format === "dropdown" || selectedFieldObj.format === "radio");

                                                                                if (isSelect) {
                                                                                    // 1) If enums exist, use them
                                                                                    if (Array.isArray(selectedFieldObj.enums) && selectedFieldObj.enums.length > 0) {
                                                                                        return (
                                                                                            <Dropdown
                                                                                                option={selectedFieldObj.enums.map((en) => ({ code: en.code, name: en.name }))}
                                                                                                optionKey="code"
                                                                                                name={`val-${editorIndex}-${idx}`}
                                                                                                t={customT} // pass custom translator if names are translation keys
                                                                                                select={(e) => updateCond(editorIndex, idx, { fieldValue: e.code })}
                                                                                                disabled={!cond?.selectedField?.code}
                                                                                                selected={cond.fieldValue}
                                                                                            />
                                                                                        );
                                                                                    }

                                                                                    // 2) Else if we have schemaCode, fetch from MDMS
                                                                                    if (selectedFieldObj.schemaCode) {
                                                                                        return (
                                                                                            <MdmsValueDropdown
                                                                                                schemaCode={selectedFieldObj.schemaCode}
                                                                                                value={cond.fieldValue}
                                                                                                onChange={(code) => updateCond(editorIndex, idx, { fieldValue: code })}
                                                                                                t={t} // use your custom translator for MDMS names if needed
                                                                                            />
                                                                                        );
                                                                                    }

                                                                                    // 3) Fallback: no enums and no schema -> plain text input
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

                                                                                // Non-select fields: keep your numeric/text guard
                                                                                return (
                                                                                    <TextInput
                                                                                        type="text"
                                                                                        populators={{ name: `text-${editorIndex}-${idx}` }}
                                                                                        placeholder={enterValueLabel}
                                                                                        value={cond.fieldValue}
                                                                                        onChange={(event) => {
                                                                                            const v = event.target.value;
                                                                                            if (numericField) {
                                                                                                if (numericRegex.test(v)) {
                                                                                                    updateCond(editorIndex, idx, { fieldValue: v });
                                                                                                }
                                                                                            } else {
                                                                                                updateCond(editorIndex, idx, { fieldValue: v });
                                                                                            }
                                                                                        }}
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

                                                {/* Target page (ALL pages) */}
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
                                                                        ? allPageOptions.find(
                                                                            (p) => p.code === rules[editorIndex].targetPage.code
                                                                        ) || rules[editorIndex].targetPage
                                                                        : rules[editorIndex].targetPage
                                                                }
                                                            />
                                                        </div>
                                                    </LabelFieldPair>
                                                </div>

                                                {/* No delete in popup */}
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
