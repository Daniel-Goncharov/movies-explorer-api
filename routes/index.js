const router = require('express').Router();

const userRouter = require('./users');
const authRouter = require('./auth');
const moviesRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

const auth = require('../middlewares/auth');

// Не защищенные маршруты
router.use('/', authRouter);
// Защищенные маршруты
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Запрашиваемая страница не найдена' }));
});

module.exports = router;
