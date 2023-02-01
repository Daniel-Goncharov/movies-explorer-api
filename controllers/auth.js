const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET = 'dev-secret', EXPIRES_IN = '30d' } = process.env;

// регистрация нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED_CODE).send({
        _id: user._id,
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError({
            message: 'Пользователь с таким email уже существует',
          }),
        );
      }
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: 'При регистрации пользователя переданы некорректные данные',
          }),
        );
      }
      return next(err);
    });
};

// авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: EXPIRES_IN,
        },
      );
      res.send({ token });
    })
    .catch(next);
};
