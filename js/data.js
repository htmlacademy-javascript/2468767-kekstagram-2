import {getRandomInt,generateComments} from'./util.js';
// вычисляем случайный ID
export const id = Array.from({ length: 25 }, (value, i) => i + 1);
// вычисляем случайный url
// eslint-disable-next-line no-template-curly-in-string
export const url = Array.from({ length: 25 }, (value, i) => ({ url: 'photos/${ i + 1 }.jpg' }));
// Случайное описание
export const descriptions = [];
for (let i = 1; i <= 25; i++) {
  // eslint-disable-next-line no-template-curly-in-string
  descriptions.push({ description: 'Описание фотографии №${i}' });
}

export const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// Массив случайных имён
export const names = [
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

export const likes = getRandomInt(15, 200);

export const comments = generateComments();

