const sum = (a, b) => {
  // отдельная проверка на NaN нужна потому что тип NaN - число
  const check = (number) => typeof number === 'number' && !isNaN(number);

  if (check(a) && check(b)) {
    return a + b;
  } else {
    throw new TypeError('Two numbers expected!');
  }
};

module.exports = sum;
