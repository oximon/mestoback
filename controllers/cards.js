/* eslint-disable consistent-return */
const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({})
      .populate('owner');
    res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id)
      .orFail(() => new NotFoundError('Карточка не найдена'));
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав');
    }
    await card.remove();
    return res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка не найдена'));
    res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка не найдена'));
    res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};
