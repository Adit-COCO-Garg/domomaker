const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};


const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ domos: docs });
  });
};

const delDomo = (req, res) => {
  if (!req.body.id) {
    return res.status(400)({ error: 'Something went wrong, try refreshing' });
  }
  Domo.DomoModel.deleteOne({ _id: req.body.id }).then(() => res.status(200).json({ Success: 'Domo deleted!' }));
  return true;
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.img) {
    return res.status(400)({ error: 'Rawr! name, age, img are required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    img: req.body.img,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();
  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return domoPromise;
};
module.exports = {
  makerPage, makeDomo, getDomos, delDomo,
};
