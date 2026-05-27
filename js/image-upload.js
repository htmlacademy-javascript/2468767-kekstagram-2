import {
  getBody, getFileInput, getOverlay, getPreviewImage, getCancelButton,
  getHashtagsInput, getDescriptionInput, getUploadForm
} from './dom.js';
import { initValidation } from './validation.js';
import { setupEventHandlers } from './event-handlers.js';
import { showEditForm, hideEditForm } from './form-manager.js';
import { resetImageFormState } from './image-processor.js';

const initUploadForm = () => {
  // Получаем элементы DOM
  const fileInput = getFileInput();
  const overlay = getOverlay();
  const body = getBody();
  const previewImage = getPreviewImage();
  const cancelButton = getCancelButton();
  const hashtagsInput = getHashtagsInput();
  const descriptionInput = getDescriptionInput();
  const uploadForm = getUploadForm();

  // Проверка доступности ключевых элементов
  if (!fileInput) {
    throw new Error('Элемент загрузки файла не найден');
  }
  if (!previewImage) {
    throw new Error('Элемент превью изображения не найден');
  }

  // Инициализация валидации
  const pristine = initValidation(uploadForm, hashtagsInput, descriptionInput);

  const handleFileChange = (evt) => {
    const file = evt.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        // Показываем форму редактирования после выбора фото
        showEditForm(overlay, body);
      };
      reader.readAsDataURL(file);
    } else {
      // Очищаем поле, если выбран неграфический файл
      fileInput.value = '';
      
    }
  };

  //Обработчик закрытия формы по кнопке отмены
  const handleCancelClick = (evt) => {
    evt.preventDefault();
    // Сначала сбрасываем все данные формы
    resetImageFormState();
    // Затем закрываем форму
    hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
  };

  //Обработчик успешной отправки формы
  const handleFormSubmitSuccess = () => {
    // Сначала сбрасываем все данные формы
    resetImageFormState();
    // Затем закрываем форму
    hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
  };

  // Добавляем обработчик выбора файла
  fileInput.addEventListener('change', handleFileChange);

  // Настройка остальных обработчиков событий
  setupEventHandlers(
    fileInput,
    cancelButton,
    overlay,
    hashtagsInput,
    descriptionInput,
    uploadForm,
    pristine,
    showEditForm,
    hideEditForm,
    previewImage,
    body,
    handleCancelClick,
    handleFormSubmitSuccess
  );
};

export { initUploadForm };
