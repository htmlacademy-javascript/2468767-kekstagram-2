import { getThumbs } from './thumbs.js';
import { renderThumbs } from './render.js';
import { openFullScreen,initGallery,initThumbnailHandlers} from './full-screen-vewer.js';
import { showEditForm, hideEditForm } from './image-upload.js';

// Получаем данные
const thumbsList = getThumbs();

// получаем контейнер после отрисвки в render и вызываем функцию
const picturesContainer = renderThumbs(thumbsList);

document.addEventListener('DOMContentLoaded', () => {
initGallery();
initThumbnailHandlers(thumbsList);
});