require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const Contact = require('./Models/Contact');

const PORT = process.env.PORT;

app.use(express.static('dist'));

app.use(cors());

app.use(express.json());
app.use(morgan('tiny', {
  skip: function (req, res) { return req.method === 'POST'}
}));

morgan.token('data', function getHeaders(req) {
  return req.data;
})

const postLog = morgan(':method :url :status :res[content-length] - :response-time ms :data');

// Functions

function assignContentType(req, res, next) {
  req.data = JSON.stringify(req.body);
  next();
}

// Endpoints

app.post("/api/persons", assignContentType, postLog, (req, res, next) => {
  let body = req.body;

  if(!body.name || !body.number){
    return res.status(400).send({ 
      "error" : "Contact info missing"
    });
  }

  const formattingName = body.name.split(' ').filter(c => c !== '').join(' ');

  body.name = formattingName;

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(result => res.status(201).json(result))
  
});

app.get("/api/persons", (req, res) => {
  // res.json(dataSrc);
  Contact.find({})
    .then(result => res.json(result))
});

app.get("/info", (req, res) => {
  const template = `<p>Phonebook has info for ${dataSrc.length} people</p><p>${new Date().toString()}</p>`;
  res.send(template);
});

app.get("/api/persons/:id", (req, res) => {
  const param = Number(req.params.id);
  Contact.findById(param)
    .then(contact => {
      res.json(contact)
    })

  if(!contactFound) 
    return res.status(404).send("The contact has not been found").end();

  res.json(contactFound).end();
});

app.delete("/api/persons/:id", (req, res, next) => {

  Contact.findByIdAndDelete(req.params.id)
    .then(result => {
      if(!result){
        const customError = new Error("The contact doesn't exist.");
        customError.name = "ContactNotFound";
        next(customError);
      }
      res.status(204).end();
    }).catch(err => next(err))
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ message: "unknown url" })
}

const handlingError = (err, req, res, next) => {
  console.log(err.name);
  console.log(err.message);

  if(err.name === 'ContactNotFound'){
    res.status(404).send({ message: err.message })
  }
  
  next(err);
}

app.use(unknownEndpoint);
app.use(handlingError);

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
