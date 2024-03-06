const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const PORT = 3001;

app.use(cors());

app.use(express.json());
app.use(morgan('tiny', {
  skip: function (req, res) { return req.method === 'POST'}
}));

morgan.token('data', function getHeaders(req) {
  return req.data;
})

const postLog = morgan(':method :url :status :res[content-length] - :response-time ms :data');

// Source data
let dataSrc = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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

  const isTheNameExists = dataSrc.some(
    contact => contact.name === formattingName
  )

  if(isTheNameExists){
    return res.status(400).send({ 
      "error" : "The name already exists."
    });
  }

  dataSrc = [...dataSrc, { id: generateNewId(), ...body }]
  
  res.status(201).send(dataSrc[dataSrc.length-1]);
});

app.get("/api/persons", (req, res) => {
  res.json(dataSrc);
});

app.get("/info", (req, res) => {
  const template = `<p>Phonebook has info for ${dataSrc.length} people</p><p>${new Date().toString()}</p>`;
  res.send(template);
});

app.get("/api/persons/:id", (req, res) => {
  const param = Number(req.params.id);
  const contactFound = dataSrc.find(contact => contact.id === param);

  if(!contactFound) 
    return res.status(404).send("The contact has not been found").end();

  res.json(contactFound).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const param = Number(req.params.id);
  const phonebookUpdated = dataSrc.filter(contact => contact.id !== param);

  if(phonebookUpdated.length === dataSrc.length)
    return res.status(404).send("The contact doesn't exist");
  
  dataSrc = phonebookUpdated;

  res.end();
});

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
