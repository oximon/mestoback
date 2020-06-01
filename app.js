const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cardRouter = require('./routes/cards.js');
const userRouter = require('./routes/users.js');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

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
  .post('/signup', createUser)
  .post('/signin', login)
  .use(auth)
  .use(cardRouter)
  .use(userRouter)
  .use('*', (req, res) => res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  }))
  .listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
