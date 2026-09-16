import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { createMetricsPlugin } from './metricsPlugin.js';
import { resolvers } from './schema/resolvers.js';
import { typeDefs } from './schema/typeDefs.js';

export function createApolloServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    includeStacktraceInErrorResponses: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true }), createMetricsPlugin()],
  });
}
