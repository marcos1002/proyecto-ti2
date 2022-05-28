require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const db = require('./helpers/db.helper');
const { PORT } = process.env;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.use('/api', require('./routes'));
app.use('/', express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));