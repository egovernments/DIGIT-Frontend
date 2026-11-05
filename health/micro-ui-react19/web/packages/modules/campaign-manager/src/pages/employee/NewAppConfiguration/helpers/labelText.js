/**
 * Helpers for the wording a user types into the panel - field labels and option text
 */

// Pictographs, flag pairs, skin tones, keycap marks, and the zero-width joiners that build the
// longer emoji out of them.
//
// The joiner is matched only between two pictographs, never on its own. It is an ordinary letter
// in several scripts - Malayalam chillu, Sinhala and Bengali conjuncts all spell words with it -
// so removing every one of them would quietly break wording a user is entitled to type. The
// zero-width non-joiner, which those scripts also use, is not matched at all.
const EMOJI = /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}][\u{FE0F}\u{20E3}]*(?:‍[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}][\u{FE0F}\u{20E3}]*)*|[\u{FE0F}\u{20E3}]/gu;

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
