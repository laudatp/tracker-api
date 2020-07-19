const { mustBeSignedIn } = require('./auth.js');
// using let because aboutMessage should be able to change
let aboutMessage = 'Issue Tracker API v1.0';

// Since we're not using any properties of parent object (Query),
// we can ignore the first argument, obj, and use only the property within args.

function setMessage(_, { message }) {
  aboutMessage = message;
  return message;
}


function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setMessage: mustBeSignedIn(setMessage) };
