const router = require('express').Router();
const cards = require('../data/cards');

router.get('/cards', (req, res) => {
  res.send(cards);
});

module.exports = router;
