// require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(() => console.log("connection to db sucessfull"))
  .catch(err => console.log('error connecting to mongo db', err.message));

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(val){
        return /(?<!.)\b(\d{2,3}){1}-(\d+)\b(?!.)/g.test(val);
      }
    },
    required: true
  }
})

contactSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();

    delete returnedObj._id;
    delete returnedObj.__v;
  }
});

module.exports = new mongoose.model('Contact', contactSchema);