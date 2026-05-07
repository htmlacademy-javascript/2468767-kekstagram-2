import { isEscapeKey } from './util.js';
import { getBigPicture, getBody,getCommentsContainer, getCommentCountElement, getCommentsLoaderElement,getShownCommentCountElement, getTotalCommentCountElement,getLikesCountElement, getCaptionElement, getImageElement} from './dom.js';

const COMMENTS_PER_PAGE = 5;
let currentCommentsShown = 0;

// Закрытие модального окна
const closeFullScreen = () => {
  const bigPicture = getBigPicture();
  const body = getBody();

  if (bigPicture) {
    bigPicture.classList.add('hidden');
  }
  if (body) {
    body.classList.remove('modal-open');
  }
  currentCommentsShown = 0;
};

// Настройка обработчиков закрытия
const setupCloseHandlers = () => {
  const closeButton = getBigPicture()?.querySelector('.big-picture__cancel');

  if (!closeButton){
    return;
  }

  closeButton.addEventListener('click', closeFullScreen);

  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      closeFullScreen();
    }
  });
};

const updateCommentCount = (shown, total) => {
  const shownEl = getShownCommentCountElement();
  const totalEl = getTotalCommentCountElement();

  if (!shownEl || !totalEl) {
    return;
  }

  shownEl.textContent = shown;
  totalEl.textContent = total;
};

// Создаём элемент комментария
const createCommentElement = (comment) => {
  const commentEl = document.createElement('li');
  commentEl.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = comment.avatar;
  img.alt = comment.name;

  const textEl = document.createElement('p');
  textEl.className = 'social__text';
  textEl.textContent = comment.message;

  commentEl.appendChild(img);
  commentEl.appendChild(textEl);

  return commentEl;
};

// Отрисовываем комментарии порциями
const renderComments = (comments) => {
  const commentsContainer = getCommentsContainer();
  const totalComments = comments.length;

  // Определяем диапазон комментариев для текущей порции
  const endIndex = Math.min(currentCommentsShown + COMMENTS_PER_PAGE, totalComments);
  const commentsToShow = comments.slice(currentCommentsShown, endIndex);

  // Отрисовываем новые комментарии
  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsContainer.appendChild(commentElement);
  });

  // Обновляем счётчик ПОСЛЕ отрисовки
  currentCommentsShown = endIndex;
  updateCommentCount(currentCommentsShown, totalComments);

  // Скрываем кнопку, если все комментарии загружены
  const commentsLoaderEl = getCommentsLoaderElement();
  if (currentCommentsShown >= totalComments && commentsLoaderEl) {
    commentsLoaderEl.classList.add('hidden');
  }
};

// Заполняем данные поста
const fillPostData = (photoData) => {
  const imageEl = getImageElement();
  const likesEl = getLikesCountElement();
  const totalCommentsEl = getTotalCommentCountElement();
  const captionEl = getCaptionElement();

  if (imageEl) {
    imageEl.src = photoData.url;
  }
  if (likesEl) {
    likesEl.textContent = photoData.likes;
  }
  if (totalCommentsEl) {
    totalCommentsEl.textContent = photoData.comments.length;
  }
  if (captionEl) {
    captionEl.textContent = photoData.descriptions || '';
  }
};
// Показываем элементы интерфейса
const showInterfaceElements = () => {
  const commentCountEl = getCommentCountElement();
  const commentsLoaderEl = getCommentsLoaderElement();

  if (commentCountEl) {
    commentCountEl.classList.remove('hidden');
  }
  if (commentsLoaderEl) {
    commentsLoaderEl.classList.remove('hidden');
  }
};

// Очищаем комментарии
const clearComments = () => {
  const commentsContainer = getCommentsContainer();
  if (commentsContainer) {
    commentsContainer.replaceChildren();
  }
  currentCommentsShown = 0;
};

// Настраиваем обработчик загрузки комментариев — вызывается один раз
const setupLoadMoreHandler = () => {
  const commentsLoaderEl = getCommentsLoaderElement();

  if (!commentsLoaderEl) {
    return;
  }

  commentsLoaderEl.addEventListener('click', () => {
    const bigPicture = getBigPicture();
    const savedComments = bigPicture?.dataset.currentComments;
    if (savedComments) {
      renderComments(JSON.parse(savedComments));
    }
  });
};

const openFullScreen = (photoData) => {
  const bigPicture = getBigPicture();

  if (!bigPicture) {
    throw new Error('Элемент .big-picture не найден в DOM');
  }

  // Сохраняем комментарии в атрибуте
  bigPicture.dataset.currentComments = JSON.stringify(photoData.comments);

  // Заполняем данные
  fillPostData(photoData);

  // Показываем элементы интерфейса
  showInterfaceElements();

  // Очищаем комментарии и сбрасываем счётчик
  clearComments();

  // Отрисовываем первые комментарии
  renderComments(photoData.comments);

  // Добавляем классы
  bigPicture.classList.remove('hidden');
  getBody().classList.add('modal-open');
};

// Инициализация — вызываем один раз при загрузке страницы
const initGallery = () => {
  setupCloseHandlers();
  setupLoadMoreHandler();
};

document.addEventListener('DOMContentLoaded', initGallery);
const initThumbnailHandlers = (photoDataList) => {
  const picturesContainer = document.querySelector('.pictures');

  if (!picturesContainer) {
    return;
  }

  picturesContainer.addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');
    if (!thumbnail) {
      return;
    }

    const index = Number(thumbnail.dataset.id);
    const photoData = photoDataList[index];

    if (photoData) {
      openFullScreen(photoData);
    }
  });
};

export {initGallery,initThumbnailHandlers};
