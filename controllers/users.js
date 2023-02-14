const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// Запрос информации о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError({ message: 'Такого пользователя не существует.' }))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// Обновить данные пользователя
module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError({ message: 'Такого пользователя не существует.' }))
    .then((updatedUserData) => {
      res.send(updatedUserData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError({
            message: 'Пользователь с таким email уже существует.',
          }),
        );
      }
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: 'При обновлении профиля переданы некорректные данные',
          }),
        );
      }
      return next(err);
    });
};
