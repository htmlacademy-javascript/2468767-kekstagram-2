import { getRandomInt, getRandomArrayName } from './util.js';
import { NAMES, MESSAGES } from './data.js';

const ARRAY_LEN = 25;
// Функция: генерация массива комментариев
const generateComments = () => {
  const commentsCount = getRandomInt(0, 30);
  const usedIds = new Set();

  return Array.from({ length: commentsCount }, () => {
    let commentsId;
    do {
      commentsId = getRandomInt(1, 100000);
    } while (usedIds.has(commentsId));
    usedIds.add(commentsId);

    return {
      id: commentsId,
      avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
      message: Array.from(
        { length: getRandomInt(1, 2) },
        () => MESSAGES[getRandomInt(0, MESSAGES.length - 1)]
      ).join(' '),
      name: getRandomArrayName(NAMES)
    };
  });
};

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
