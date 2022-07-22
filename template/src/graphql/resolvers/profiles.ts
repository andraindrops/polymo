import { NextApiRequest } from "next";

import { MutationUpdateProfileArgs, RequireFields } from "@/graphql/generated/resolvers";

import { db } from "@/libs/db";

import { valueAsString } from "@/utils/form";

import { getUser } from "@/services/server/auth";

export const getProfile = async (req: NextApiRequest) => {
  const user = await getUser(req);

  const data = await db.user.findUnique({ where: { id: user.id } });

  if (data == null) {
    throw Error("Cound not find data.");
  }

  const res = {
    id: data.id,
    name: data.name,
    image: data.image,
  };

  return res;
};

export const updateProfile = async (req: NextApiRequest, args: RequireFields<MutationUpdateProfileArgs, "input">) => {
  const user = await getUser(req);

  const data = await db.user.update({
    where: { id: user.id },
    data: {
      name: valueAsString(args.input.name),
      image: valueAsString(args.input.image),
    },
  });

  if (data == null) {
    throw Error("Cound not find data.");
  }

  const res = {
    id: data.id,
    name: data.name,
    avatar_url: data.image,
  };

  return res;
};
