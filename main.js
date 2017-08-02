const Server = require('./server/Server');
const ServePublicFiles = require('./server/middlewares/ServePublicFiles');
const HandleErrors = require('./server/middlewares/HandleErrors');

const CloudWatchLogs = require('./server/aws/cloudwatch/CloudWatchLogs');
const FindMostRecentStreams = require('./server/aws/cloudwatch/FindMostRecentStreams');
const FindMostRecentLogs  = require('./server/aws/cloudwatch/FindMostRecentLogs');

const DemoController = require('./server/DemoController');



// DI
const cloudWatchLogs = new CloudWatchLogs({region: "eu-west-1"});
const findMostRecentStreams = new FindMostRecentStreams(cloudWatchLogs);
const findMostRecentLogs = new FindMostRecentLogs(findMostRecentStreams, cloudWatchLogs);

const server = new Server([
  new ServePublicFiles(),
  new HandleErrors(),
  new DemoController(cloudWatchLogs, findMostRecentLogs)
]);

server.start();
