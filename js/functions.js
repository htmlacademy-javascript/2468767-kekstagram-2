/*
Функция для проверки длины строки.
Она принимает строку, которую нужно проверить на максимальную длину,
и возвращает true,
если строка меньше или равна указанной длине,
и false, если строка длиннее.*/

const isStringWithinLimit = (str='', maxLength=20) =>{
  return str.length <= maxLength;
};
isStringWithinLimit();

/*Функция для проверки, является ли строка палиндромом.
Палиндром — это слово или фраза, которые одинаково читаются и слева направо и справа налево*/
const isPalindrome = (string) => {
 string = string.replaceAll(' ','');
 string = string.toLowerCase();

 let reversed = '';
 for(let i = string.length - 1;i >=0; i--){
  reversed +=string[i];
 }
 return string === reversed;
};

isPalindrome();
