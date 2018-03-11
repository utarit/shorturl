'use strict';

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const validUrl = require('valid-url')

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }))


const dataSchema = mongoose.Schema({
  original_url: String,
  short_url: Number
});

const Data = mongoose.model('Data', dataSchema);


  


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  console.log(req.body);
   
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});