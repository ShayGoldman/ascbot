const Server = require('./server/Server');
const ServePublicFiles = require('./server/middlewares/ServePublicFiles');
const HandleErrors = require('./server/middlewares/HandleErrors');

const CloudWatchLogs = require('./server/aws/CloudWatchLogs');

const DemoController = require('./server/DemoController');

const cloudWatchLogs = new CloudWatchLogs({region: "eu-west-1"});

const server = new Server([
  new ServePublicFiles(),
  new HandleErrors(),
  new DemoController(cloudWatchLogs)
]);

server.start();
