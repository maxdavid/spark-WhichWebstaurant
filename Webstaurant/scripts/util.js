const Random = require('Random');

export const shuffle = (inputArray) => {
  // Deep clone
  const clone = (items) =>
    items.map((item) => (Array.isArray(item) ? clone(item) : item));

  let array = clone(inputArray);
  let currentIndex = array.length;
  let temporaryValue = 0;
  let randomIndex = 0;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Random.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
