const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { configureRoutes } = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

configureRoutes(app);

app.listen(3001, () => console.log('app listening on port 3001'));