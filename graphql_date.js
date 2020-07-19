// Import graphql module
const { GraphQLScalarType } = require('graphql');

// Import graphql language module for adding issues
const { Kind } = require('graphql/language');

// Initialize GraphQLDate. serialize.ISOString() converts date values
// to ISO8601 string and returns string.

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value);
      return Number.isNaN(value.getTime()) ? undefined : value;
    }
    return undefined;
  },
});

module.exports = GraphQLDate;
