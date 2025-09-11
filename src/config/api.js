const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return "https://your-app-name.railway.app";
  }

  return "http://localhost:3333";
};

export const API_URL = getApiUrl();
