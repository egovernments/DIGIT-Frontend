/**
 * Helper for the wording of field labels
 */

/**
 * Capitalise the first letter of a label.
 *
 * Labels read as sentences, the way the ones that ship with a screen are written ("Worker phone
 * number"). Only the first letter changes, so capitals further along are kept as typed, as in
 * "GPS location". A label meant to start with a small letter, such as "nOPV2 doses", cannot be
 * written this way.
 *
 * @param {string} text - a label as typed
 * @returns {string} the label with its first letter capitalised
 */
export const toSentenceCase = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);
