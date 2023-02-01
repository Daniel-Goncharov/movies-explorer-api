const router = require('express').Router();
const { validateAuthorization, validateRegistration } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/auth');

router.post('/signup', validateRegistration, createUser);
router.post('/signin', validateAuthorization, login);

module.exports = router;
