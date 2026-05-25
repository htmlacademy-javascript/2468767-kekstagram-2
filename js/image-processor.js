import {
  getScaleSmallerButton,
  getScaleBiggerButton,
  getScaleValueField,
  getPreviewImage,
  getEffectsList,
  getEffectLevelSlider,
  getEffectLevelValue,
  getEffectLevelContainer
} from './dom.js';
import { SCALE, EFFECTS, DEFAULT_EFFECT } from './data.js';

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
  if (!previewImage){
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

// Инициализация слайдера уровня эффекта
const initEffectSlider = () => {
  const slider = getEffectLevelSlider();
  const container = getEffectLevelContainer();

  if (!slider || !container) {
    // Отключаем правило для этой строки
    // eslint-disable-next-line no-console
    console.warn('Элементы слайдера эффекта не найдены');
    return;
  }

  try {
    // Скрываем контейнер слайдера по умолчанию
    container.classList.add('hidden');

    noUiSlider.create(slider, {
      start: [EFFECTS[DEFAULT_EFFECT].min],
      connect: 'lower',
      range: {
        'min': EFFECTS[DEFAULT_EFFECT].min,
        'max': EFFECTS[DEFAULT_EFFECT].max
      },
      step: EFFECTS[DEFAULT_EFFECT].step,
      format: {
        to: (value) => Math.round(value * 100) / 100, // округление до 2 знаков
        from: (value) => parseFloat(value)
      }
    });

    // Обработчик изменения значения слайдера
    slider.noUiSlider.on('update', (values, handle) => {
      const currentEffect = getCurrentEffect();
      const effectConfig = EFFECTS[currentEffect];
      const value = Number(values[handle]);

      // Обновляем отображение значения
      const valueDisplay = getEffectLevelValue();
      if (valueDisplay) {
        valueDisplay.textContent = `${value}${effectConfig.unit}`;
      }

      // Применяем эффект
      applyEffectToImage(currentEffect, value);
    });
  } catch (error) {
    // Отключаем правило для этой строки
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
  } else {
    // Обновляем настройки слайдера
    slider.noUiSlider.updateOptions({
      range: { min: effectConfig.min, max: effectConfig.max },
      step: effectConfig.step,
      start: [effectConfig.min]
    });

    // Показываем контейнер и обновляем отображение
    container.classList.remove('hidden');
    valueDisplay.textContent = `${effectConfig.min}${effectConfig.unit}`;

    // Применяем начальный эффект
    applyEffectToImage(effect, effectConfig.min);
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

export { initScaleControls };
