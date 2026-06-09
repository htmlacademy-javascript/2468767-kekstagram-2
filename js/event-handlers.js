import { isEscapeKey } from './util.js';
import { sendFormData } from './api.js';

let currentSuccessElement = null;
let currentErrorElement = null;

// Флаг: открыта ли сейчас ошибка (ключевое дополнение)
let isErrorShown = false;

// Простые функции удаления (не вызывают обработчики)
const removeSuccessMessage = () => {
  if (currentSuccessElement && currentSuccessElement.parentNode) {
    currentSuccessElement.parentNode.removeChild(currentSuccessElement);
    currentSuccessElement = null;
  }
};

const removeErrorMessage = () => {
  if (currentErrorElement && currentErrorElement.parentNode) {
    currentErrorElement.parentNode.removeChild(currentErrorElement);
    currentErrorElement = null;
    isErrorShown = false; // Сбрасываем флаг при закрытии ошибки
  }
};

// Обработчики событий
const onSuccessKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removeSuccessMessage();
  }
};

const onSuccessClickOutside = (evt) => {
  if (!currentSuccessElement?.contains(evt.target)) {
    removeSuccessMessage();
  }
};

const onErrorKeydown = (evt) => {
  if (isEscapeKey(evt) && isErrorShown) {
    evt.preventDefault();
    removeErrorMessage();
    removeErrorEventListeners();
  }
};

const onErrorClickOutside = (evt) => {
  if (!currentErrorElement?.contains(evt.target)) {
    removeErrorMessage();
  }
};

// Используем обработчики и функции удаления
const addSuccessEventListeners = () => {
  document.addEventListener('keydown', onSuccessKeydown);
  document.addEventListener('click', onSuccessClickOutside);
};

const removeSuccessEventListeners = () => {
  document.removeEventListener('keydown', onSuccessKeydown);
  document.removeEventListener('click', onSuccessClickOutside);
};

const addErrorEventListeners = () => {
  document.addEventListener('keydown', onErrorKeydown);
  document.addEventListener('click', onErrorClickOutside);
};

const removeErrorEventListeners = () => {
  document.removeEventListener('keydown', onErrorKeydown);
  document.removeEventListener('click', onErrorClickOutside);
};

// Функции показа сообщений
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    return;
  }

  const fragment = successTemplate.content.cloneNode(true);
  currentSuccessElement = fragment.firstElementChild;

  if (!currentSuccessElement) {
    return;
  }

  document.body.appendChild(currentSuccessElement);

  const successButton = currentSuccessElement.querySelector('.success__button');
  if (successButton) {
    successButton.addEventListener('click', () => {
      removeSuccessMessage();
      removeSuccessEventListeners();
    });
  }

  addSuccessEventListeners();
};

const showErrorMessage = (errorMessage) => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    return;
  }

  const fragment = errorTemplate.content.cloneNode(true);
  currentErrorElement = fragment.firstElementChild;

  if (!currentErrorElement) {
    return;
  }

  // Устанавливаем текст сообщения
  const errorText = currentErrorElement.querySelector('.error__title');
  if (errorText) {
    errorText.textContent = errorMessage || 'Произошла ошибка при отправке данных';
  }

  document.body.appendChild(currentErrorElement);

  const errorButton = currentErrorElement.querySelector('.error__button');
  if (errorButton) {
    errorButton.addEventListener('click', () => {
      removeErrorMessage();
      removeErrorEventListeners();
    });
  }

  isErrorShown = true; // Устанавливаем флаг — ошибка открыта
  addErrorEventListeners();
};

// Настраивает все обработчики событий для формы загрузки
const setupEventHandlers = (
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
  onCancelClick,
  onSubmitSuccess
) => {
  // Обработчик кнопки отмены
  if (cancelButton && onCancelClick) {
    cancelButton.addEventListener('click', onCancelClick);
  }

  // Обработчик отправки формы
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();

      if (!pristine || !pristine.validate()) {
        return;
      }

      try {
        // Создаём FormData из формы
        const formData = new FormData(uploadForm);

        // Отправляем данные на сервер через API-модуль
        await sendFormData(formData);

        // Показ успеха и закрытие формы с сбросом
        showSuccessMessage();
        onSubmitSuccess(); // Вызываем callback для сброса формы
      } catch (error) {
        showErrorMessage('Не удалось отправить форму. Проверьте подключение и попробуйте ещё раз.');
      }
    });
  }

  // Обработчик закрытия по Esc (вне формы редактирования)
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt) && overlay && !overlay.classList.contains('hidden')) {
      // 1. Если ошибка открыта — закрываем только ошибку (приоритет)
      if (isErrorShown) {
        evt.preventDefault();
        removeErrorMessage();
        return; // Прерываем выполнение, чтобы не закрывать форму
      }

      // 2. Если ошибки нет — закрываем форму
      const isInInput = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;
      if (!isInInput) {
        evt.preventDefault();
        hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
      }
    }
  });

  // Обработчик закрытия overlay при клике вне формы
  if (overlay) {
    overlay.addEventListener('click', (evt) => {
      if (!evt.target.closest('.img-upload__wrapper')) {
        hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
      }
    });
  }
};

export { setupEventHandlers, showSuccessMessage, showErrorMessage };
