const express = require('express');
const favicon = require('express-favicon');
const compression = require('compression')
const path = require('path');
let bodyParser = require('body-parser');
let fs = require('fs');
const port = process.env.PORT || 8080;
const app = express();
app.use(compression())
app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(function (request, response, nextCall) {
  if (request.secure) {
    nextCall();
  } else {
    response.redirect('https://' + request.headers.host + request.url);
  }
})
app.get('/ping', function (req, res) {
  return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/initData',
  (req, res) => {
    let menuPath = path.join(__dirname, 'build/server', 'initData.json');
    let menuPathFile = fs.readFileSync(menuPath);
    res.setHeader('Content-Type', 'application/json');
    res.write(menuPathFile)
    res.end()
  })

app.listen(port);