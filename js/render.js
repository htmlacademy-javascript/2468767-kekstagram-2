const renderThumbs = (thumbsList) => {
  const template = document.querySelector('#picture').content.querySelector('a');
  const picturesContainer = document.querySelector('.pictures');

  picturesContainer.querySelectorAll('.picture').forEach(el => el.remove());

  const fragment = document.createDocumentFragment();

  thumbsList.forEach((data, index) => {
    const element = template.cloneNode(true);
    const img = element.querySelector('.picture__img');
    const likes = element.querySelector('.picture__likes');
    const comments = element.querySelector('.picture__comments');

    if (img) {
      img.src = data.url;
      img.alt = data.description || 'Фотография пользователя';
    }
    if (likes) {
      likes.textContent = data.likes;
    }
    if (comments) {
      comments.textContent = data.comments?.length || 0;
    }
    element.dataset.id = index;
    fragment.appendChild(element);
  });
  picturesContainer.appendChild(fragment);
};

const showErrorFromTemplate = () => {
  const errorTemplate = document.querySelector('#data-error');
  if (!errorTemplate) {
    console.warn('Шаблон #data-error не найден');
    return;
  }
  const errorElement = errorTemplate.content.cloneNode(true);
  document.body.appendChild(errorElement);
  setTimeout(() => {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }, 5000);
};

const loadThumbsFromServer = async () => {
  console.log('Запуск загрузки данных с сервера...');

  try {
    console.log('Отправляем fetch-запрос к API...');
    const response = await fetch('https://31.javascript.htmlacademy.pro/kekstagram/data');

    console.log('Статус ответа:', response.status);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }

    const thumbsList = await response.json();
    console.log('Данные успешно получены:', thumbsList.length, 'фотографий');
    renderThumbs(thumbsList);
    return thumbsList;
  } catch (error) {
    console.error('Критическая ошибка загрузки:', error);
    showErrorFromTemplate();
    return [];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Страница загружена, инициализируем загрузку данных...');
  loadThumbsFromServer();
});

export { renderThumbs, loadThumbsFromServer };
