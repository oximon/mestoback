const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);

router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), deleteCard);

router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), likeCard);

router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), dislikeCard);

module.exports = router;
