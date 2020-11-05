require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const salt = process.env.saltRounds || 10;

const serializeUser = (user) => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
  };
};

const renderSignUp = (req, res) => {
  res.render('register');
};

const renderSignIn = (req, res) => {
  res.render('login');
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const user = await User.findOne({ email }).lean();
      if (user) {
        const validPass = await bcrypt.compare(password, user.password);
        if (validPass) {
          req.session.user = serializeUser(user);

          res.redirect('/');
        } else {
          res.render('login', { error: 'Incorrect email or password' });
        }
      } else {
        res.render('login', { error: 'Incorrect email or password' });
      }
    } catch (e) {
      console.log(e);
      res.redirect('/entries/signIn');
    }
  } else {
    res.render('login', { error: 'Please fill the form!' });
  }
};

const register = async (req, res) => {
  const { login, email, password } = req.body;

  if (login && email && password) {
    try {
      const hashPass = await bcrypt.hash(password, Number(salt));
      const newUser = await new User({
        login,
        email,
        password: hashPass,
      }).save();

      // req.session.user = serializeUser(newUser); // IF I WANT TO LOGIN AFTER REGISTER
      res.redirect('/');
    } catch (e) {
      console.log(e);
      res.render('register', {
        error: 'Something went wrong. Please try again!',
      });
    }
  } else {
    res.render('register', { error: 'Please fill the form!' });
  }
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw new Error(err);
    res.clearCookie(req.app.get('session cookie name'));
    req.app.locals.userName = undefined;
    return res.redirect('/');
  });
};

module.exports = {
  renderSignUp,
  register,
  renderSignIn,
  login,
  logout,
};
