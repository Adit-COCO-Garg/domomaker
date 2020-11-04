const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  if (!username || !pass) {
    return res.status(400).json({ error: 'Rawr! All fields are required!' });
  }
  return Account.AccountModel.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'Rawr! All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Rawr! Passwords do not match!' });
  }
  // return Account.AccountModel.generateHash(pass, makeAccount);
  return Account.AccountModel.generateHash(pass, async (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    try {
      await newAccount.save();
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      return res.status(400).json({ error: 'An error occured' });
    }
  });
};

// const makeAccount = async (salt, hash) => {
//   const accountData = {
//     username: req.body.username,
//     salt,
//     password: hash,
//   };
//   const newAccount = new Account.AccountModel(accountData);
//   try {
//     await newAccount.save();
//   } catch (e) {
//     if (e.code === 11000) {
//       return res.status(400).json({ error: 'Username already in use' });
//     }
//     return res.status(400).json({ error: 'An error occured' });
//   }
// };

module.exports = {
  loginPage,
  login,
  logout,
  signupPage,
  signup,
};
