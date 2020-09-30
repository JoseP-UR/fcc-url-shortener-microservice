'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const urlModel = require('./models/url')
const bodyParser = require('body-parser')
const dns = require('dns')

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
// mongoose.connect(process.env.DB_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 

app.post('/api/shorturl/new', function(req, res) {
  const { url } = req.body
  const checkAvailable = require('./utils/checkAvailable')
  dns.lookup(url.replace(/(http)*(s)*(\:\/\/)/,''), function(err, val) {
    if (err) {
      console.error(err)
      res.json({ success: false, message: 'Invalid Url' })
      return
    }
    let result = {
      original_url: url,
      short_url: Math.floor(Math.random() * 9999)
    }
    
    while(!checkAvailable(result.short_url)) {
      result.shortUrl = Math.floor(Math.random() * 9999)
    }

    const newUrl = new urlModel(result)
    newUrl.save((err, data) => {
      if (err) {
      console.error(err)
      res.json({ success: false, message: 'db error' })
      return
      }
      res.json(result)
    })
  })
  return
})

app.get('/api/shorturl/:url', function(req, res) {
  const {url} = req.params
  urlModel.findOne({ short_url: parseInt(url) }).exec((err, data) => {
      if (err) {
        console.error(err)
        res.json(err)
        return
      }
      if (data) {
        res.redirect(`http://${data.original_url}`)
      }
    })
}) 

app.listen(port, function() {

  console.log('Node.js listening ...');
});