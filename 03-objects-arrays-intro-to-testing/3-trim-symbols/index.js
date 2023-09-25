/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return '';
  if (!size) return string;

  let newString = '';

  [...string].reduce((previous, current) => {
    if (previous.symbol === current) {
      previous.repetitionRate++;
    } else {
      previous.repetitionRate = 1;
    }

    if (previous.repetitionRate <= size) {
      newString += current;
    }

    previous.symbol = current;
    return previous;
  }, {symbol: null, repetitionRate: 0});

  return newString;
}
