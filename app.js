require('dotenv').config();
const express = require('express');
const session = require('express-session');
const sessionFileStore = require('session-file-store');
const usersMiddleware = require('./middleware/user');
const hbs = require('hbs');
const path = require('path');
const dbConnect = require('./db');

const PORT = process.env.PORT || 3000;
dbConnect();

const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const mealsRouter = require('./routes/meals');
const favouriteRouter = require('./routes/favourites');
const popularRouter = require('./routes/popular');
const isAuth = require('./middleware/user');

const app = express();

app.set('session cookie name', 'sid'); //записывает переменную в настройки
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// настройка для heroku и т.д.
app.set('trust proxy', 1);

const FileStore = sessionFileStore(session); // устанавливаем файловое хранилище для сессии
//Express session
app.use(
  session({
    name: app.get('session cookie name'),
    secret: process.env.SESSION_SECRET,
    store: new FileStore({
      // Шифрование сессии
      secret: process.env.SESSION_SECRET,
    }),
    // Если true, сохраняет сессию, даже если она не поменялась
    resave: false,
    // Если false, куки появляются только при установке req.session
    saveUninitialized: false,
    cookie: {
      // В продакшне нужно "secure: true" для HTTPS
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user.login;
  }
  next();
});

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);
app.use('/meals', mealsRouter);
app.use('/favourites', isAuth, favouriteRouter);
app.use('/popular', popularRouter);

app.listen(PORT, () => {
  console.log('server has started');
});
