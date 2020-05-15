const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cardRouter = require('./routes/cards.js');
const userRouter = require('./routes/users.js');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


app
  .use((req, res, next) => {
    req.user = {
      _id: '5ebd17b16a9f8532b0fd0e5c',
    };

    next();
  })
  .use(cardRouter)
  .use(userRouter)
  .use('*', (req, res) => res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  }))
  .listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
