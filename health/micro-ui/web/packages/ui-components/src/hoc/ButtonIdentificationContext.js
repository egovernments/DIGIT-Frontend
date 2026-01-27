import { createContext, useContext, useMemo } from 'react';

/**
 * ButtonIdentificationContext
 *
 * Provides context for button identification hierarchy.
 * Uses Digit.Utils utilities (from libraries) as the SINGLE SOURCE OF TRUTH.
 *
 * IMPORTANT: IDs are DETERMINISTIC - same inputs always produce same output.
 * This ensures IDs remain stable across page refreshes, logout/login, browser restarts.
 *
 * ID Pattern: {screenPath}-{composerType}-{composerId}-{sectionId}-{name}-{type}
 * Example: "works-inbox-formcomposer-searchform-details-submit-btn"
 *
 * For stable tracking, ALWAYS provide a `name` prop to buttons.
 */

const ButtonIdentificationContext = createContext(null);

/**
 * Hook to get button identification context
 */
export const useButtonIdentification = () => {
  return useContext(ButtonIdentificationContext);
};

/**
 * Gets Digit.Utils functions (single source of truth from libraries)
 */
const getDigitUtils = () => {
  // Fallback implementations
  const fallbackGenerateUniqueId = ({ screenPath, composerType, composerId, sectionId, name, type, id }) => {
    if (id) return id;
    const parts = [screenPath || 'root', composerType, composerId, sectionId, name, type].filter(Boolean);
    return parts.join('-').toLowerCase().replace(/[^a-z0-9-_]+/g, '-');
  };
  const fallbackGetScreenPrefix = () => {
    if (typeof window === 'undefined') return 'ssr';
    const paths = window.location.pathname.split('/').filter(Boolean).slice(2);
    return paths.length > 0 ? paths.join('-').toLowerCase() : 'root';
  };
  const fallbackSanitizeToHtmlId = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');
  };

  // Check if Digit.Utils functions are available, fall back if not
  const digitUtils = typeof window !== 'undefined' ? window.Digit?.Utils : null;

  return {
    generateUniqueId: typeof digitUtils?.generateUniqueId === 'function'
      ? digitUtils.generateUniqueId
      : fallbackGenerateUniqueId,
    getScreenPrefix: typeof digitUtils?.getScreenPrefix === 'function'
      ? digitUtils.getScreenPrefix
      : fallbackGetScreenPrefix,
    sanitizeToHtmlId: typeof digitUtils?.sanitizeToHtmlId === 'function'
      ? digitUtils.sanitizeToHtmlId
      : fallbackSanitizeToHtmlId,
  };
};

/**
 * ButtonIdentificationProvider
 *
 * Wraps components to provide button identification context.
 * Used in FormComposer, InboxSearchComposer, ViewComposer, etc.
 */
export const ButtonIdentificationProvider = ({
  composerType = 'standalone',
  composerId = '',
  sectionId = '',
  children
}) => {
  const parentContext = useContext(ButtonIdentificationContext);
  const { getScreenPrefix, sanitizeToHtmlId } = getDigitUtils();

  const contextValue = useMemo(() => ({
    screenPath: parentContext?.screenPath || getScreenPrefix(),
    composerType: sanitizeToHtmlId(composerType),
    composerId: sanitizeToHtmlId(composerId),
    sectionId: sanitizeToHtmlId(sectionId),
    parentContext,
  }), [composerType, composerId, sectionId, parentContext]);

  return (
    <ButtonIdentificationContext.Provider value={contextValue}>
      {children}
    </ButtonIdentificationContext.Provider>
  );
};

/**
 * SectionIdentificationProvider
 *
 * Lightweight provider for sections within a composer.
 */
export const SectionIdentificationProvider = ({ sectionId, children }) => {
  const parentContext = useButtonIdentification();
  const { sanitizeToHtmlId } = getDigitUtils();

  const contextValue = useMemo(() => ({
    ...parentContext,
    sectionId: sanitizeToHtmlId(sectionId),
  }), [parentContext, sectionId]);

  return (
    <ButtonIdentificationContext.Provider value={contextValue}>
      {children}
    </ButtonIdentificationContext.Provider>
  );
};

/**
 * useButtonId Hook
 *
 * Generates DETERMINISTIC button ID that is stable across page loads.
 *
 * IMPORTANT: For stable tracking, ALWAYS provide `buttonName`.
 * Without a name, IDs may vary based on render order.
 *
 * @param {Object} options
 * @param {string} [options.explicitId] - Explicit ID (overrides generation)
 * @param {string} [options.buttonType] - Type: "submit", "action", "button" (for data attribute)
 * @param {string} [options.buttonName] - Semantic name (REQUIRED for stable IDs)
 * @returns {Object} { id, dataAttributes }
 *
 * @example
 * // GOOD - Stable ID:
 * useButtonId({ buttonName: 'submit' })
 * // → "works-inbox-formcomposer-myform-submit-btn" (ALWAYS same)
 *
 * // BAD - Unstable ID (no name):
 * useButtonId({})
 * // → "works-inbox-formcomposer-myform-btn-1" (may change)
 */
export const useButtonId = ({ explicitId, buttonType = 'button', buttonName = '' } = {}) => {
  const context = useButtonIdentification();
  const { generateUniqueId, getScreenPrefix } = getDigitUtils();

  // Get context values
  const screenPath = context?.screenPath || getScreenPrefix();
  const composerType = context?.composerType || 'standalone';
  const composerId = context?.composerId || '';
  const sectionId = context?.sectionId || '';

  // Use Digit.Utils.generateUniqueId - DETERMINISTIC
  const generatedId = generateUniqueId({
    screenPath,
    composerType,
    composerId,
    sectionId,
    name: buttonName,
    type: 'btn',
    id: explicitId,
  });

  return {
    id: generatedId,
    dataAttributes: {
      'data-screen': screenPath,
      'data-composer-type': composerType,
      'data-composer-id': composerId || undefined,
      'data-section-id': sectionId || undefined,
      'data-button-type': buttonType,
      'data-button-name': buttonName || undefined,
    }
  };
};

/**
 * generateButtonId Utility
 *
 * For use outside React components. Uses Digit.Utils.generateUniqueId.
 */
export const generateButtonId = ({
  screenPath,
  composerType = 'standalone',
  composerId = '',
  sectionId = '',
  buttonName = '',
  explicitId = ''
} = {}) => {
  const { generateUniqueId } = getDigitUtils();

  return generateUniqueId({
    screenPath,
    composerType,
    composerId,
    sectionId,
    name: buttonName,
    type: 'btn',
    id: explicitId,
  });
};

export default ButtonIdentificationContext;
