const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .orFail(() => res.status(404).send('Пользователь не найден'));
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.send({ data: user });
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
    const user = await User.findByIdAndUpdate(req.user._id, { name, about })
      .orFail(() => res.status(404).send('Пользователь не найден'));
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка в валидации данных' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar })
      .orFail(() => res.status(404).send('Пользователь не найден'));
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка в валидации данных' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
