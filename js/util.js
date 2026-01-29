// Функция: случайное целое число в диапазоне [min, max]
const getRandomInt = (min, max)=> Math.floor(Math.random() * (max - min + 1)) + min;

// Функция: рандомный выбор случайного индекса из массива
const getRandomArrayName = (index) => Math.floor(Math.random() * index.lenght);

export {getRandomInt,getRandomArrayName};
