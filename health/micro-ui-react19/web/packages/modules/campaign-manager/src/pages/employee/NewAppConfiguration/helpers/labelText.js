/**
 * Helpers for the wording a user types into the panel - field labels and option text
 */

// Pictographs, flag pairs, keycap marks and the joiners that build the longer emoji out of them.
// Letters are matched by none of these, so wording in any language is left alone.
const EMOJI = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{FE0F}\u{20E3}]|‍/gu;

/**
 * Remove emojis from text.
 *
 * What is typed here ends up on a health worker's screen and in the data they collect, where an
 * emoji may not render at all. Removing rather than refusing lets the rest of a pasted phrase
 * through instead of dropping the whole thing.
 *
 * @param {string} text - text as typed
 * @returns {string} the text with any emojis taken out
 */
export const withoutEmojis = (text) => (typeof text === "string" ? text.replace(EMOJI, "") : text);

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
