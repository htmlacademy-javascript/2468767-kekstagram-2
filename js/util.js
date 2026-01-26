// eslint-disable-next-line no-undef
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

// Функция: случайное имя
function getRandomName() {
  return names[getRandomInt(0, names.length - 1)];
}

// Функция: генерация массива комментариев
function generateComments() {
  const commentsCount = getRandomInt(0, 30); // 0–30 комментариев
  const comments = [];
  const usedIds = new Set();

  for (let i = 0; i < commentsCount; i++) {
    let id;
    // Уникальный id
    do {
      id = getRandomInt(1, 100000);
    } while (usedIds.has(id));
    usedIds.add(id);

    // Формируем объект комментария: name в конце
    comments.push({
      id: id,
      // eslint-disable-next-line no-template-curly-in-string
      avatar: 'img/avatar-${getRandomInt(1, 6)}.svg',
      message: getRandomMessage(),
      name: getRandomName()
    });
  }

  return comments;
}

// Пример вызова
comments = generateComments();
//console.log(comments);

export {getRandomInt,generateComments};

