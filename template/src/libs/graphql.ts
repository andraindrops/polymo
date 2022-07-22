import { GraphQLClient } from "graphql-request";

import { getSdk } from "@/graphql/generated/client";

if (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT == null) {
  throw Error("Not found GraphQL endpoint.");
}

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
const sdk = getSdk(client);

export const graphql = sdk;
