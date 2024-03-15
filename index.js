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
const generateNewId = () => {
  let idGenerated;
  while(true){
    idGenerated = Math.round(
      Math.random() * (1000 - dataSrc.length) + dataSrc.length
    );
    const findIfIdContactExists = dataSrc.some(
      contact => contact.id === idGenerated
    );
    if(!findIfIdContactExists) break;
  }

  return idGenerated;
}

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

app.delete("/api/persons/:id", (req, res) => {
  const param = Number(req.params.id);
  const phonebookUpdated = dataSrc.filter(contact => contact.id !== param);

const handlingError = (err, req, res, next) => {
  console.log(err.name);
  console.log(err.message);

  if(err.name === 'ContactNotFound'){
    res.status(404).send({ message: err.message })
  }
  
  next(err);
}

app.use(handlingError);

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
