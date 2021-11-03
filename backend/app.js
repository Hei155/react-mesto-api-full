const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const cors = require('cors');
const login = require('./controllers/login');
const registration = require('./controllers/registration');
const auth = require('./middlewares/auth');
const helper = require('./helper/helper');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
const corsOptions = {
  origin: 'http://mesto.project.nomoredomains.work',
  optionsSuccessStatus: 204,
  preflightContinue: false,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'origin'],
};

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('*', cors(corsOptions));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .email(),
    password: Joi.string().required().min(2).max(60),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .email(),
    password: Joi.string().required().min(2).max(60),
  }),
}), registration);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res, next) => {
  next(new Error('Маршрут не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(helper);

app.listen(PORT, () => {
  console.log('Запущен');
});
