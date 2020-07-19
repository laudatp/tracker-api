// Import file module to allow read in of schema.graphql file below

const fs = require('fs');


// Import ApolloServer module

const { ApolloServer } = require('apollo-server-express');
const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const issue = require('./issue.js');
const auth = require('./auth.js');

// Define handlers or functions that can be called when the fields are accessed.
// These are called resolvers because they resolve a query to a field with real values.
// Although the schema definition was done in the special Schema Language,
// the implementation of the resolvers depends on the programming langauge we use.
// If I were to define the About API set in Python, the schema string would look the
// same as in JavaScript, but the handlers would be different, because Python instead of
// JavaScript. The resolvers can be written in any programming language, in this case,
// JavaScript. In the Apollo server as well as in graphql-tools, resolvers are specified
// as nested objects that follow the the structure of the schema.
// At every leaf level, the field needs to be resolved using a function of the same name
// as the field. Thus, at the topmost level, we'll have two properties named Query and Mutation
// in the resolver.
// All resolver functions are supplied 4 arguments like this: fieldName(obj,args,context,info)
// 1. obj: the object containing the result returned from the resolver on the parent field
// 2. args: an object with the arguments passed into the field in the query.
//          For example, if the field was called with setAboutMessage(message:"New Message")
//          the args object would be {"message": "New Message"}
// 3. context: an object shared by all resolvers in a particular query, used to contain per-request
//             state, including authentication information, dataloader instances, and anything else
//             needed when resolving the query
// 4. info: only used in advanced cases; contains information about the query's execution state
// No such thing as void; have to specify return type,
// but can make it optional with no exclamation point.
// No such thing as void; have to specify return type in the function,
// but can make it optional with no exclamation point.
// Having said the above, it's good practice to return some value to indicate successful
// execution of the field. The return value should be of the type specified in the schema.

const resolvers = {
  Query: {
    about: about.getMessage,
    user: auth.resolveUser,
    issueList: issue.list,
    issue: issue.get,
    issueCounts: issue.counts,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    issueAdd: issue.add,
    issueUpdate: issue.update,
    issueDelete: issue.delete,
    issueRestore: issue.restore,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

// The schema is defined in ./server/schema.graphql, and
// the corresponding resolvers are defined above.
// We initialize the GraphQL server by constructing an ApolloServer,
// which takes in an object with at least 2 properties - typeDefs and resolvers -
// and returns a GraphQL server object:

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});


function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }
  server.applyMiddleware({ app, path: '/graphql', cors });
}

module.exports = { installHandler };
