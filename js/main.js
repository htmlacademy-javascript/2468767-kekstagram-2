import { renderThumbs, loadThumbsFromServer } from './render.js';
import { initGallery, initThumbnailHandlers } from './full-screen-viewer.js';
import { showEditForm, hideEditForm } from './image-upload.js';
import { initScaleControls } from './image-processor.js';

// Глобальная переменная для хранения данных
let thumbsList = [];

// Функция инициализации приложения
const initApp = async () => {
  try {
    // Загружаем данные с сервера
    thumbsList = await loadThumbsFromServer();

    // Инициализируем основные компоненты только после загрузки данных
    initGallery();
    initThumbnailHandlers(thumbsList);
    initScaleControls();

    console.log('Приложение инициализировано успешно');
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error);
  }
};

// Обработчик готовности DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
