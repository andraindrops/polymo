import { GetServerSidePropsContext, NextApiRequest } from "next";

import { DefaultUser } from "next-auth";
import { getSession } from "next-auth/react";

export const getUser = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  const user = session?.user;

  if (user == null) {
    throw Error("Not found a user.");
  }

  return user;
};

export const requireSignIn = async (context: GetServerSidePropsContext) => {
  const { req } = context;

  const session = await getSession({ req });

  const user = session?.user;

  if (user == null) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return { props: { user } };
};

export const requireSignInWithQueryId = async (
  context: GetServerSidePropsContext
): Promise<
  | {
      props: {
        user: DefaultUser & {
          id: string;
        };
        id: string | string[];
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
> => {
  const { req, query } = context;

  const session = await getSession({ req });

  const user = session?.user;

  if (user == null || query.id == null) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return { props: { user, id: query.id } };
};
