const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

// Отправляет данные формы на сервер
const sendFormData = async (formData) => {
  const submitButton = document.querySelector('.img-upload__submit');


  try {
    // Блокируем кнопку отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Ошибка отправки данных: ${error.message}`);
  } finally {
    // Разблокируем кнопку после завершения запроса
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить';
  }
};

// Получает данные с сервера
const getData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Ошибка получения данных: ${error.message}`);
  }
};

export { sendFormData, getData };
