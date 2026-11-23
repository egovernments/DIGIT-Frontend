/**
 * Preview states - showing a screen in one of the situations the app can be in.
 *
 * A screen often draws different things depending on what the app found: a search either
 * lists beneficiaries or says it found none; a member is either waiting to be visited or
 * already vaccinated. The app knows which; the console does not, so without help it draws
 * them all at once and the author sees a screen the app will never produce.
 *
 * Two opt-in config keys describe the situations:
 *
 *   page.stateGroups[]      a group ("Search Results") and the states in it
 *   field.previewStates[]   the states a field belongs to
 *
 * Both are read only here, and the chosen state lives in redux and is never saved, so
 * nothing in this file can change what the app is sent.
 *
 * Three rules:
 *   1. A field naming no state is always shown, so a config declaring no groups behaves
 *      exactly as it did before.
 *   2. A field's states cover everything nested inside it, so a config names only the
 *      outermost field of a state, never each child.
 *   3. Groups are independent - one group's choice never hides another group's fields.
 */

/** The state groups a page declares, or an empty list. */
export const getStateGroups = (page) => (Array.isArray(page?.stateGroups) ? page.stateGroups : []);

/** The states a field declares. Empty means the field is not tied to any state. */
const getFieldStates = (field) => (Array.isArray(field?.previewStates) ? field.previewStates : []);

/** True while a group has no state chosen, so it shows as a stand-in. */
export const isGroupNeutral = (group, selectedStates) => !selectedStates?.[group?.name];

/** The group a field belongs to, or undefined when it is not tied to any state. */
const getFieldGroup = (field, stateGroups) => {
  const fieldStates = getFieldStates(field);
  if (fieldStates.length === 0) return undefined;
  return (stateGroups || []).find((group) => (group?.states || []).some((s) => fieldStates.includes(s?.name)));
};

/**
 * Whether a field should be drawn for the states currently chosen.
 *
 * Only the groups a field names get a say, so a search-result field is unaffected by which
 * delivery status is chosen. A field whose states match no declared group is shown rather
 * than hidden - missing config should not make parts of a screen disappear.
 */
const matchesSelectedStates = (field, selectedStates, stateGroups) => {
  const fieldStates = getFieldStates(field);
  if (fieldStates.length === 0) return true;

  return (stateGroups || []).every((group) => {
    const takesPart = (group?.states || []).some((s) => fieldStates.includes(s?.name));
    if (!takesPart) return true;
    return fieldStates.includes(selectedStates?.[group?.name]);
  });
};

/**
 * Rebuild a field tree, letting `decide` say what happens to each field.
 *
 * decide(field) returns one of:
 *   undefined   keep the field, and look inside it too
 *   null        drop the field, and everything inside it
 *   a field     put that in its place, and do not look inside
 *
 * Nothing is copied where nothing changed, so an untouched tree comes back as the very same
 * arrays and objects. That is what keeps a page with no states rendering exactly as before.
 */
const rebuildFields = (list, decide) => {
  if (!Array.isArray(list)) return list;

  const out = [];
  let changed = false;

  list.forEach((field) => {
    const verdict = decide(field);

    if (verdict === null) {
      changed = true;
      return;
    }
    if (verdict !== undefined) {
      changed = true;
      out.push(verdict);
      return;
    }

    const next = rebuildChildren(field, decide);
    if (next !== field) changed = true;
    out.push(next);
  });

  return changed ? out : list;
};

/** Apply `decide` to whatever a field holds: a `children` list, or a single `child`. */
const rebuildChildren = (node, decide) => {
  if (!node || typeof node !== "object") return node;

  const next = { ...node };
  let changed = false;

  if (Array.isArray(node.children)) {
    const children = rebuildFields(node.children, decide);
    if (children !== node.children) {
      next.children = children;
      changed = true;
    }
  }

  if (node.child && typeof node.child === "object") {
    const [child] = rebuildFields([node.child], decide);
    if (child !== node.child) {
      next.child = child;
      changed = true;
    }
  }

  return changed ? next : node;
};

/** A screen opens with no state chosen - see `withStatePlaceholders` for why. */
export const getDefaultSelectedStates = () => ({});

/**
 * Drop the fields that do not belong to the chosen states, at every depth.
 * A page declaring no groups gets its own array straight back.
 */
export const filterFieldsByState = (fields, selectedStates, stateGroups) => {
  if (!Array.isArray(fields) || !(stateGroups || []).length) return fields;
  return rebuildFields(fields, (field) => (matchesSelectedStates(field, selectedStates, stateGroups) ? undefined : null));
};

/**
 * Put a stand-in where a group's fields would go while none of its states is chosen.
 *
 * Picking a state for the author would invent a screen, and drawing nothing leaves a hole,
 * so the group shows once, where its first field was. Every group gets the same box, so it
 * reads as "something goes here" rather than as one of the states.
 * `group.placeholder.style` resizes or restyles it.
 */
export const withStatePlaceholders = (fields, selectedStates, stateGroups) => {
  if (!Array.isArray(fields) || !(stateGroups || []).length) return fields;

  const neutral = (stateGroups || []).filter((group) => isGroupNeutral(group, selectedStates));
  if (neutral.length === 0) return fields;

  // One stand-in per group for the whole page, wherever that group's fields turn out to live
  const placed = new Set();

  return rebuildFields(fields, (field) => {
    const group = getFieldGroup(field, neutral);
    if (!group) return undefined;
    if (placed.has(group.name)) return null;
    placed.add(group.name);
    return { statePlaceholderFor: group };
  });
};

/**
 * Map every field name on a page to the states it belongs to, passing them down the tree.
 *
 * The properties panel lists fields flat, so a row nested inside a container can no longer
 * tell which state it inherited. This walks the config tree, where that is still visible.
 *
 * Keyed by fieldName, which is what the panel already uses to identify a row.
 */
export const buildFieldStateIndex = (fields, index = new Map()) => {
  const visit = (node, states) => {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, states));
      return;
    }

    const own = getFieldStates(node);
    const current = own.length > 0 ? own : states;

    if (node.fieldName && current.length > 0) index.set(node.fieldName, current);

    visit(node.children, current);
    visit(node.child, current);
    visit(node.primaryAction, current);
    visit(node.secondaryAction, current);
  };

  visit(fields, []);
  return index;
};
