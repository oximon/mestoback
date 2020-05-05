const path = require('path');
const express = require('express');
const cardRouter = require('./routes/cards.js');
const userRouter = require('./routes/users.js');

const { PORT = 3000 } = process.env;
const app = express();


app
  .use(express.static(path.join(__dirname, 'public')))
  .use('/', cardRouter)
  .use('/', userRouter)
  .use('*', (req, res) => res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  }))
  .listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
