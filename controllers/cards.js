/* eslint-disable consistent-return */
const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({})
      .populate('owner');
    res.send({ data: card });
  } catch (err) {
    return res.status(500).res.send({ messate: err.message });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка в валидации данных' });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
      .orFail(() => Error('Карточка не найдена'));
    if (card.owner.toString() !== req.user._id) {
      throw new Error({ message: 'Недостаточно прав' });
    }
    await card.remove();
    return res.send({ data: card });
  } catch (err) {
    if (err.message === 'Карточка не найдена') {
      return res.status(404).send({ message: err.message });
    }
    if (err.message === 'Недостаточно прав') {
      return res.status(403).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => Error('Карточка не найдена'));
    res.send({ data: card });
  } catch (err) {
    if (err.message === 'Карточка не найдена') {
      return res.status(404).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => Error('Карточка не найдена'));
    res.send({ data: card });
  } catch (err) {
    if (err.message === 'Карточка не найдена') {
      return res.status(404).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};
