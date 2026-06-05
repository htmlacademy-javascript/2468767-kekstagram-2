// Функция: случайное целое число в диапазоне [min, max]
const getRandomInt = (min, max)=> Math.floor(Math.random() * (max - min + 1)) + min;

// Функция: рандомный выбор случайного индекса из массива
const getRandomArrayName = (array) => array[getRandomInt(0, array.length - 1)];

//проверка нажатия esc
export const isEscapeKey = (evt) => evt.key === 'Escape';

// Функция устранения дребезга
const debounce = (callback, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), delay);
  };
};

export {getRandomInt,getRandomArrayName,debounce};
