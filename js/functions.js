/*
Функция для проверки длины строки.
Она принимает строку, которую нужно проверить на максимальную длину,
и возвращает true,
если строка меньше или равна указанной длине,
и false, если строка длиннее.*/
const isStringWithinLimit = (str, maxLength) => str.length <= maxLength;

/*Функция для проверки, является ли строка палиндромом.
Палиндром — это слово или фраза, которые одинаково читаются и слева направо и справа налево*/
const isPalindrome = (string) => {

  const formattedString = string.toLowerCase().replaceAll(' ', '');
  return formattedString === formattedString.split('').reverse().join('');
};

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

