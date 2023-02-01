const { celebrate, Joi } = require('celebrate');

// Кастомная валидация id
function validateId(id, helper) {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  return helper.message('Передан некорретный id.');
}

module.exports.validateAuthorization = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'any.required': 'E-mail обязателен для заполнения.',
        'string.custom': 'Некорректный E-mail.',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Пароль обязателен для заполнения.',
        'string.min': 'Пароль не должен быть короче 6 символов.',
        'string.max': 'Пароль не должен быть длиннее 30 символов.',
      }),
  }),
});

module.exports.validateRegistration = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'any.required': 'Имя обязательно для заполнения.',
        'string.min': 'Имя не должно быть короче 2 символов.',
        'string.max': 'Имя не должно быть длиннее 30 символов.',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'E-mail обязателен для заполнения.',
        'string.custom': 'Некорректный E-mail.',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Пароль обязателен для заполнения.',
        'string.min': 'Пароль не должен быть короче 6 символов.',
        'string.max': 'Пароль не должен быть длиннее 30 символов.',
      }),
  }),
});

module.exports.validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Имя обязательно для заполнения.',
        'string.min': 'Имя не должно быть короче 2 символов.',
        'string.max': 'Имя не должно быть длиннее 30 символов.',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'E-mail обязателен для заполнения.',
        'string.custom': 'Некорректный E-mail.',
      }),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({
      'any.required': 'Не заполнено поле "Страна".',
    }),
    director: Joi.string().required().messages({
      'any.required': 'Не заполнено поле "Режиссер".',
    }),
    duration: Joi.number().required().messages({
      'any.required': 'Не заполнено поле "Длительность".',
    }),
    year: Joi.string().required().messages({
      'any.required': 'Не заполнено поле "Год производства".',
    }),
    description: Joi.string().required().messages({
      'any.required': 'Не заполнено поле "Описание".',
    }),
    image: Joi.string().required().uri().messages({
      'any.required': 'Не заполнено поле "Изображение".',
      'string.uri': 'Поле "Изображение" не является ссылкой.',
    }),
    trailerLink: Joi.string().required().uri().messages({
      'any.required': 'Не заполнено поле "Трейлер".',
      'string.uri': 'Поле "Трейлер" не является ссылкой.',
    }),
    thumbnail: Joi.string().required().uri().messages({
      'any.required': 'Не заполнено поле "Превью".',
      'string.uri': 'Поле "Превью" не является ссылкой.',
    }),
    movieId: Joi.number().required().messages({
      'any.required': 'Не заполнено поле "id".',
    }),
    nameRU: Joi.string().required().messages({
      'any.required': 'Не заполнено поле "Имя".',
    }),
    nameEN: Joi.string().required().messages({
      'any.required': 'Не заполнено поле "Name".',
    }),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(validateId)
      .messages({
        'any.required': 'Не передан id удаляемого фильма.',
        'string.custom': 'Некорректный id фильма.',
      }),
  }),
});
