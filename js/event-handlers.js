import { isEscapeKey } from './util.js';
import { sendFormData } from './api.js';
import { resetImageFormState } from './image-processor.js';

let currentSuccessElement = null;
let currentErrorElement = null;

// Флаг: открыта ли сейчас ошибка
let isErrorShown = false;

// Хранилище для ссылок на обработчики — используем const, так как сам объект не переза присваивается
const errorEventHandlers = {
  keydown: null,
  click: null
};

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
    isErrorShown = false;
    removeErrorEventListeners(); // Удаляем обработчики один раз
  }
};


// Сначала объявляем removeErrorEventListeners — до функций, которые его вызывают
const removeErrorEventListeners = () => {
  // Удаляем только если обработчики установлены
  if (errorEventHandlers.keydown) {
    document.removeEventListener('keydown', errorEventHandlers.keydown);
    errorEventHandlers.keydown = null; // Очищаем ссылку
  }

  if (errorEventHandlers.click) {
    document.removeEventListener('click', errorEventHandlers.click);
    errorEventHandlers.click = null; // Очищаем ссылку
  }
};

// Обработчики событий — теперь могут безопасно вызывать removeErrorEventListeners
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
    removeErrorEventListeners(); // Теперь функция уже объявлена — ошибки нет
  }
};

const onErrorClickOutside = (evt) => {
  if (!currentErrorElement?.contains(evt.target)) {
    removeErrorMessage();
  }
};

// Функции управления обработчиками
const addErrorEventListeners = () => {
  // Сохраняем ссылки на обработчики в хранилище
  errorEventHandlers.keydown = onErrorKeydown;
  errorEventHandlers.click = onErrorClickOutside;

  document.addEventListener('keydown', errorEventHandlers.keydown);
  document.addEventListener('click', errorEventHandlers.click);
};

const addSuccessEventListeners = () => {
  document.addEventListener('keydown', onSuccessKeydown);
  document.addEventListener('click', onSuccessClickOutside);
};

const removeSuccessEventListeners = () => {
  document.removeEventListener('keydown', onSuccessKeydown);
  document.removeEventListener('click', onSuccessClickOutside);
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
    });
  }

  isErrorShown = true; // Устанавливаем флаг — ошибка открыта
  addErrorEventListeners(); // Добавляем обработчики с сохранением ссылок
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
        resetImageFormState();
      }
    }
  });

  // Обработчик закрытия overlay при клике вне формы
  if (overlay) {
    overlay.addEventListener('click', (evt) => {
      if (!evt.target.closest('.img-upload__wrapper')) {
        hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
        resetImageFormState();
      }
    });
  }
};

export { setupEventHandlers, showSuccessMessage, showErrorMessage };
