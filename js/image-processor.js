import {
  getScaleSmallerButton,
  getScaleBiggerButton,
  getScaleValueField,
  getPreviewImage,
  getEffectsList,
  getEffectLevelSlider,
  getEffectLevelValue,
  getEffectLevelContainer,
  getHashtagsInput,
  getDescriptionInput,
  getFileInput
} from './dom.js';
import { SCALE, EFFECTS, DEFAULT_EFFECT } from './data.js';

let currentEffectLevel = EFFECTS[DEFAULT_EFFECT].min;

// Получает текущий выбранный эффект
const getCurrentEffect = () => {
  const effectsList = getEffectsList();
  if (!effectsList) {
    return DEFAULT_EFFECT;
  }

  const activeEffect = effectsList.querySelector('.effects__radio:checked');
  return activeEffect ? activeEffect.value : DEFAULT_EFFECT;
};

// Применяет масштабирование к изображению
const applyScaleToImage = (scalePercent) => {
  const scaleValue = scalePercent / 100;
  const previewImage = getPreviewImage();
  if (previewImage) {
    previewImage.style.transform = `scale(${scaleValue})`;
  }
};

// Обновляет масштаб (только кнопки и поле ввода)
const updateScale = (newValue) => {
  // Ограничиваем значение диапазоном
  const clampedValue = Math.max(
    SCALE.MIN_VALUE,
    Math.min(SCALE.MAX_VALUE, newValue)
  );

  // Устанавливаем новое значение с символом %
  const valueField = getScaleValueField();
  valueField.value = `${clampedValue}%`;

  // Применяем трансформацию к изображению
  applyScaleToImage(clampedValue);
};

// Применяет CSS‑фильтр к изображению
const applyEffectToImage = (effect, value) => {
  const previewImage = getPreviewImage();
  if (!previewImage) {
    return;
  }
  const effectConfig = EFFECTS[effect];
  if (effect === 'none' || !effectConfig.filter) {
    previewImage.style.filter = 'none';
    return;
  }

  const unit = effectConfig.unit || '';
  previewImage.style.filter = `${effectConfig.filter}(${value}${unit})`;
};

// Создаёт слайдер уровня эффекта с заданными настройками
const createEffectSlider = (slider, effect) => {
  noUiSlider.create(slider, {
    start: [EFFECTS[effect].min],
    connect: 'lower',
    range: {
      min: EFFECTS[effect].min,
      max: EFFECTS[effect].max
    },
    step: EFFECTS[effect].step,
    format: {
      to: (value) => Math.round(value * 100) / 100, // округление до 2 знаков
      from: (value) => parseFloat(value)
    }
  });
};

// Настраивает обработчики событий для слайдера
const setupSliderEventListeners = (slider) => {
  slider.noUiSlider.on('update', (values, handle) => {
    const currentEffect = getCurrentEffect();
    const effectConfig = EFFECTS[currentEffect];
    const value = Number(values[handle]);

    // Сохраняем текущий уровень эффекта в переменную
    currentEffectLevel = value;

    // Обновляем отображение значения
    const valueDisplay = getEffectLevelValue();
    if (valueDisplay) {
      valueDisplay.textContent = `${value}${effectConfig.unit}`;
      valueDisplay.value = value;
    }

    // Применяем эффект
    applyEffectToImage(currentEffect, value);
  });
};

// Инициализация слайдера уровня эффекта
const initEffectSlider = () => {
  const slider = getEffectLevelSlider();
  const container = getEffectLevelContainer();

  if (!slider || !container) {
    // eslint-disable-next-line no-console
    console.warn('Элементы слайдера эффекта не найдены');
    return;
  }

  try {
    // Скрываем контейнер слайдера по умолчанию
    container.classList.add('hidden');

    // Создаём слайдер с настройками по умолчанию
    createEffectSlider(slider, DEFAULT_EFFECT);

    // Настраиваем обработчики событий
    setupSliderEventListeners(slider);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка инициализации слайдера эффекта:', error);
  }
};

