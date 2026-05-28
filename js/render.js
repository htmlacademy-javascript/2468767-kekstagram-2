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

  // Показываем блок фильтров после отрисовки изображений
  showFiltersBlock();
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

// Функция устранения дребезга
const debounce = (callback, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};

// Новая функция для показа блока фильтров
const showFiltersBlock = () => {
  const filtersBlock = document.querySelector('.img-filters');
  if (filtersBlock) {
    // Убираем скрывающий класс
    filtersBlock.classList.remove('hidden');
    filtersBlock.classList.remove('img-filters--inactive');
  }
};

// Функция для получения 10 случайных уникальных элементов
const getRandomPhotos = (photos, count = 10) => {
  const shuffled = [...photos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, photos.length));
};

// Функция сортировки по количеству комментариев (убывание)
const sortByComments = (photos) => {
  return [...photos].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
};

// Текущий активный фильтр
let currentFilter = 'default';
let allPhotosData = [];

// Функция применения фильтра
const applyFilter = () => {
  let filteredPhotos = [];

  switch (currentFilter) {
    case 'random':
      filteredPhotos = getRandomPhotos(allPhotosData, 10);
      break;
    case 'discussed':
      filteredPhotos = sortByComments(allPhotosData);
      break;
    default:
      filteredPhotos = allPhotosData;
  }

  renderThumbs(filteredPhotos);
};

//applyFilter с задержкой 500 мс
const debouncedApplyFilter = debounce(applyFilter, 500);

// Обработчик кликов по фильтрам
const setupFilterHandlers = () => {
  const filterButtons = document.querySelectorAll('.img-filters__button');
  const defaultFilterButton = document.getElementById('filter-default');

  filterButtons.forEach(button => {
    button.addEventListener('click', (evt) => {
      // Снимаем активный класс со всех кнопок
      filterButtons.forEach(btn => btn.classList.remove('img-filters__button--active'));

      // Добавляем активный класс к нажатой кнопке
      evt.target.classList.add('img-filters__button--active');

      // Обновляем текущий фильтр
      currentFilter = evt.target.id.replace('filter-', '');

      // Применяем фильтр для устранение "дребезга"
      debouncedApplyFilter();
    });
  });

  //активируем кнопку «По умолчанию»
  defaultFilterButton.classList.add('img-filters__button--active');
};

const loadThumbsFromServer = async () => {
  try {
    const response = await fetch('https://31.javascript.htmlacademy.pro/kekstagram/data');
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }

    allPhotosData = await response.json();
    applyFilter(); // Рендерим с фильтром по умолчанию
    return allPhotosData;
  } catch (error) {
    throw new Error(`Критическая ошибка загрузки: ${error.message}`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadThumbsFromServer()
    .then(() => {
      setupFilterHandlers(); // Инициализируем обработчики фильтров после загрузки данных
    })
    .catch(() => {
      showErrorFromTemplate();
    });
});

export { renderThumbs, loadThumbsFromServer };
