// импорты
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB } = require('./config');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
mongoose.set('strictQuery', false);
mongoose.connect(DB, { useNewUrlParser: true });

// Middlewares
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // мидлвер ограничивающий кол-во запросов. Защита от DoS-атак.
app.use(helmet()); // мидлвер для для установки security-заголовков
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT);
