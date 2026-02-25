import { auth } from "@clerk/nextjs/server";

export async function getTeamId() {
  const { userId } = await auth();

  if (userId == null) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function getUserId() {
  const { userId } = await auth();

  if (userId == null) {
    throw new Error("Unauthorized");
  }

  return userId;
}
