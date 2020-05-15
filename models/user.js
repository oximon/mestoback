const mongoose = require('mongoose');

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
      validator: (link) => /^(https?:\/\/)?(www\.)?(([\w\-]{2,}\.)+[a-zA-Z]{2,}(:\d{2,5})?(\/[\w\-?=&%+.\/#]+)*[\/#]?|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{2,5})?)((\/[\w\-?=&%+.\/#]+))*$/.test(link),
    },
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
