/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const arrayOfUniqueValues = [];

  for (const [key] of new Set(arr).entries()) {
    arrayOfUniqueValues.push(key)
  }

  return arrayOfUniqueValues;
}
