const moment = require('moment');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const path = require('path');

const title = 'Shotgun';

const shouldPrintDebug = () => {
  if (process.env.SHOTGUN_DEBUG != null) {
    return process.env.SHOTGUN_DEBUG == 'true';
  }
  return false;
}

const sockets = {};
const sequence = {
  value: -1,
  next: () => ++sequence.value
};

const logger = {
  _time: () => moment().format("YYYY-MM-DDTHH-mm-ss.SSSZZ"),
  log: (...arguments) => 
    console.log(logger._time(), '[INFO]' , ...arguments),
  error: (...arguments) => 
    console.error(logger._time(), '[ERROR]', ...arguments),
  debug: (...arguments) =>
    shouldPrintDebug() && console.info(logger._time(), '[DEBUG]', ...arguments)
};

const send = (data) => {
  for (let key in sockets) {
    logger.debug('Streaming', data);
    sockets[key].emit('stream', data);
  }
};

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', function (req, res) {
  logger.debug('Rendering html with title=', title);
  res.render('index', { title });
});

//accepting only text/plain
app.use(bodyParser.text());
app.use((req, res, next) => {
  const contentType = req.get('content-type');
  logger.debug('Received request Content-Type=', contentType, 'body=', req.body);
  if (/text\/plain/i.test(contentType)) {
    logger.debug('Content-Type=', contentType, 'is valid');
    next();
  } else {
    logger.debug('Content-Type=', contentType, 'is invalid');
    res.sendStatus(400);
  }
});

app.post('/api/v1/messages', (req, res) => {
  logger.debug('Received request body=', req.body);
  send(req.body);
  res.sendStatus(200);
  logger.debug('Request OK');
});

io.on('connection', function(socket) {
  // save socket
  const key = sequence.next();
  sockets[key] = socket;

  socket.on('disconnect', function() {
    delete sockets[key];
    logger.debug(`Socket[${key}] disconnected`);
  });

  logger.debug(`Socket[${key}] connected`);

});

const port = process.env.SHOTGUN_PORT || 3000;

server.listen(port, () => logger.log(`Server listening on port ${port}`));
