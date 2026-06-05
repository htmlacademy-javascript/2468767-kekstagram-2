import { getRandomInt, getRandomArrayName } from './util.js';
import { NAMES, MESSAGES} from './data.js';

const ARRAY_LEN = 25;

const generateId = (() => {
  let id = 1; return () => id++;
})();

// Функция: генерация ОДНОГО комментария (объекта)
function generateComment() {
  return ({
    id: generateId(),
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: getRandomArrayName(MESSAGES),
    name: getRandomArrayName(NAMES)
  });
}

// Функция генерации в массив из 25 объектов
const getThumbs = () => Array.from({ length: ARRAY_LEN }, () => ({}));

export { getThumbs };
