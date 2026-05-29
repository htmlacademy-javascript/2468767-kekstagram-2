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

// Храним текущие настройки эффекта
let currentEffectSettings = {
  effect: 'none',
  level: 0
};

// Получает текущий выбранный эффект
const getCurrentEffect = () => {
  const effectsList = getEffectsList();
  if (!effectsList) {
    return currentEffectSettings.effect;
  }

  const activeEffect = effectsList.querySelector('.effects__radio:checked');
  return activeEffect ? activeEffect.value : currentEffectSettings.effect;
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
  if (effect === 'none' || !effectConfig?.filter) {
    previewImage.style.filter = 'none';
    return;
  }

  const unit = effectConfig.unit || '';
  previewImage.style.filter = `${effectConfig.filter}(${value}${unit})`;
};

// Получает или создаёт скрытое поле для эффекта
const getOrCreateHiddenInput = (name, value) => {
  let input = document.querySelector(`input[name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    const form = document.querySelector('.img-upload__form');
    if (form) {
      form.appendChild(input);
    }
  }
  input.value = value;
  return input;
};

// Обновляет скрытые поля формы с данными об эффекте
const updateEffectFormFields = (effect, level) => {
  getOrCreateHiddenInput('effect', effect);
  getOrCreateHiddenInput('effect-level', level);
  // Сохраняем текущие настройки
  currentEffectSettings = { effect, level };
};

// Создаёт слайдер уровня эффекта с заданными настройками
const createEffectSlider = (slider, effect) => {
  noUiSlider.create(slider, {
    start: [effect === 'none' ? 0 : EFFECTS[effect].max],
    connect: 'lower',
    range: {
      min: effect === 'none' ? 0 : EFFECTS[effect].min,
      max: effect === 'none' ? 0 : EFFECTS[effect].max
    },
    step: effect === 'none' ? 1 : EFFECTS[effect].step,
    format: {
      to: (value) => Math.round(value * 100) / 100,
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

    // Обновляем отображение значения
    const valueDisplay = getEffectLevelValue();
    if (valueDisplay) {
      valueDisplay.textContent = `${value}${effectConfig?.unit || ''}`;
    }

    // Применяем эффект
    applyEffectToImage(currentEffect, value);

    // Обновляем скрытые поля формы при изменении уровня эффекта
    updateEffectFormFields(currentEffect, value);
  });
};

// Инициализация слайдера уровня эффекта
const initEffectSlider = () => {
  const slider = getEffectLevelSlider();
  const container = getEffectLevelContainer();

  if (!slider || !container) {
    return;
  }

  try {
    // Скрываем контейнер слайдера по умолчанию
    container.classList.add('hidden');

    // Создаём слайдер с настройками для 'none'
    createEffectSlider(slider, 'none');

    // Настраиваем обработчики событий
    setupSliderEventListeners(slider);
  } catch (error) {
    // Обработка ошибок без console.error
  }
};

// Обновляет слайдер при смене эффекта
const updateEffectSlider = (effect) => {
  const slider = getEffectLevelSlider();
  const container = getEffectLevelContainer();
  const valueDisplay = getEffectLevelValue();

  if (!slider || !container || !valueDisplay) {
    return;
  }

  // Удаляем старый слайдер, если он существует
  if (slider.noUiSlider) {
    slider.noUiSlider.destroy();
  }

  if (effect === 'none') {
    // Скрываем слайдер для эффекта 'none'
    container.classList.add('hidden');
    const previewImage = getPreviewImage();
    if (previewImage) {
      previewImage.style.filter = 'none';
    }
    updateEffectFormFields('none', 0);
  } else {
    const effectConfig = EFFECTS[effect];
    // Создаём новый слайдер с настройками для текущего эффекта
    createEffectSlider(slider, effect);
    // Показываем контейнер и обновляем отображение
    container.classList.remove('hidden');
    valueDisplay.textContent = `${effectConfig.max}${effectConfig.unit}`;

    // Применяем эффект с максимальной насыщенностью
    applyEffectToImage(effect, effectConfig.max);
    // Обновляем поля формы
    updateEffectFormFields(effect, effectConfig.max);
  }
};

// Сброс масштаба к 100 %
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

  // Выбираем эффект «none» и триггер события изменения
  const originalEffectButton = effectsList.querySelector('#effect-none');
  if (originalEffectButton) {
    originalEffectButton.checked = true;
    originalEffectButton.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  // Обновляем слайдер
  updateEffectSlider('none');
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
  // 1. Сброс масштаба к 100 %
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
    // Также сбрасываем стили трансформации и фильтра
    previewImage.style.transform = 'scale(1)';
    previewImage.style.filter = 'none';
  }
};

// Экспортируем необходимые функции
export {initScaleControls, resetImageFormState};
