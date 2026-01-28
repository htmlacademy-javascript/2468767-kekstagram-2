import { getRandomInt, getRandomArrayName } from './util.js';
import { names, messages } from './data.js'

// вычисляем случайный ID
const id = Array.from({ length: 25 }, (value, i) => i + 1);
// вычисляем случайный url
// eslint-disable-next-line no-unused-vars
const url = Array.from({ length: 25 }, (value, i) => ({ url: 'photos { i + 1 }.jpg' }));
const likes = getRandomInt(15, 200);
// Случайное описание
const descriptions = [];
for (let i = 1; i <= 25; i++) {
  // eslint-disable-next-line no-template-curly-in-string
  descriptions.push({ description: 'Описание фотографии №{i}' });
}

// Функция: генерация массива комментариев
function generateComments() {
  const commentsCount = getRandomInt(0, 30); // 0–30 комментариев
  const comments = [];
  const usedIds = new Set();

  for (let i = 0; i < commentsCount; i++) {
    let Id;
    // Уникальный id
    do {
      Id = getRandomInt(1, 100000);
    } while (usedIds.has(Id));
    usedIds.add(Id);
    // Функция: случайное сообщение (1 или 2 предложения)
    function getRandomMessage() {
      const count = getRandomInt(1, 2);
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(messages[getRandomInt(0, messages.length - 1)]);
      }
      return result.join(' ');
    }
    // Формируем объект комментария: name в конце
    comments.push({
      Id: Id,
      avatar: 'img/avatar-{getRandomInt(1, 6)}.svg',
      message: getRandomMessage(),
      name: getRandomArrayName(names)
    });
  }

  return comments;
}

const comments = generateComments();

export const FOTO = [id, url, descriptions, likes, comments];
