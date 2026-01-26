// Функция: случайное целое число в диапазоне [min, max]
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция: рандомный выбор случайного индекса из массива
function getRandomName() {
  return Math.floor(Math.random() * elements.lenght);
}

const getRandomArrayName = (elements) => elements[getRandomName(0, elements.length - 1)];

export {getRandomInt,getRandomArrayName};

