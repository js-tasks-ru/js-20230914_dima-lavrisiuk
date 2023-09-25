/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {number}
 */

const sortAsc = (a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
const sortDesc = (b, a) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});

export function sortStrings(arr, param = 'asc') {
  return [...arr].sort(param === 'asc' ? sortAsc : sortDesc);
}
