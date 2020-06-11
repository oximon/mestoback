/* eslint-disable max-len */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const AutorizationError = require('../errors/AutorizationError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
      .orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send({ data: user });
  } catch (err) {
    return next(new BadRequestError('Ошибка в валидации данных'));
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
      .orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send({ data: user });
  } catch (err) {
    return next(new BadRequestError('Ошибка в валидации данных'));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    }).json({ token });
  } catch (err) {
    return next(new AutorizationError('Неправильные почта или пароль'));
  }
};
