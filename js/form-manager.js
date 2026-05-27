const showEditForm = (overlay, body) => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
};

const hideEditForm = (overlay, body, fileInput, previewImage, hashtagsInput, descriptionInput, pristine) => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  fileInput.value = '';
  previewImage.src = 'img/upload-default-image.jpg';
  hashtagsInput.value = '';
  descriptionInput.value = '';
  pristine.reset();
};

export { showEditForm, hideEditForm };
