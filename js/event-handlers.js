import { isEscapeKey } from './util.js';

let currentSuccessElement = null;
let currentErrorElement = null;

// Удаление сообщения об успехе
const removeSuccessMessage = () => {
  if (currentSuccessElement && currentSuccessElement.parentNode) {
    currentSuccessElement.parentNode.removeChild(currentSuccessElement);
    currentSuccessElement = null;
    document.removeEventListener('keydown', onSuccessKeydown);
    document.removeEventListener('click', onSuccessClickOutside);
  }
};

// Обработчик нажатия клавиш для сообщения успеха
const onSuccessKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removeSuccessMessage();
  }
};

// Обработчик клика вне блока сообщения успеха
const onSuccessClickOutside = (evt) => {
  if (!currentSuccessElement?.contains(evt.target)) {
    removeSuccessMessage();
  }
};

// Показ сообщения об успешной отправке
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    console.warn('Шаблон #success не найден');
    return;
  }

  const fragment = successTemplate.content.cloneNode(true);
  currentSuccessElement = fragment.firstElementChild; // Извлекаем реальный DOM-элемент

  if (!currentSuccessElement) {
    console.warn('Не удалось извлечь элемент из шаблона #success');
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

// Удаление сообщения об ошибке
const removeErrorMessage = () => {
  if (currentErrorElement && currentErrorElement.parentNode) {
    currentErrorElement.parentNode.removeChild(currentErrorElement);
    currentErrorElement = null;
    document.removeEventListener('keydown', onErrorKeydown);
    document.removeEventListener('click', onErrorClickOutside);
  }
};

// Обработчик нажатия клавиш для сообщения ошибки
const onErrorKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removeErrorMessage();
  }
};

// Обработчик клика вне блока сообщения ошибки
const onErrorClickOutside = (evt) => {
  if (!currentErrorElement?.contains(evt.target)) {
    removeErrorMessage();
  }
};

// Показ сообщения об ошибке отправки
const showErrorMessage = (errorMessage) => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    console.warn('Шаблон #error не найден');
    return;
  }

  const fragment = errorTemplate.content.cloneNode(true);
  currentErrorElement = fragment.firstElementChild; // Извлекаем реальный DOM-элемент

  if (!currentErrorElement) {
    console.warn('Не удалось извлечь элемент из шаблона #error');
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
  body
) => {
  if (fileInput) {
    fileInput.addEventListener('change', (evt) => {
      const file = evt.target.files[0];
      if (!file) {
        console.warn('Файл не выбран');
        return;
      }
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (previewImage) {
            previewImage.src = reader.result;
          } else {
            console.warn('Элемент previewImage не найден');
          }
          showEditForm(overlay, body); // Используем переданный body
        });
        reader.readAsDataURL(file);
      } else {
        console.warn('Выбран не-изобразительный файл:', file.type);
      }
    });
  }

  // Обработчик закрытия по кнопке «Закрыть»
  if (cancelButton) {
    cancelButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
    });
  }

  // Обработчик закрытия по Esc
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt) && overlay && !overlay.classList.contains('hidden')) {
      const isInInput = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;
      if (!isInInput) {
        evt.preventDefault();
        hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
      }
    }
  });

  // Предотвращение закрытия при клике вне формы
  if (overlay) {
    overlay.addEventListener('click', (evt) => {
      if (!evt.target.closest('.img-upload__wrapper')) {
        hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
      }
    });
  }

   // Обработчик отправки формы с обработкой успеха/ошибки
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      if (!pristine || !pristine.validate()) {
        return;
      }
      try {
        // Здесь должна быть функция отправки данных на сервер
        await sendFormData(new FormData(uploadForm));
        // Показ успеха и закрытие формы
        showSuccessMessage();
        hideEditForm(overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine);
      } catch (error) {
        // Показ ошибки — форма остаётся открытой для повторной отправки
        showErrorMessage('Не удалось отправить форму. Проверьте подключение и попробуйте ещё раз.');
      }
    });
  }
};

export { setupEventHandlers, showSuccessMessage, showErrorMessage };