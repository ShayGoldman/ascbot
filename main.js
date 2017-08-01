const Server = require('./server/Server');
const ServePublicFiles = require('./server/middlewares/ServePublicFiles');
const HandleErrors = require('./server/middlewares/HandleErrors');
const DemoController = require('./server/DemoController');

const server = new Server([
  new ServePublicFiles(),
  new HandleErrors(),
  new DemoController()
]);

server.start();
