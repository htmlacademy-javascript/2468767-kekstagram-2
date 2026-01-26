// Функция: случайное целое число в диапазоне [min, max]
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция: случайное сообщение (1 или 2 предложения)
function getRandomMessage() {
  const count = getRandomInt(1, 2);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(messages[getRandomInt(0, messages.length - 1)]);
  }
  return result.join(' ');
}

// Функция: рандомное выбор случайного индекса из массива
function getRandomName() {
  return Math.floor(Math.random()*arr.lenght);
}

export {getRandomInt,getRandomMessage,getRandomName};

