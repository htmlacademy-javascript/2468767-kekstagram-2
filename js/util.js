// Функция: случайное целое число в диапазоне [min, max]
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция: рандомный выбор случайного индекса из массива
function getRandomName(arr) {
  return Math.floor(Math.random() * arr.lenght);
}

export {getRandomInt,getRandomName};

