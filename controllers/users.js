/* eslint-disable max-len */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    return res.send({ data: user });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .orFail(() => Error('Пользователь не найден'));
    return res.send({ data: user });
  } catch (err) {
    if (err.message === 'Пользователь не найден') {
      return res.status(404).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка в валидации данных' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
      .orFail(() => Error('Пользователь не найден'));
    return res.send({ data: user });
  } catch (err) {
    if (err.message === 'Пользователь не найден') {
      return res.status(404).send({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка в валидации данных' });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
      .orFail(() => Error('Пользователь не найден'));
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка в валидации данных' });
    }
    if (err.message === 'Пользователь не найден') {
      res.status(404).send({ message: err.message });
    }
    res.status(500).send({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    }).json({ token });
  } catch (err) {
    res.status(401).send({ message: 'Неправильные логин или пароль' });
  }
};
