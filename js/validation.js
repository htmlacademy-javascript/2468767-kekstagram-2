const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().split(/\s+/);
  if (hashtags.length > 5) {
    return false;
  }

  const seenHashtags = new Set();
  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return false;
    }
    if (hashtag.length === 1) {
      return false;
    }
    if (hashtag.length > 20) {
      return false;
    }
    const tagContent = hashtag.slice(1);
    if (!/^[a-zA-Z0-9]+$/.test(tagContent)) {
      return false;
    }

    const lowerHashtag = hashtag.toLowerCase();
    if (seenHashtags.has(lowerHashtag)) {
      return false;
    }
    seenHashtags.add(lowerHashtag);
  }
  return true;
};

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

const initValidation = (uploadForm, hashtagsInput, descriptionInput) => {
  let pristine;
  if (typeof Pristine !== 'undefined' && uploadForm) {
    pristine = new Pristine(uploadForm, {
      classTo: 'img-upload__field-wrapper',
      errorClass: 'img-upload__field-wrapper--error',
      successClass: 'img-upload__field-wrapper--valid',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextTag: 'div',
      errorTextClass: 'pristine-error'
    });

    if (hashtagsInput) {
      pristine.addValidator(
        hashtagsInput,
        validateHashtags,
        getHashtagError,
        2,
        true
      );
    }

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
  return pristine;
};

export {validateHashtags, getHashtagError, initValidation };
