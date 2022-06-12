require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  url: String,
  shortUrl: Number
});
const Url = mongoose.model('Url', urlSchema);
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  if (!/^(http|https):\/\/[^\s]+.com$/.test(url)) {
    res.json({ error: 'invalid url' });
    return;
  }
  const shortUrl = 1;
  const urlModel = new Url({
    url: url,
    shortUrl: shortUrl
  });
  urlModel.save((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
  res.json({
    original_url: url,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  Url.findOne({ shortUrl: shortUrl }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(data.url);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
