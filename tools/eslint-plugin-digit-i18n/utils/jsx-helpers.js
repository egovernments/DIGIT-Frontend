/**
 * JSX AST node helpers for ESLint rules.
 *
 * Provides utilities to determine whether a JSX text node or attribute
 * is user-facing (and therefore should be localized).
 */

"use strict";

// Attributes that typically contain user-facing text and should be localized.
const USER_FACING_ATTRIBUTES = new Set([
  "placeholder",
  "title",
  "aria-label",
  "aria-placeholder",
  "alt",
  "label",
  "helpText",
  "infoText",
  "tooltip",
  "description",
  "errorMessage",
  "headerTitle",
  "heading",
]);

// Attributes that are never user-facing (event handlers, data attributes, etc.).
const NON_USER_FACING_ATTRIBUTES = new Set([
  "className",
  "class",
  "id",
  "key",
  "ref",
  "style",
  "type",
  "name",
  "value",
  "href",
  "src",
  "data-testid",
  "data-cy",
  "onClick",
  "onChange",
  "onSubmit",
  "onBlur",
  "onFocus",
  "htmlFor",
  "role",
  "tabIndex",
  "target",
  "rel",
  "method",
  "action",
  "autoComplete",
  "autoFocus",
  "disabled",
  "readOnly",
  "required",
  "checked",
  "selected",
  "multiple",
  "accept",
  "pattern",
  "min",
  "max",
  "step",
  "maxLength",
  "minLength",
  "cols",
  "rows",
  "size",
  "width",
  "height",
  "xmlns",
  "viewBox",
  "fill",
  "stroke",
  "d",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "points",
  "transform",
]);

// Components that never render user-facing text (utility/structural).
const NON_TEXT_COMPONENTS = new Set([
  "style",
  "script",
  "link",
  "meta",
  "br",
  "hr",
  "img",
  "input",
  "textarea",
  "select",
  "option",
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "g",
  "defs",
  "use",
  "symbol",
  "clipPath",
  "mask",
  "pattern",
  "linearGradient",
  "radialGradient",
  "stop",
  "text", // SVG <text>, not HTML text
  "tspan",
]);

/**
 * Check if a string is only whitespace / punctuation / numbers (not user-facing).
 */
function isNonTextContent(str) {
  if (!str || typeof str !== "string") return true;
  const trimmed = str.trim();
  if (trimmed.length === 0) return true;
  // Only digits, punctuation, symbols, whitespace — not real text
  if (/^[\d\s\-_.,;:!?@#$%^&*()\[\]{}<>\/\\|`~"'+=]+$/.test(trimmed)) return true;
  // Single character (likely punctuation or symbol)
  if (trimmed.length === 1) return true;
  return false;
}

/**
 * Check if a JSX element is a non-text component (SVG, structural, etc.).
 */
function isNonTextComponent(node) {
  if (!node || node.type !== "JSXOpeningElement") return false;
  const name = getElementName(node);
  return NON_TEXT_COMPONENTS.has(name);
}

/**
 * Get the name string from a JSX opening element.
 */
function getElementName(node) {
  if (!node || !node.name) return "";
  if (node.name.type === "JSXIdentifier") return node.name.name;
  if (node.name.type === "JSXMemberExpression") {
    return `${node.name.object.name}.${node.name.property.name}`;
  }
  return "";
}

/**
 * Check if a JSX attribute name is user-facing.
 */
function isUserFacingAttribute(attrName) {
  if (USER_FACING_ATTRIBUTES.has(attrName)) return true;
  // data-* and on* are never user-facing
  if (attrName.startsWith("data-")) return false;
  if (attrName.startsWith("on")) return false;
  if (NON_USER_FACING_ATTRIBUTES.has(attrName)) return false;
  return false; // Default: don't flag unknown attributes to reduce false positives
}

/**
 * Check if a JSX element is inside a non-text ancestor (e.g., <svg>, <style>).
 */
function isInsideNonTextAncestor(node) {
  let parent = node.parent;
  while (parent) {
    if (
      parent.type === "JSXElement" &&
      parent.openingElement &&
      isNonTextComponent(parent.openingElement)
    ) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

/**
 * Check if a node is inside a template literal or string concatenation
 * (e.g., `className={`foo ${bar}`}` — not user-facing).
 */
function isInsideTemplateLiteral(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === "TemplateLiteral") return true;
    if (parent.type === "TaggedTemplateExpression") return true;
    parent = parent.parent;
  }
  return false;
}

module.exports = {
  USER_FACING_ATTRIBUTES,
  NON_USER_FACING_ATTRIBUTES,
  NON_TEXT_COMPONENTS,
  isNonTextContent,
  isNonTextComponent,
  getElementName,
  isUserFacingAttribute,
  isInsideNonTextAncestor,
  isInsideTemplateLiteral,
};
