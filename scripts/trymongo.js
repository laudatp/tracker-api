require('dotenv').config();

// import the MongoClient object from the driver
const { MongoClient } = require('mongodb');

// add the local installation url
// the url should start with "mongodb://",
// followed by the hostname or the ip address
// of the server to connect to.
// an optional port can be added using ":" as the separator,
// but it's not required if the MondoDB server
// is running on the default port, 27017.

const url = process.env.MONGODB_URI || 'mongodb://localhost/issuetracker';

// This function is unwieldy callback paradigm
// with repetitive callback code, but it works
// in older JavaScript version (ES5),
// and therefore older versions of Node.js. testWithAsync()
// below uses the modern ES6+ async/await paradigm.
function testWithCallbacks(callback) {
  console.log('\n-- testWithCallbacks ---');
  // create a new client object from the object with the given url
  // that identifes a database to connect to
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // asyncrhonously connect to the database;
  // if error, return err, else result is the client object.
  client.connect((connErr) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    console.log('Connected to MongoDB URL', url);
    // calling the db method of the client object here
    // creates a connection to the database
    // (as opposed to a connection to the server)
    const db = client.db();
    // create a handle on the employees connection
    const collection = db.collection('employees');
    // create a document to be inserted into the collection
    const employee = { id: 1, name: 'A. Callback', age: 23 };
    // insert the newly created document
    collection.insertOne(employee, (insertErr, result) => {
      if (insertErr) {
        client.close();
        callback(insertErr);
        return;
      }
      // display the id of the inserted document via the
      console.log('Result of insert:\n', result.insertedId);
      // find the id read back the inserted document using the id
      collection.find({ _id: result.insertedId }).toArray((findErr, docs) => {
        if (findErr) {
          client.close();
          callback(findErr);
        }
        console.log('Result of find:\n', docs);
      });
      // close the connection to the server; if you don't do this,
      // the Node.js program will not exit because the connection
      // object is waiting to be used and is listening to a socket.
      client.close();
      callback();
    });
  });
}

// testWithAsync() uses the modern ES6+ async/await paradigm
// to do exactly the same work as testWithCallbacks above.
// Note that the code is much more streamlined versus the
// unwieldy callback paradigm with the repetitive testWithCallbacks
// callback code, which works in older JavaScript version (ES5),
// and therefore older versions of Node.js. testWithAsync() below
// uses the modern ES6+ async/await paradigm.
async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('employees');

    const employee = { id: 2, name: 'B.Async', age: 16 };
    const result = await collection.insertOne(employee);
    console.log('Result of insert:\nm', result.insertedId);

    const docs = await collection.find({ _id: result.insertedId }).toArray();
    console.log('Result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
