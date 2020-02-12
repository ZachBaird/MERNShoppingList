// When we use Mongoose, we need to have a model. We build this model by bringin in mongoose.Schema and using that Schema class to create our own schema. See module.exports for more..

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Here we export "Item" which is the result of calling .model with our ItemSchema. We gave it a name of 'item'
module.exports = Item = mongoose.model('item', ItemSchema);