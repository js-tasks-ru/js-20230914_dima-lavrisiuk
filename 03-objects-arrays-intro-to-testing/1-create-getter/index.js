/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathToElement = path.split('.');

  return (obj) => {
    const bufferPath = [...pathToElement];
    return bufferPath.reduce((previous, current, i) => {
      if (!previous?.hasOwnProperty(current)) {
        bufferPath.length = 0;
        return;
      }

      previous = previous[current];

      if (i <= bufferPath.length) {
        return previous;
      }
    }, obj);
  };
}
