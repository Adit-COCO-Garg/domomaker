const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};


const ConvertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setImg = (img) => _.escape(img).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  img: {
    type: String,
    trim: true,
    required: true,
    set: setImg,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  img: doc.img
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: ConvertId(ownerId),
  };
  return DomoModel.find(search).select('name age img').lean().exec(callback);
};
DomoModel = mongoose.model('Domo', DomoSchema);


module.exports = { DomoModel, DomoSchema };
