const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies'); // импортируем контроллеры из movies
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation'); // импортируем валидаторы

router.get('/', getMovies); // Возвращает все фильмы пользователя
router.post('/', validateCreateMovie, createMovie); // Создаёт карточку фильма
router.delete('/:movieId', validateDeleteMovie, deleteMovie); // Удаляет фильм по id

module.exports = router;
