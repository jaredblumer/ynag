const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require(path.resolve( __dirname, './config.js' ) );

const mongoose = require('mongoose');
let mongoURL = 'mongodb://' + config.db.dbuser + ':' + config.db.dbpassword + '@ds263927.mlab.com:63927/ynag';
mongoose.connect(mongoURL);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback) {
  console.log('Connection Succeeded');
});

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
  res.send(
    [{
      title: 'Hello World',
      description: 'Hi, there.'
    }]
  );
});

app.listen(process.env.PORT || 8081);
