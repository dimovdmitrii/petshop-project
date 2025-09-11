const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Продакшен URL твоего бэка на Render
    return "https://backend-petshop-pyqt.onrender.com";
  }

  // Локальный бэк при разработке
  return "http://localhost:3333";
};

export const API_URL = getApiUrl();
