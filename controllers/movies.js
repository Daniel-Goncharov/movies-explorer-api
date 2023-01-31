const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

// Запрос всех фильмов с сервера
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

// Создать карточку фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: 'Для создания карточки фильма переданы некорректные данные',
          }),
        );
      }
      return next(err);
    });
};

// Удалить карточку фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError({ message: 'Карточки фильма с указанным _id не обнаружено.' }))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError({ message: 'Отказ. Вы не автор карточки фильма' }));
      }
      return Movie.findByIdAndRemove(req.params.movieId).then(() => res.send({ message: 'Карточка фильма удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: 'Передан неверный _id карточки фильма',
          }),
        );
      }
      return next(err);
    });
};
