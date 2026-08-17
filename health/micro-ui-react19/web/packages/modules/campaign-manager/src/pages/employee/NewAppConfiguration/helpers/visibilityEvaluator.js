/**
 * Preview-side evaluation of device-side `visible` expressions.
 *
 * The field worker app decides element visibility at runtime with expressions like
 *   "{{fn:isDelivered(item.task.last.status)}} == true && {{fn:hasRedoseForCurrentCycle(item.task)}} == false"
 * The web preview cannot execute these fn: helpers, but it can SIMULATE a state:
 * picking one conditional element's expression as "true" fixes the value of every
 * fn-term it contains, and all other conditional elements are then shown or hidden
 * by logical consistency with those fixed values.
 */

/** A `visible` value that is a runtime expression rather than a literal boolean */
export const isConditionalExpression = (value) => typeof value === "string" && /(==|!=)/.test(value);

const normalizeKey = (raw) => raw.replace(/\s+/g, "").replace(/^\{\{/, "").replace(/\}\}$/, "");

/**
 * Parse an expression into conjunction terms: [{ key, op, rhs }].
 * Returns null when the expression uses features we don't simulate (e.g. "||"),
 * in which case the field is treated as always visible.
 */
export const parseVisibleExpression = (expr) => {
  if (typeof expr !== "string" || expr.includes("||")) return null;
  const terms = [];
  for (const part of expr.split("&&")) {
    const match = part.match(/^(.*?)(==|!=)(.*)$/s);
    if (!match) return null;
    terms.push({
      key: normalizeKey(match[1]),
      op: match[2],
      rhs: match[3].trim().replace(/^['"]|['"]$/g, ""),
    });
  }
  return terms.length > 0 ? terms : null;
};

const expressionKey = (expr) => expr.replace(/\s+/g, "");

/**
 * Walk a page config and derive one scenario per distinct parseable `visible`
 * expression. A scenario's assignments fix each `==` term of its expression.
 * Elements sharing the expression (e.g. a status tag and its action button)
 * collapse into a single scenario, labelled by the tag where possible.
 */
export const derivePreviewScenarios = (pageData, t) => {
  const byExpr = new Map();

  JSON.stringify(pageData, (key, value) => {
    if (value && typeof value === "object" && isConditionalExpression(value.visible)) {
      const terms = parseVisibleExpression(value.visible);
      if (terms) {
        const id = expressionKey(value.visible);
        const existing = byExpr.get(id);
        // Prefer a tag's label for the scenario name - tags are the status markers
        if (!existing || (value.format === "tag" && existing.format !== "tag")) {
          byExpr.set(id, { id, terms, label: value.label, fieldName: value.fieldName, format: value.format });
        }
      }
    }
    return value;
  });

  return [...byExpr.values()].map((scenario) => {
    const assignments = {};
    scenario.terms.forEach((term) => {
      if (term.op === "==") assignments[term.key] = term.rhs;
    });
    const labelKey = scenario.label && !scenario.label.includes("fn:") ? scenario.label : scenario.fieldName;
    return { ...scenario, assignments, displayLabel: (t ? t(labelKey) : labelKey) || scenario.id };
  });
};

/**
 * Visibility of a field under a simulated scenario:
 * - every `==` term must be satisfied by the scenario's assignments (implied by it)
 * - no `!=` term may be contradicted by them
 * Fields with unparseable expressions stay visible - never silently hide.
 */
export const isFieldVisibleInScenario = (field, scenario) => {
  if (!scenario || !isConditionalExpression(field?.visible)) return true;
  if (expressionKey(field.visible) === scenario.id) return true;
  const terms = parseVisibleExpression(field.visible);
  if (!terms) return true;
  return terms.every((term) => {
    const assigned = scenario.assignments[term.key];
    if (term.op === "==") return assigned !== undefined && assigned === term.rhs;
    return assigned === undefined || assigned !== term.rhs;
  });
};
