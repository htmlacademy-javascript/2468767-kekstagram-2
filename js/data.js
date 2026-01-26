import { getRandomInt, getRandomArrayName } from './util.js';
// вычисляем случайный ID
export const id = Array.from({ length: 25 }, (value, i) => i + 1);
// вычисляем случайный url
// eslint-disable-next-line no-unused-vars
export const url = Array.from({ length: 25 }, (value, i) => ('{ url: photos ${ i + 1 }.jpg }'));
// Случайное описание
export const descriptions = [];
for (let i = 1; i <= 25; i++) {
  // eslint-disable-next-line no-template-curly-in-string
  descriptions.push('{ description: Описание фотографии №${i} }');
}

export const likes = getRandomInt(15, 200);

// Массив случайных имён
const names = [
  'Алексей',
  'Мария',
  'Дмитрий',
  'Елена',
  'Сергей',
  'Анна',
  'Иван',
  'Ольга',
  'Николай',
  'Татьяна'
];

// Функция: генерация массива комментариев
function generateComments() {
  const commentsCount = getRandomInt(0, 30); // 0–30 комментариев
  const comments = [];
  const usedIds = new Set();

  for (let i = 0; i < commentsCount; i++) {
    let userId;
    // Уникальный id
    do {
      userId = getRandomInt(1, 100000);
    } while (usedIds.has(userId));
    usedIds.add(userId);
  }
  // Формируем объект комментария: name в конце
  comments.push({
    userId: userId,
    avatar: 'img/avatar-${getRandomInt(1, 6)}.svg',
    message: getRandomMessage(),
    name: getRandomArrayName(names)
  });

  return comments;
}
generateComments();

export const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
// Функция: случайное сообщение (1 или 2 предложения)
function getRandomMessage() {
  const count = getRandomInt(1, 2);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(messages[getRandomInt(0, messages.length - 1)]);
  }
  return result.join(' ');
}
