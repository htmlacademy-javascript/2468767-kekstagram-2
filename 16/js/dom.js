const getBigPicture = () => document.querySelector('.big-picture');
const getBody = () => document.body;
const getFileInput = () => document.querySelector('#upload-file');
const getOverlay = () => document.querySelector('.img-upload__overlay');
const getPreviewImage = () => document.querySelector('.img-upload__preview img');
const getCancelButton = () => document.querySelector('.img-upload__cancel');
const getHashtagsInput = () => document.querySelector('.text__hashtags');
const getDescriptionInput = () => document.querySelector('.text__description');
const getUploadForm = () => document.querySelector('#upload-select-image');
const getScaleSmallerButton = () => document.querySelector('.scale__control--smaller');
const getScaleBiggerButton = () => document.querySelector('.scale__control--bigger');
const getScaleValueField = () => document.querySelector('.scale__control--value');
const getEffectsList = () => document.querySelector('.effects');
const getEffectLevelSlider = () => document.querySelector('.effect-level__slider');
const getEffectLevelValue = () => document.querySelector('.effect-level__value');
const getEffectLevelContainer = () => document.querySelector('.img-upload__effect-level');

//получаем контейнер для списка комментариев
const getCommentsContainer = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.social__comments') || null;
};
//получаем блок, показывающий счётчик комментариев и кнопку «Загрузить ещё»
const getCommentCountElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.social__comment-count') || null;
};
//получаем кнопку «Загрузить ещё комменты»
const getCommentsLoaderElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.comments-loader') || null;
};
//уже показаные комментарии(количество)
const getShownCommentCountElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.social__comment-shown-count') || null;
};
//общее количество комментариев
const getTotalCommentCountElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.social__comment-total-count') || null;
};
//находим счетчик лайков
const getLikesCountElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.likes-count') || null;
};
//получаем элемент с подписью к изображениям
const getCaptionElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.social__caption') || null;
};
//находит тег <img> внутри модального окна (.big-picture__img img)
const getImageElement = () => {
  const bigPicture = getBigPicture();
  return bigPicture?.querySelector('.big-picture__img img') || null;
};
export {getBigPicture,getBody, getFileInput,getOverlay,getPreviewImage,getCancelButton,getHashtagsInput,getDescriptionInput,getUploadForm,getCommentsContainer,getCommentCountElement,getCommentsLoaderElement,getShownCommentCountElement,getTotalCommentCountElement,getLikesCountElement,getCaptionElement,getImageElement,getScaleSmallerButton,getScaleBiggerButton,getScaleValueField,getEffectsList,getEffectLevelSlider,getEffectLevelValue,getEffectLevelContainer};
