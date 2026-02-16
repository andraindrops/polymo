import db from "@/lib/db";

import type * as exampleSchema from "@/schemas/domain/example";

import * as examplePolicy from "@/policies/domain/example";

import type { Scope } from "@/services/shared/scope";

export async function findMany({ teamId }: { teamId: string }) {
  const examples = await db.example.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });

  return examples.map((example) => fromDb({ data: example }));
}

export async function findById({ id, teamId }: { id: string; teamId: string }) {
  const example = await db.example.findUniqueOrThrow({
    where: { id, teamId },
  });

  return fromDb({ data: example });
}

export async function create({
  teamId,
  userId,
  data,
}: {
  teamId: string;
  userId: string;
  data: exampleSchema.createSchema;
}) {
  const example = await db.example.create({
    data: { ...data, teamId, userId },
  });

  return fromDb({ data: example });
}

export async function update({
  id,
  teamId,
  data,
}: {
  id: string;
  teamId: string;
  data: exampleSchema.updateSchema;
}) {
  const scope: Scope = { teamId };

  await examplePolicy.assertAccessible({ scope, id });

  const example = await db.example.update({
    where: { id, teamId },
    data,
  });

  return fromDb({ data: example });
}

export async function remove({ id, teamId }: { id: string; teamId: string }) {
  const scope: Scope = { teamId };

  await examplePolicy.assertAccessible({ scope, id });

  const example = await db.example.delete({
    where: { id, teamId },
  });

  return fromDb({ data: example });
}

export function fromDb({
  data,
}: {
  data: {
    id: string;
    name: string;
  };
}) {
  return data;
}
