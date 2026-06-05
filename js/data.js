// Константы для управления масштабом изображения
const SCALE = {
  STEP: 25, // шаг изменения в процентах
  MIN_VALUE: 25, // минимальное значение в процентах
  MAX_VALUE: 100, // максимальное значение в процентах
  DEFAULT_VALUE: 100 // значение по умолчанию в процентах
};

// Константы для эффектов
const EFFECTS = {
  'none': {
    filter: null,
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  'chrome': {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  'sepia': {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  'marvin': {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  'phobos': {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  'heat': {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
};
// Значение по умолчанию для эффекта
const DEFAULT_EFFECT = 'none';

export {SCALE, EFFECTS, DEFAULT_EFFECT};
