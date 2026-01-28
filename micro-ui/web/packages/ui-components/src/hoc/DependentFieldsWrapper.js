import React, { useEffect, useMemo, useState } from "react";

function DependentFieldsWrapper({ t, parentState, onExpressionChange, screenConfig, selectedFieldItem }) {

  const PARSE_OPERATORS = useMemo(() => ['!==', '>=', '<=', '==', '>', '<'].sort((a, b) => b.length - a.length), []);

  const ALL_OPERATOR_OPTIONS = [
    { code: '==',  name: t('EQUALS_TO') || 'equals to' },
    { code: '!==', name: t('NOT_EQUALS_TO') || 'not equals to' },
    { code: '>=',  name: t('GREATER_THAN_OR_EQUALS_TO') },
    { code: '<=',  name: t('LESS_THAN_OR_EQUALS_TO') },
    { code: '>',   name: t('GREATER_THAN') },
    { code: '<',   name: t('LESS_THAN') },
  ];

  const LOGICALS = [
    { code: '&&', name: 'AND' },
    { code: '||', name: 'OR' },
  ];

  const currentPage = screenConfig?.[0]?.name;
  const currentTemplate = parentState?.currentTemplate || [];

  // Exclude template pages + keep current and previous pages
  const pageOptions = useMemo(() => {
    const withoutTemplates = currentTemplate.filter((p) => p?.type !== "template");
    const idx = withoutTemplates.findIndex((p) => p.name === currentPage);
    const upto = idx === -1 ? withoutTemplates : withoutTemplates.slice(0, idx + 1);
    return upto.map((p) => ({ code: p.name, name: p.name, type: p.type }));
  }, [currentTemplate, currentPage]);

  const getFieldOptions = (pageCode) => {
    const pageObj = currentTemplate.find((p) => p.name === pageCode)?.cards?.[0];
    if (!pageObj?.fields) return [];
    // Exclude template fields
    return pageObj.fields
      .filter((f) => f?.type !== "template")
      .filter((f) => pageCode !== currentPage || f.order < selectedFieldItem?.order)
      .map((f) => ({
        code: f.jsonPath,
        name: f.jsonPath,
        format: f.format,
        type: f.type || f.datatype || f.format || 'string',
        enums: f.dropDownOptions || [],
      }));
  };

  const isStringLike = (field) => {
    const tpe = (field?.type || '').toLowerCase();
    const fmt = (field?.format || '').toLowerCase();
    if (fmt === 'dropdown') return true;
    return ['string', 'text', 'textinput'].includes(tpe);
  };

  const getOperatorOptions = (field) => {
    if (!field || isStringLike(field)) {
      return ALL_OPERATOR_OPTIONS.filter((o) => o.code === '==' || o.code === '!==');
    }
    return ALL_OPERATOR_OPTIONS;
  };

  const parseSingle = (expression = "") => {
    for (const operator of PARSE_OPERATORS) {
      const i = expression.indexOf(operator);
      if (i !== -1) {
        const left = expression.slice(0, i);
        const right = expression.slice(i + operator.length);
        const [pageCode = '', fieldCode = ''] = (left || '').split('.').map((s) => (s || '').trim());
        return {
          selectedPage: pageCode ? { code: pageCode, name: pageCode } : {},
          selectedField: fieldCode ? { code: fieldCode, name: fieldCode } : {},
          comparisonType: { code: operator, name: operator },
          fieldValue: (right || '').trim(),
        };
      }
    }
    return { selectedPage: {}, selectedField: {}, comparisonType: {}, fieldValue: '' };
  };

  const splitByJoiners = (expr = "") => {
    const chunks = [];
    const joiners = [];
    let i = 0;
    while (i < expr.length) {
      const jj = expr.indexOf("&&", i);
      const kk = expr.indexOf("||", i);
      let next; let which;
      if (jj === -1 && kk === -1) {
        next = -1;
      } else if (jj !== -1 && kk !== -1) {
        if (jj < kk) { next = jj; which = "&&"; } else { next = kk; which = "||"; }
      } else if (jj !== -1) { next = jj; which = "&&"; }
      else { next = kk; which = "||"; }

      if (next === -1) {
        chunks.push(expr.slice(i).trim());
        break;
      } else {
        chunks.push(expr.slice(i, next).trim());
        joiners.push(which);
        i = next + which.length;
      }
    }
    return { chunks, joiners };
  };

  const serializeSingle = (c) => {
    if (!c?.selectedPage?.code || !c?.selectedField?.code || !c?.comparisonType?.code || c?.fieldValue === "") return "";
    return `${c.selectedPage.code}.${c.selectedField.code}${c.comparisonType.code}${c.fieldValue}`;
  };

  const serializeAll = (list) => {
    const parts = [];
    list.forEach((c, i) => {
      const seg = serializeSingle(c);
      if (!seg) return;
      if (i > 0 && c.joiner?.code) parts.push(c.joiner.code);
      parts.push(seg);
    });
    return parts.join(' ');
  };

  const initialConditions = () => {
    const raw = selectedFieldItem?.visibilityCondition?.expression || "";
    if (!raw) return [{ selectedPage: {}, selectedField: {}, comparisonType: {}, fieldValue: '', joiner: { code: '&&', name: 'AND' } }];

    const { chunks, joiners } = splitByJoiners(raw);
    const conds = chunks.map(parseSingle);
    const out = conds.map((c, i) => ({
      ...c,
      joiner: i === 0 ? { code: '&&', name: 'AND' } : { code: joiners[i - 1] || '&&', name: (joiners[i - 1] === '||') ? 'OR' : 'AND' },
    }));
    return out.length ? out : [{ selectedPage: {}, selectedField: {}, comparisonType: {}, fieldValue: '', joiner: { code: '&&', name: 'AND' } }];
  };

  const [conditions, setConditions] = useState(initialConditions);

  useEffect(() => {
    onExpressionChange?.(serializeAll(conditions));
  }, [conditions, onExpressionChange]);

  const updateCondition = (index, patch) => {
    setConditions((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { selectedPage: {}, selectedField: {}, comparisonType: {}, fieldValue: '', joiner: { code: '&&', name: 'AND' } },
    ]);
  };

  const removeCondition = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card type="secondary">
      {conditions.map((cond, idx) => {
        const fieldOptions = cond?.selectedPage?.code ? getFieldOptions(cond.selectedPage.code) : [];
        const selectedFieldObj = fieldOptions.find((f) => f.code === cond?.selectedField?.code);
        const operatorOptions = getOperatorOptions(selectedFieldObj);

        // Keep current operator only if still allowed; otherwise clear
        const currentOpAllowed = operatorOptions.some((o) => o.code === cond?.comparisonType?.code);
        const selectedOperator = currentOpAllowed ? cond.comparisonType : undefined; // <- no default '=='

        return (
          <div key={idx} style={{ borderTop: idx ? '1px dashed var(--gray-200)' : 'none', paddingTop: idx ? '0.75rem' : 0, marginTop: idx ? '0.75rem' : 0 }}>
            {idx > 0 && (
              <LabelFieldPair vertical removeMargin>
                <p style={{ margin: 0 }}>{t("HCM_JOIN_WITH") || 'Join with'}</p>
                <div className="digit-field" style={{ width: '200px' }}>
                  <Dropdown
                    option={LOGICALS}
                    optionKey="code"
                    name={`joiner-${idx}`}
                    t={t}
                    select={(e) => updateCondition(idx, { joiner: e })}
                    selected={cond.joiner}
                  />
                </div>
              </LabelFieldPair>
            )}

            <LabelFieldPair vertical removeMargin>
              <p style={{ margin: 0 }}>{t("HCM_SELECT_PAGE") || 'Select Page'}</p>
              <div className="digit-field" style={{ width: '100%' }}>
                <Dropdown
                  option={pageOptions}
                  optionKey="code"
                  name={`pageSelect-${idx}`}
                  t={t}
                  select={(e) => updateCondition(idx, { selectedPage: e, selectedField: {}, fieldValue: '', comparisonType: {} })}
                  selected={cond.selectedPage}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair vertical removeMargin>
              <p style={{ margin: 0 }}>{t("HCM_SELECT_FIELD") || 'Select Field'}</p>
              <div className="digit-field" style={{ width: '100%' }}>
                <Dropdown
                  option={fieldOptions}
                  optionKey="code"
                  name={`fieldSelect-${idx}`}
                  t={t}
                  select={(e) => {
                    const nextOps = getOperatorOptions(e);
                    const canKeep = cond?.comparisonType?.code && nextOps.some((o) => o.code === cond.comparisonType.code);
                    updateCondition(idx, {
                      selectedField: e,
                      fieldValue: '',
                      comparisonType: canKeep ? cond.comparisonType : {}, // <- clear if invalid, don't force '=='
                    });
                  }}
                  selected={cond.selectedField}
                  disabled={!cond?.selectedPage?.code}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair vertical removeMargin>
              <p style={{ margin: 0 }}>{t("HCM_COMPARISION_TYPE") || 'Comparison'}</p>
              <div className="digit-field" style={{ width: '100%' }}>
                <Dropdown
                  option={operatorOptions}
                  optionKey="code"
                  name={`comparisonSelect-${idx}`}
                  t={t}
                  select={(e) => updateCondition(idx, { comparisonType: e })}
                  disabled={!cond?.selectedField?.code}
                  selected={selectedOperator} // <- no defaulting to operatorOptions[0]
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair vertical removeMargin>
              <p style={{ margin: 0 }}>{t("HCM_SELECT_VALUE") || 'Select/Enter Value'}</p>
              <div className="digit-field" style={{ width: '100%' }}>
                {selectedFieldObj && selectedFieldObj.format === 'dropdown' ? (
                  <Dropdown
                    label={t('SELECT_VALUE') || 'Select Value'}
                    option={(selectedFieldObj.enums || []).map((en) => ({ code: en.code, name: en.name }))}
                    optionKey="code"
                    name={`valueSelect-${idx}`}
                    t={t}
                    select={(e) => updateCondition(idx, { fieldValue: e.code })}
                    disabled={!cond?.selectedField?.code}
                    selected={cond.fieldValue}
                  />
                ) : (
                  <TextInput
                    type="text"
                    populators={{ name: `fieldValue-${idx}` }}
                    placeholder={t('ENTER_VALUE') || 'Enter value'}
                    value={cond.fieldValue}
                    onChange={(event) => updateCondition(idx, { fieldValue: event.target.value })}
                    disabled={!cond?.selectedField?.code}
                  />
                )}
              </div>
            </LabelFieldPair>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {conditions.length > 1 && (
                <Button label={t("REMOVE_CONDITION")} variation="primary" type="button" onClick={() => removeCondition(idx)} />
              )}
              {idx === conditions.length - 1 && (
                <Button label={t("ADD_CONDITION")} variation="primary" onClick={addCondition} />
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

export default React.memo(DependentFieldsWrapper);
