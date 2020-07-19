// When npm start is run, npm looks for server.js in the root directory
// unless package.json specifies that npm start should look elsewhere
// and then runs it using Node.js
// Filename: Server.js -- the entry point to Node.js.
// Author: Peter Laudat
// Date: 05/25/20
// Chapter 5 The About API
// Implementing GraphQL
// Started by installing GraphQL and apollo server. Note that I had to use
//      npm install graphql@0 apollo-server-express@2.3 because
//      npm start fails with error if I use apollo-server-express@2

require('dotenv').config();

// Web server that listens on a specific IP address and port.
// Mulitple applications can be created that listen on different ports.
// Express is a framework that does minimal work by itself.
// It does its work via functions called middleware. One of those functions
// is routing. Routers take client requests, match them agains any routes
// that are present, and execute the handler function associated with
// that route. The handler function is expected to generate the appropriate
// response. Route specifications typically consist of an HTTP method (GET, POST, etc.),
// a path specification that matches the request URI, and the route handler.
// The handler is passed in a request object and a response object. The request
// object can be inspected to get the various details of the request, and
// the response object's methods can be used to send the response to the client.
// An example might look like the following:
//   app.get('/hello', (req, res) => {
//     res.send('Hello World!');
//   })

// Express receives the request, then matches the route and calls the associated handler function.
// For more information on Express, see https://expressjs.com/
// For more information on Node.js, see https://nodejs.org/en/

const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');

const auth = require('./auth.js');

// Install an Express application, a
// web server that listens on a specific IP address and port, to
// instantiate the app.

const app = express();

app.use(cookieParser());

app.use('/auth', auth.routes);

installHandler(app);


const port = process.env.API_SERVER_PORT || 3000;

// Since connectToDb() is an async function, we can use await to wait for it to finish,
// then call app.listen().
// However, since await cannot be used in the main section of the program,
// we hav to enclose it within an async function and execute the function immediately.
// Start the server with the given port and callback function and let it serve HTTP requests.
// listen() starts the server and waits eternally for requests.

(async function start() {
  // wrap the await in the async wrapper
  try {
    // use a try block to catch errors
    await connectToDb();
    app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
  } catch (err) {
    // print any errors on the console
    console.log('ERROR:', err);
  }
}());
