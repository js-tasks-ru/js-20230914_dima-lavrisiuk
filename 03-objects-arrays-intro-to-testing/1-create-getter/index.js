/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathToElement = path.split('.');

  return (obj) => {
    return pathToElement.reduce((previous, current, i) => {
      if (!previous?.hasOwnProperty(current)) {
        return;
      }

      previous = previous[current];

      if (i <= pathToElement.length) {
        return previous;
      }
    }, obj);
  };
}
