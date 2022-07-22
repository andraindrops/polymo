import { Resolvers } from "@/graphql/generated/resolvers";
// eslint-disable-next-line import/order
import { getProfile, updateProfile } from "@/graphql/resolvers/profiles";

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {},
};

if (resolvers.Query == null || resolvers.Mutation == null) {
  throw Error("Can not found resolvers");
}

resolvers.Query.getProfile = async (_parent, args, _context) => {
  const data = getProfile(_context.req);
  return data;
};

resolvers.Mutation.updateProfile = async (_parent, args, _context) => {
  const data = await updateProfile(_context.req, args);
  return data;
};
