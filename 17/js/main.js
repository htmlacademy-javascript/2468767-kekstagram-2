import { loadThumbsFromServer } from './render.js';
import { initGallery, initThumbnailHandlers } from './full-screen-viewer.js';
import { initUploadForm } from './image-upload.js';
import { initScaleControls } from './image-processor.js';

// Глобальная переменная для хранения данных
let thumbsList = [];

// Функция инициализации приложения
const initApp = async () => {
  try {
    thumbsList = await loadThumbsFromServer();
    initGallery();
    initThumbnailHandlers(thumbsList);
    initScaleControls();
    initUploadForm(); // Вызываем после загрузки данных
  } catch (error) {
    // Заменяем console.error на throw — передаём ошибку наверх для обработки
    throw new Error(`Ошибка инициализации: ${error.message}`);
  }
};

// Обработчик готовности DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

