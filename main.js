const ENV = require('dotenv').config();

if (!ENV) throw new Error("No ENV :(");
const {debugOn} = process.env;
const Logger = require('./server/Logger');
const logger = new Logger({debugOn}).register("Env");

if (debugOn) logger.debug("Debug data available");
logger.info("Environment loaded");
logger.info("Loading dependencies");

const Server           = require('./server/Server');
const ServePublicFiles = require('./server/middlewares/ServePublicFiles');
const HandleErrors     = require('./server/middlewares/HandleErrors');

const CloudWatchLogs        = require('./server/aws/cloudwatch/CloudWatchLogs');
const FindMostRecentStreams = require('./server/aws/cloudwatch/FindMostRecentStreams');
const FindMostRecentLogs    = require('./server/aws/cloudwatch/FindMostRecentLogs');

const DemoController = require('./server/DemoController');
const DBClient       = require('./server/db/DBClient');
const TeamKeysDao    = require('./server/teams/TeamKeysDao');

// ENV
const {cloudWatchAccessKey, cloudWatchSecretKey} = process.env;
const {dbHost, dbUser, dbPassword, dbDatabase}   = process.env;

// DI
const dbc                   = new DBClient({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase
}, logger);
const cloudWatchLogs        = new CloudWatchLogs({
  region: "eu-west-1",
  accessKeyId: cloudWatchAccessKey,
  secretAccessKey: cloudWatchSecretKey
});
const findMostRecentStreams = new FindMostRecentStreams(cloudWatchLogs);
const findMostRecentLogs    = new FindMostRecentLogs(findMostRecentStreams, cloudWatchLogs);
const teamKeysDao           = new TeamKeysDao(dbc);

const server = new Server([
  new ServePublicFiles(),
  new DemoController(cloudWatchLogs, findMostRecentLogs, teamKeysDao),
  new HandleErrors(logger),
], logger);

server.start();
