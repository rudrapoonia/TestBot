const Application = require("./lib/app");
const Server = require("./lib/server");
const sdk = require("./lib/sdk");
const config = require("./config");
const translateBot = require('./translateBot');  // Import the Translate Bot

// Create application and server instances
const app = new Application(null, config);
const server = new Server(config, app);

// Ensure node version compatibility
sdk.checkNodeVersion();

// Start the server
server.start();

// Register the bot with Kore.ai
sdk.registerBot(translateBot);
