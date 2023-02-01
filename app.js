// импорты
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes/index');

const { DB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
mongoose.set('strictQuery', false);
mongoose.connect(DB, {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP за 15 минут
  standardHeaders: true, // Возвращает информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключает заголовки `X-RateLimit-*`
});

// Middlewares
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // мидлвер ограничивающий кол-во запросов. Защита от DoS-атак.
app.use(helmet()); // мидлвер для для установки security-заголовков
app.use(express.json());
app.use(cookieParser());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(routes);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT);
