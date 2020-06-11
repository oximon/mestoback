const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AutorizationError = require('../errors/AutorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Неправильные формат ссылки',
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неправильные формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});


// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AutorizationError({ message: 'Неправильные почта или пароль' }));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AutorizationError({ message: 'Неправильные почта или пароль' }));
          }

          return user;
        });
    });
};


module.exports = mongoose.model('user', userSchema);
