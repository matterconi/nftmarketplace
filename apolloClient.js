// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:8000/subgraphs/name/NFTSTORIES_GRAPH',
  cache: new InMemoryCache(),
});

export default client;
