import { getBody, getFileInput, getOverlay, getPreviewImage, getCancelButton, getHashtagsInput, getDescriptionInput, getUploadForm } from './dom.js';
import { validateHashtags, getHashtagError, initValidation } from './validation.js';
import { setupEventHandlers } from './event-handlers.js';
import { showEditForm, hideEditForm } from './form-manager.js';

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

  // Инициализация валидации
  const pristine = initValidation(uploadForm, hashtagsInput, descriptionInput);

  // Настройка обработчиков событий
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
    body
  );
};

export { initUploadForm };
