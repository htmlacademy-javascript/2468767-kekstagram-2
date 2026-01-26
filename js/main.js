import './functions.js';
import { id, url, descriptions, likes, comments } from './data.js';
import { getRandomInt, generateComments } from './util.js';
import './thumbs.js';


const FOTO = [id, url, descriptions, likes, comments];
//Проходимся по каждому массиву и генерм случайный индекс
const FOTO_LIST = FOTO.map((subArr) => {
  const randomIndex = Math.floor(Math.random() * subArr.length);
  return subArr[randomIndex];
});

console.log(FOTO_LIST);

