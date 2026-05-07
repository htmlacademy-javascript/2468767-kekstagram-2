import { isEscapeKey } from './util.js';
import {getBody, getFileInput,getOverlay,getPreviewImage,getCancelButton,getHashtagsInput,getDescriptionInput,getUploadForm} from './dom.js';

let pristine;

// Получаем элементы DOM через функции из dom.js
const fileInput = getFileInput();
const overlay = getOverlay();
const body = getBody();
const previewImage = getPreviewImage();
const cancelButton = getCancelButton();
const hashtagsInput = getHashtagsInput();
const descriptionInput = getDescriptionInput();
const uploadForm = getUploadForm();

// Функция открытия формы редактирования
const showEditForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
};

// Функция закрытия формы редактирования
const hideEditForm = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');

  // Сбрасываем форму
  if (fileInput) {
    fileInput.value = '';
  }
  if (previewImage) {
    previewImage.src = 'img/upload-default-image.jpg';
  }
  if (hashtagsInput) {
    hashtagsInput.value = '';
  }
  if (descriptionInput) {
    descriptionInput.value = '';
  }

  if (pristine) {
    pristine.reset();
  }
};

// Обработчик выбора файла
if (fileInput) {
  fileInput.addEventListener('change', (evt) => {
    const file = evt.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (previewImage) {
          previewImage.src = reader.result;
        }
        showEditForm();
      });

      reader.readAsDataURL(file);
    }
  });
}

// Обработчик закрытия формы по клику на кнопку «Закрыть»
if (cancelButton) {
  cancelButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    hideEditForm();
  });
}

// Обработчик закрытия формы по нажатию клавиши Esc
document.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt) && overlay && !overlay.classList.contains('hidden')) {
    // Проверяем, находится ли фокус в полях ввода хэштегов или описания
    const isInInput = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;
    if (!isInInput) {
      evt.preventDefault();
      hideEditForm();
    }
  }
});

// Предотвращение закрытия при взаимодействии с полями формы
if (overlay) {
  overlay.addEventListener('click', (evt) => {
    if (evt.target.closest('.img-upload__wrapper')) {
      return;
    }
    hideEditForm();
  });
}

// Валидация хэштегов
const validateHashtags = (value) => {
  if (!value.trim()) {
    return true; // Хэштеги необязательны
  }

  const hashtags = value.trim().split(/\s+/);

  // Проверка: не больше 5 хэштегов
  if (hashtags.length > 5) {
    return false;
  }

  const seenHashtags = new Set();

  for (const hashtag of hashtags) {
    // Проверка: хэштег начинается с #
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // Проверка: хэштег не состоит только из #
    if (hashtag.length === 1) {
      return false;
    }

    // Проверка: длина хэштега ≤ 20 символов
    if (hashtag.length > 20) {
      return false;
    }

    // Проверка: строка после # состоит только из букв и цифр
    const tagContent = hashtag.slice(1);
    if (!/^[a-zA-Z0-9]+$/.test(tagContent)) {
      return false;
    }

    // Проверка на уникальность (без учёта регистра)
    const lowerHashtag = hashtag.toLowerCase();
    if (seenHashtags.has(lowerHashtag)) {
      return false;
    }
    seenHashtags.add(lowerHashtag);
  }

  return true;
};

// Получение сообщения об ошибке для хэштегов
const getHashtagError = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/);
  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэштегов';
  }

  const seenHashtags = new Set();
  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return 'Хэштег должен начинаться с символа #';
    }
    if (hashtag.length === 1) {
      return 'Хэштег не может состоять только из одной решётки';
    }
    if (hashtag.length > 20) {
      return 'Максимальная длина хэштега — 20 символов';
    }
    const tagContent = hashtag.slice(1);
    if (!/^[a-zA-Z0-9]+$/.test(tagContent)) {
      return 'Хэштег может содержать только буквы и цифры после решётки';
    }
    const lowerHashtag = hashtag.toLowerCase();
    if (seenHashtags.has(lowerHashtag)) {
      return 'Один и тот же хэштег не может быть использован дважды';
    }
    seenHashtags.add(lowerHashtag);
  }
  return 'Неверный формат хэштегов';
};

// Инициализация Pristine
if (typeof Pristine !== 'undefined' && uploadForm) {
  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'pristine-error'
  });

  // Добавляем валидатор для хэштегов с разными сообщениями об ошибках
  if (hashtagsInput) {
    pristine.addValidator(
      hashtagsInput,
      validateHashtags,
      getHashtagError,
      2, // priority
      true // halt on fail
    );
  }

  // Валидатор для описания (макс. 140 символов)
  if (descriptionInput) {
    pristine.addValidator(
      descriptionInput,
      (value) => value.length <= 140,
      'Длина комментария не может превышать 140 символов',
      1,
      false
    );
  }
}

// Обработчик отправки формы
if (uploadForm) {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine && pristine.validate()) {
      // Форма валидна — отправляем данные
      const formData = new FormData(uploadForm);
      throw new Error('Форма валидна, отправляем данные:', formData);
      hideEditForm();
    } else {
      console.log('Форма невалидна, отправка отменена');
    }
  });
}

export {showEditForm,hideEditForm};
