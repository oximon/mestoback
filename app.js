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
      email: Joi.string().required().email(),
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
  .use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }))
  .use(errorLogger)
  .use(errors())
  .use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка в валидации данных' });
    }
    if (err.name === 'MongoError') {
      return res.status(11000).send({ message: 'Отсутствует почта' });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'ID не найден' });
    }
    if (!err.statusCode) {
      const { statusCode = 500, message } = err;
      return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
    }
    res.status(err.statusCode).send({ message: err.message });
    return next();
  })
  .listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
