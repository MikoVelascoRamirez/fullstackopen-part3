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

  const contact = new Contact({
    name: body.name?.split(' ').filter(c => c !== '').join(' '),
    number: body.number
  })

  contact.save()
    .then(result => res.status(201).json(result))
    .catch(err => next(err))
  
});

app.get("/api/persons", (req, res) => {
  // res.json(dataSrc);
  Contact.find({})
    .then(result => res.json(result))
});

app.get("/info", (req, res, next) => {
  Contact.find({})
    .then(result => {
      res.send(`<p>Phonebook has info for ${result.length} people</p><p>${new Date().toString()}</p>`)
    })
    .catch(err => next(err))
});

app.get("/api/persons/:id", (req, res, next) => {
  const param = req.params.id;
  Contact.findById(param)
    .then(contact => {
      if(!contact){
        const customError = new Error("The contact doesn't exist.");
        customError.name = "ContactNotFound";
        next(customError);
      } else res.send(contact)
    }).catch(err => next(err))
});

app.put("/api/persons/:id", (req, res, next) => {
  const param = req.params.id;
  const bodyToUpdate = req.body;

  Contact.findByIdAndUpdate(param, bodyToUpdate, { 
    new : true,
    runValidators: true,
    context: 'query'
  })
    .then(result => {
      if(!result){
        const customError = new Error("Not able to update, the contact doesn't exist.");
        customError.name = "ContactNotFound";
        next(customError);
      } else res.json(result)
    })
    .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {

  Contact.findByIdAndDelete(req.params.id)
    .then(result => {
      if(!result){
        const customError = new Error("The contact doesn't exist.");
        customError.name = "ContactNotFound";
        next(customError);
      } else res.end();
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
  } else if(err.name === "ValidationError"){
    res.status(404).send({ message: err.message })
  }

  next(err)
}

app.use(unknownEndpoint);
app.use(handlingError);

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
