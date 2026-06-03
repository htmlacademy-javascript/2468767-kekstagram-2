import { loadThumbsFromServer } from './render.js';
import { initGallery, initThumbnailHandlers } from './full-screen-viewer.js';
import { initUploadForm } from './image-upload.js';
import { initScaleControls } from './image-processor.js';

// Глобальная переменная для хранения данных
let thumbsList = null;

// Функция инициализации приложения
const initApp = async () => {
  try {
    // Загружаем данные один раз
    thumbsList = await loadThumbsFromServer();

    // Инициализируем остальные модули с уже загруженными данными
    initGallery(thumbsList);
    initThumbnailHandlers(thumbsList);
    initScaleControls();
    initUploadForm();
  } catch (error) {
    throw new Error(`Ошибка инициализации: ${error.message}`);
  }
};

// Обработчик готовности DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