// Обновляет слайдер при смене эффекта
const updateEffectSlider = (effect) => {
  const slider = getEffectLevelSlider();
  const container = getEffectLevelContainer();
  const valueDisplay = getEffectLevelValue();

  if (!slider || !slider.noUiSlider || !container || !valueDisplay) {
    return;
  }

  const effectConfig = EFFECTS[effect];

  if (effect === 'none') {
    // Скрываем слайдер для эффекта 'none'
    container.classList.add('hidden');
    getPreviewImage().style.filter = 'none';
    currentEffectLevel = 0;
    // Явно сбрасываем значение в поле ввода
    valueDisplay.textContent = '0';
    valueDisplay.value = '0';

    // Сброс слайдера к 0
    slider.noUiSlider.set(0);
  } else {
    // Обновляем настройки слайдера
    slider.noUiSlider.updateOptions({
      range: { min: effectConfig.min, max: effectConfig.max },
      step: effectConfig.step,
      start: [effectConfig.max]
    });

    // Показываем контейнер и обновляем отображение
    container.classList.remove('hidden');
    valueDisplay.textContent = `${effectConfig.max}${effectConfig.unit}`;

    currentEffectLevel = effectConfig.max;
    // Применяем начальный эффект
    applyEffectToImage(effect, effectConfig.max);
  }
};

// Получает текущий уровень эффекта
const getCurrentEffectLevel = () => currentEffectLevel;

// Сброс масштаба к 100 %
const resetScale = () => {
  updateScale(SCALE.DEFAULT_VALUE);
};

// Сброс эффекта на «Оригинал»
const resetEffect = () => {
  const effectsList = getEffectsList();
  if (!effectsList) {
    return;
  }

  // Сбрасываем все радио‑кнопки эффектов
  const effectButtons = effectsList.querySelectorAll('.effects__radio');
  effectButtons.forEach((button) => {
    button.checked = false;
  });

  // Выбираем эффект «none»
  const originalEffectButton = effectsList.querySelector('#effect-none');
  if (originalEffectButton) {
    originalEffectButton.checked = true;
  }

  // Обновляем слайдер
  updateEffectSlider('none');
  // Дополнительная гарантия сброса поля ввода
  const valueDisplay = getEffectLevelValue();
  if (valueDisplay) {
    valueDisplay.value = '0';
  }
};

// Обработчик смены эффекта
const initEffectsControls = () => {
  const effectsList = getEffectsList();
  if (!effectsList) {
    return;
  }

  effectsList.addEventListener('change', (e) => {
    if (e.target.matches('.effects__radio')) {
      updateEffectSlider(e.target.value);
    }
  });
};

const initScaleControls = () => {
  const smallerButton = getScaleSmallerButton();
  const biggerButton = getScaleBiggerButton();
  const valueField = getScaleValueField();

  // Устанавливаем значение по умолчанию для масштаба
  valueField.value = `${SCALE.DEFAULT_VALUE}%`;
  applyScaleToImage(SCALE.DEFAULT_VALUE);

  // Обработчик для кнопки уменьшения масштаба
  if (smallerButton) {
    smallerButton.addEventListener('click', () => {
      const currentValue = parseInt(valueField.value, 10);
      updateScale(currentValue - SCALE.STEP);
    });
  }

  // Обработчик для кнопки увеличения масштаба
  if (biggerButton) {
    biggerButton.addEventListener('click', () => {
      const currentValue = parseInt(valueField.value, 10);
      updateScale(currentValue + SCALE.STEP);
    });
  }

  // Инициализируем слайдер эффектов
  initEffectSlider();

  // Инициализируем управление эффектами
  initEffectsControls();

  // Устанавливаем эффект по умолчанию
  updateEffectSlider(DEFAULT_EFFECT);
};
// Полный сброс состояния формы редактирования изображения
const resetImageFormState = () => {
  // 1. Сброс масштаба к 100 %
  resetScale();

  // 2. Сброс эффекта на «Оригинал»
  resetEffect();

  // 3. Очистка полей ввода
  const hashtagsInput = getHashtagsInput();
  const descriptionInput = getDescriptionInput();
  if (hashtagsInput) {
    hashtagsInput.value = '';
  }
  if (descriptionInput) {
    descriptionInput.value = '';
  }

  // 4. Очистка поля загрузки фотографии
  const fileInput = getFileInput();
  if (fileInput) {
    fileInput.value = '';
  }

  // 5. Сброс превью изображения
  const previewImage = getPreviewImage();
  if (previewImage) {
    previewImage.src = 'img/upload-default-image.jpg';
  }
};

export { initScaleControls, resetImageFormState, getCurrentEffect, getCurrentEffectLevel };
