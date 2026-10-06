/**
 * Helpers for a form screen's action button
 *
 * A template screen defines its buttons in full, each with the type and format that identify it.
 * A form screen stores only the button's label, and the button built from that label has a format
 * but no type - so the console reads it as a text field and offers it the wrong properties.
 *
 * These two add the missing type while a page is being edited and take it off again before the
 * page is saved, so the button behaves like any other field without changing what is stored.
 */

// The type that goes with format "button" in the field type master
const BUTTON_FIELD_TYPE = "template";

const mapFooterButtons = (config, mapButton) => {
  // Template screens already set the type, so they are left alone
  if (!config || config.type === "template" || !Array.isArray(config.footer)) return config;
  return {
    ...config,
    footer: config.footer.map((item) => (item?.format === "button" ? mapButton(item) : item)),
  };
};

/**
 * Add the missing type to a form screen's action buttons.
 *
 * @param {Object} config - a page being loaded for editing
 * @returns {Object} the page, with its action buttons typed
 */
export const withFooterButtonTypes = (config) =>
  mapFooterButtons(config, (item) => (item.type ? item : { ...item, type: BUTTON_FIELD_TYPE }));

/**
 * Remove what withFooterButtonTypes added.
 *
 * Editing a button writes the whole field back to the page, so without this the type would be
 * saved and carried on to the mobile app.
 *
 * @param {Object} config - a page about to be saved
 * @returns {Object} the page, as it was before editing began
 */
export const withoutFooterButtonTypes = (config) =>
  mapFooterButtons(config, (item) => {
    if (item.type !== BUTTON_FIELD_TYPE) return item;
    const { type, ...rest } = item;
    return rest;
  });
