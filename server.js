'use strict';

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const urlExists = require('url-exists')

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));


const dataSchema = mongoose.Schema({
  original_url: String,
  short_url: Number
});

const Data = mongoose.model('Data', dataSchema);

const lengthSchema = mongoose.Schema({
  length: Number
})

const Length = mongoose.model("Length", lengthSchema)


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  
  const url = req.body.url
  
  Data.find({original_url: url}, (err, urlList) => {
    
    if(urlList.length) {
      res.send({original_url: urlList[0].original_url,
                short_url: urlList[0].short_url
               })
    } else {
      
      urlExists(url, function(err, exists) {
    
      let len;
        if(exists) {
          Length.findOne({}, (err, length) => {
            len = length.length++
            length.save((err) => {
              Data.create({
                original_url: url,
                short_url: len
              }).then((data) => {res.send({
                original_url: data.original_url,
                short_url: data.short_url
              });
                })
            })
          })
      
      } else {
         res.send({"error":"invalid URL"})
      }
      
      })
    }

  })
});


//REDIRECTING

app.get('/api/shorturl/:url', (req, res)=>{
    const shortUrl = req.params.url
    
    Data.findOne({short_url: shortUrl}, (err, foundData) => {
      const originalUrl = foundData.original_url
      res.redirect(originalUrl)
    })

})

app.listen(port, function () {
  console.log('Node.js listening ...');
});