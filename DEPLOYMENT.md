# Инструкции по деплою

## Проблема
Ваш фронтенд пытается обращаться к `http://localhost:3333`, который доступен только на вашем локальном компьютере. На GitHub Pages или другом хостинге этот адрес недоступен.

## Решение

### 1. Обновите конфигурацию API
В файле `src/config/api.js` замените URL на ваш реальный API:

```javascript
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Замените на ваш реальный API URL
    return 'https://your-backend-api.com';
  }
  
  return 'http://localhost:3333';
};
```

### 2. Варианты хостинга бэкенда

#### Вариант A: Heroku (бесплатно)
1. Создайте аккаунт на [Heroku](https://heroku.com)
2. Загрузите ваш бэкенд код
3. Получите URL вида: `https://your-app-name.herokuapp.com`

#### Вариант B: Railway (бесплатно)
1. Создайте аккаунт на [Railway](https://railway.app)
2. Подключите GitHub репозиторий с бэкендом
3. Получите URL вида: `https://your-app-name.railway.app`

#### Вариант C: Render (бесплатно)
1. Создайте аккаунт на [Render](https://render.com)
2. Подключите GitHub репозиторий с бэкендом
3. Получите URL вида: `https://your-app-name.onrender.com`

### 3. Обновите API URL
После получения URL бэкенда, обновите `src/config/api.js`:

```javascript
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://your-actual-backend-url.com';
  }
  
  return 'http://localhost:3333';
};
```

### 4. Пересоберите и задеплойте
```bash
npm run build
git add .
git commit -m "Update API URLs for production"
git push
```

## Альтернативное решение: Mock данные
Если у вас нет возможности задеплоить бэкенд, можно создать mock данные для демонстрации:

1. Создайте файл `src/data/mockData.js` с тестовыми данными
2. Обновите Redux slices для использования mock данных в продакшене
3. Это позволит сайту работать без бэкенда

## Проверка
После деплоя проверьте:
1. Сайт загружается без ошибок в консоли
2. API запросы идут на правильный URL
3. Данные загружаются корректно
