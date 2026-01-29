import { getRandomInt, getRandomArrayName } from './util.js';
import { names, messages } from './data.js';

const ARRAY_LEN = 25;
// Функция: генерация массива комментариев
function generateComments() {
  const commentsCount = getRandomInt(0, 30); // 0–30 комментариев
  const comments = [];
  const usedIds = new Set();
  for (let i = 0; i < commentsCount; i++) {
    let commentsId;
    // Уникальный id
    do {
      commentsId = getRandomInt(1, 100000);
    } while (usedIds.has(commentsId));
    usedIds.add(commentsId);
    // Функция: случайное сообщение (1 или 2 предложения)
    const generateComments = () => {
      // Определяем количество комментариев (1 или 2)
      const count = getRandomInt(1, 2);
      const result = [];

      // Выбираем случайные сообщения из массива
      for (let i = 0; i < count; i++) {
        result.push(messages[getRandomInt(0, messages.length - 1)]);
      }

      // Возвращаем строку с комментариями, разделёнными пробелом
      return result.join(' ');
    };
    // Формируем объект комментария: name в конце
    comments.push({
      id: commentsId,
      avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
      message: generateComments(messages),
      name: getRandomArrayName(names)
    });
  }

  return comments;
}
// функция, которая сразу возвращает объект по заданию
const generatePost = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  likes: getRandomInt(15, 200),
  descriptions: `Описание фотографии №${index + 1}`,
  comments: generateComments()
});

// Функция генерации в массив из 25 объектов
const getThumbs = () => Array.from({ length: ARRAY_LEN }, (_, index) => generatePost(index));

export { getThumbs };
