const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};


const ConvertId = mongoose.Types.ObjectId;
const setName = (Name) => _.escape(name).trim();

const DomoSchema = new mongoose.Mongoose.Schema({
  name:{
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
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  ConvertId: {
    type: Date,
    default: Date.now,
  }
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: ConvertId(ownerId),
  };
  return DomoModel.find(search).select('name age').lean().exec(callback);
};
DomoModel = mongoose.model('Domo', DomoSchema);


module.exports = {DomoModel, DomoSchema};