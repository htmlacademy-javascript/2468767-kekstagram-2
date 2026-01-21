/*
Функция для проверки длины строки.
Она принимает строку, которую нужно проверить на максимальную длину,
и возвращает true,
если строка меньше или равна указанной длине,
и false, если строка длиннее.*/

const isStringWithinLimit = (str, maxLength) => str.length <= maxLength;

// Строка короче 20 символов
console.log(isStringWithinLimit('проверяемая строка', 20)); // true
// Длина строки ровно 18 символов
console.log(isStringWithinLimit('проверяемая строка', 18)); // true
// Строка длиннее 10 символов
console.log(isStringWithinLimit('проверяемая строка', 10)); // false

/*Функция для проверки, является ли строка палиндромом.
Палиндром — это слово или фраза, которые одинаково читаются и слева направо и справа налево*/
const isPalindrome = (string) => {

  const formattedString = string.toLowerCase().replaceAll(' ', '');
  return formattedString === formattedString.split('').reverse().join('');
};

// Строка является палиндромом
console.log(isPalindrome('топот')); // true
// Несмотря на разный регистр, тоже палиндром
console.log(isPalindrome('ДовОд')); // true
// Это не палиндром
console.log(isPalindrome('Кекс')); // false
// Это палиндром
console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true

/*Функция принимает строку, извлекает содержащиеся в ней цифры от 0 до 9 и возвращает их в виде целого положительного числа.
Если в строке нет ни одной цифры, функция должна вернуть NaN*/

const filterDigitsFromString = (str) => {

  const stringInput = String(str);

  /* переменная для накопления цифр*/
  let digits = '';

  /*цикл — для перебора полученной строки*/
  for (let i = 0; i < stringInput.length; i++) {
    const char = stringInput[i];
    if (char >= '0' && char <= 9) {
      digits += char;
    }
  }

  return digits ? parseInt(digits, 10) : NaN;
};

console.log(filterDigitsFromString('2023 год')); // 2023
console.log(filterDigitsFromString('ECMAScript 2022')); // 2022
console.log(filterDigitsFromString('1 кефир, 0.5 батона')); // 105
console.log(filterDigitsFromString('агент 007')); // 7
console.log(filterDigitsFromString('а я томат')); // NaN
console.log(filterDigitsFromString(2023)); // 2023
console.log(filterDigitsFromString(-1)); // 1
console.log(filterDigitsFromString(1.5)); // 15
