const express = require('express');
const bodyParser = require('body-parser');
const argv = require('optimist')
  .boolean('cors')
  .argv;

const BinRepository = require('./src/BinRepository');

const app = express();
const PORT = argv.p || process.env.PORT || 5000;

const binRepository = new BinRepository();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.post('/bin', (req, res) => {
  return binRepository.generateHash()
    .then((hash) => {
      res.send(hash);
      res.status(200);
    })
    .catch(() => {
      res.send('Error on create bin. Please try again');
      res.status(400);
    })
});

app.post('/bin/:hash', (req, res) => {
  return binRepository.create(req.params.hash, req)
    .then(() => {
      res.status(200);
      res.end();
    })
    .catch(error => {
      res.status(404);
      res.send(error);
    });
});

app.get('/bin/:hash', (req, res) => {
  return binRepository.getByHash(req.params.hash)
    .then((result) => {
      res.status(200);
      res.send(result);
    })
    .catch(error => {
      res.status(404);
      res.send(error);
    });
});

app.get('/bin/', (req, res) => {
  return binRepository.getAll()
    .then((result) => {
      res.status(200);
      res.send(result);
    })
    .catch(error => {
      res.status(404);
      res.send(error);
    });
});

app.delete('/bin/:hash', (req, res) => {
  return binRepository.deleteHash(req.params.hash)
    .then(() => {
      res.status(200);
      res.end();
    })
    .catch(error => {
      res.status(404);
      res.send(error);
    });
});
