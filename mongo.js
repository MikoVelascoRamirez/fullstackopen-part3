require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

// Data
const name = process.argv[3];
const number = process.argv[4];

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = new mongoose.model('Contact', contactSchema);

if(process.argv.length > 3){
  const contact = new Contact({ name, number })
  contact.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close();
    })
} else if(process.argv.length === 3){
  Contact.find({})
    .then(result => {
      let output = "phonebook:";
      result.forEach(contact => {
        // console.log(contact)
        output += `\n${contact.name} ${contact.number}`
      });
      console.log(output)
      mongoose.connection.close();
    })
}

