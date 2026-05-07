import { isEscapeKey } from './util.js';

// Элементы DOM
const fileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const body = document.body;
const previewImage = document.querySelector('.img-upload__preview img');
const cancelButton = document.querySelector('.img-upload__cancel');

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
  fileInput.value = '';
  previewImage.src = 'img/upload-default-image.jpg';
};

// Обработчик выбора файла
fileInput.addEventListener('change', (evt) => {
  const file = evt.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      previewImage.src = reader.result;
      showEditForm();
    });

    reader.readAsDataURL(file);
  }
});

// Обработчик закрытия формы по клику на кнопку «Закрыть»
cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  hideEditForm();
});

// Обработчик закрытия формы по нажатию клавиши Esc
document.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt) && !overlay.classList.contains('hidden')) {
    evt.preventDefault();
    hideEditForm();
  }
});

// Предотвращение закрытия при взаимодействии с полями формы
overlay.addEventListener('click', (evt) => {
  if (evt.target.closest('.img-upload__wrapper')) {
    return;
  }
  hideEditForm();
});

export {
  showEditForm,
  hideEditForm
};
