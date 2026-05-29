import { loadThumbsFromServer } from './render.js';
import { initGallery, initThumbnailHandlers } from './full-screen-viewer.js';
import { initUploadForm } from './image-upload.js';
import { initScaleControls } from './image-processor.js';
// Функция отладки — доступна всем функциям файла
const debugEffectState = () => {
  const effectsList = getEffectsList();
  const previewImage = getPreviewImage();

  console.log('=== DEBUG EFFECT STATE ===');
  console.log('Current effect (getCurrentEffect):', getCurrentEffect());
  console.log('currentEffectSettings:', currentEffectSettings);
  console.log('Active radio button:',
    effectsList?.querySelector('.effects__radio:checked')?.value);
  console.log('Preview image filter:', previewImage?.style.filter);
  console.log('Slider exists:', !!getEffectLevelSlider().noUiSlider);
  console.log('Slider container visible:',
    !getEffectLevelContainer().classList.contains('hidden'));
  console.log('========================');
};
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
