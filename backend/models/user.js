const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (m) => {
        isURL(m);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (m) => {
        isEmail(m);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    minlength: 2,
    maxlength: 60,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
