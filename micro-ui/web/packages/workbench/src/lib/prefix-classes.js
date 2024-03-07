/**
 *
 * @param  {...string} cls
 *
 * @returns {string}
 */
export const prefixClasses = (...cls) => {
  /**
   * @type {string[]}
   */
  const result = [];

  cls.forEach((maybeClass) => {
    if (maybeClass && typeof maybeClass === 'string') {
      maybeClass
        .split(' ')
        .forEach((singleClass) => result.push(`cr-${singleClass}`));
    }
  });

  return result.join(' ');
};
