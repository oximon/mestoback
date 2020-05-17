const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({})
      .orFail(() => res.status(404).send('Карточка не найдена'))
      .populate('owner');
    res.send(card);
  } catch (err) {
    res.status(500).res.send({ messate: err.message });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка в валидации данных' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.id)
      .orFail(() => res.status(404).send('Карточка не найдена'));
    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => res.status(404).send('Карточка не найдена'));
    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => res.status(404).send('Карточка не найдена'));
    res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
