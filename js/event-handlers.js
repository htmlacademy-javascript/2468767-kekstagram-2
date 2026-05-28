import { isEscapeKey } from './util.js';

let currentSuccessElement = null;
let currentErrorElement = null;

// Предварительное объявление всех функций для исключения ошибок линтера
function removeSuccessMessage() {}
function removeErrorMessage() {}
function onSuccessKeydown() {}
function onSuccessClickOutside() {}
function onErrorKeydown() {}
function onErrorClickOutside() {}

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
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removeErrorMessage();
  }
};

const onErrorClickOutside = (evt) => {
  if (!currentErrorElement?.contains(evt.target)) {
    removeErrorMessage();
  }
};

// Функции удаления
const removeSuccessMessage = () => {
  if (currentSuccessElement && currentSuccessElement.parentNode) {
    currentSuccessElement.parentNode.removeChild(currentSuccessElement);
    currentSuccessElement = null;
    document.removeEventListener('keydown', onSuccessKeydown);
    document.removeEventListener('click', onSuccessClickOutside);
  }
};

const removeErrorMessage = () => {
  if (currentErrorElement && currentErrorElement.parentNode) {
    currentErrorElement.parentNode.removeChild(currentErrorElement);
    currentErrorElement = null;
    document.removeEventListener('keydown', onErrorKeydown);
    document.removeEventListener('click', onErrorClickOutside);
  }
};

// Показ сообщения об успешной отправке
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
    successButton.addEventListener('click', removeSuccessMessage);
  }

  document.addEventListener('keydown', onSuccessKeydown);
  document.addEventListener('click', onSuccessClickOutside);
};

// Показ сообщения об ошибке отправки
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
    errorButton.addEventListener('click', removeErrorMessage);
  }

  document.addEventListener('keydown', onErrorKeydown);
  document.addEventListener('click', onErrorClickOutside);
};

const sendFormData = async (formData) => {
  const submitButton = document.querySelector('.img-upload__submit');

  try {
    // Блокируем кнопку отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    const response = await fetch('https://31.javascript.htmlacademy.pro/kekstagram', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } finally {
    // Разблокируем кнопку после завершения запроса
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить';
  }
};

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
        // Отправляем данные на сервер
        await sendFormData(new FormData(uploadForm));

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

export { setupEventHandlers, showSuccessMessage, showErrorMessage, sendFormData };
