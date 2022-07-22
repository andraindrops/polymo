import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

import { ApolloServer } from "apollo-server-micro";

import { resolvers } from "@/graphql/resolvers";

const schema = path.resolve("./src/graphql/schema.graphql");

const typeDefs = fs.readFileSync(schema, {
  encoding: "utf8",
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  async context(args) {
    return args;
  },
});

const apolloServerStart = apolloServer.start();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  await apolloServerStart;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
