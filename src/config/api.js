// Конфигурация API для разных сред
const getApiUrl = () => {
  // Если мы в продакшене (GitHub Pages), используем реальный API
  if (import.meta.env.PROD) {
    // Замените на ваш реальный API URL (полученный после деплоя)
    return "https://petshop-project-blond.vercel.app/"; // или .onrender.com, или .herokuapp.com
  }

  // В разработке используем локальный сервер
  return "http://localhost:3333";
};

export const API_URL = getApiUrl();

// Альтернативный вариант - если у вас есть переменная окружения
// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
