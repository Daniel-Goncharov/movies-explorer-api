const router = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/users'); // импортируем контроллеры из users
const { validateUpdateProfile } = require('../middlewares/validation'); // импортируем валидаторы

router.get('/me', getUserInfo); // Получение информации о пользователе
router.patch('/me', validateUpdateProfile, updateProfile); // обновить данные пользователя

module.exports = router;
