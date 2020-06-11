const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const cardRouter = require('./routes/cards.js');
const userRouter = require('./routes/users.js');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


app
  .use(requestLogger)
  .get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  })
  .post('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }), createUser)
  .post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }), login)
  .use(auth)
  .use(cardRouter)
  .use(userRouter)
  .use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')))
  .use(errorLogger)
  .use(errors())
  .use((err, req, res, next) => {
    if (!err.statusCode) {
      const { statusCode = 500, message } = err;
      res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
    }
    res.status(err.statusCode).send({ message: err.message });
    next();
  })
  .listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
