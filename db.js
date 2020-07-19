require('dotenv').config();
// Setting up to change the List API to read from the MongoDB database
// instead of from the in-memory array of issues in the server by commenting
// out the const {Kind} = ... statement above and adding these:
const { MongoClient } = require('mongodb');

let db;

// Connect to the database
async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

// Increment the current field
// (this is guaranteed to return a unique value that is next in the sequence)
// Note that the option for returning the current or new value is called differently
// in Node.js vs the mongo shell. The mongo command is returnNewDocument
// (default is false) and the Node.js driver command is returnOriginal (default is true).
// The default behavior in both cases is to return the original,
// so the option must be specified to return the new document.
async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    {
      _id: name,
    },
    {
      $inc: {
        current: 1,
      },
    },
    {
      returnOriginal: false,
    },
  );
  return result.value.current;
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getNextSequence, getDb };
