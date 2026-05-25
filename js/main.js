import { getThumbs } from './thumbs.js';
import { renderThumbs } from './render.js';
import { initGallery,initThumbnailHandlers} from './full-screen-vewer.js';
import { showEditForm, hideEditForm } from './image-upload.js';
import { initScaleControls } from './image-processor.js';
// Получаем данные
const thumbsList = getThumbs();

// получаем контейнер после отрисвки в render и вызываем функцию
renderThumbs(thumbsList);
showEditForm();
hideEditForm();

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initThumbnailHandlers(thumbsList);
  initScaleControls();
});

