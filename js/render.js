const renderThumbs = (thumbsList) => {
  const template = document.querySelector('#picture').content.querySelector('a');
  const picturesContainer = document.querySelector('.pictures');

  picturesContainer.querySelectorAll('.picture').forEach((el) => el.remove());

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
    throw new Error('Шаблон #data-error не найден');
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

  try {
    const response = await fetch('https://31.javascript.htmlacademy.pro/kekstagram/data');
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }

    const thumbsList = await response.json();
    renderThumbs(thumbsList);
    return thumbsList;
  } catch (error) {
    throw new Error(`Критическая ошибка загрузки: ${error.message}`);
  }
};

document.addEventListener('DOMContentLoaded', () => {

  loadThumbsFromServer().catch((error) => {
    console.error('Не удалось загрузить данные:', error);
    showErrorFromTemplate();
  });
});

export { renderThumbs, loadThumbsFromServer };
