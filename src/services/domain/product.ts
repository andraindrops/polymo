import db from "@/lib/db";

import type * as productSchema from "@/schemas/domain/product";

import * as productPolicy from "@/policies/domain/product";

import type { Scope } from "@/services/shared/scope";

import * as productStudioService from "@/services/domain/product/studio";

export async function findMany({ teamId }: { teamId: string }) {
  const products = await db.product.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => fromDb({ data: product }));
}

export async function findById({ id, teamId }: { id: string; teamId: string }) {
  const product = await db.product.findUniqueOrThrow({
    where: { id, teamId },
  });

  return fromDb({ data: product });
}

export async function create({
  teamId,
  userId,
  data,
}: {
  teamId: string;
  userId: string;
  data: productSchema.createSchema;
}) {
  const product = await db.product.create({
    data: { ...data, body: "", spec: "", teamId, userId },
  });

  await productStudioService.createProductFiles({ id: product.id });

  return fromDb({ data: product });
}

export async function update({
  id,
  teamId,
  data,
}: {
  id: string;
  teamId: string;
  data: productSchema.updateSchema;
}) {
  const scope: Scope = { teamId };

  await productPolicy.assertAccessible({ scope, id });

  const product = await db.product.update({
    where: { id, teamId },
    data,
  });

  return fromDb({ data: product });
}

export async function remove({ id, teamId }: { id: string; teamId: string }) {
  const scope: Scope = { teamId };

  await productPolicy.assertAccessible({ scope, id });

  const product = await db.product.delete({
    where: { id, teamId },
  });

  return fromDb({ data: product });
}

export function fromDb({
  data,
}: {
  data: {
    id: string;
    name: string;
    body: string;
    spec: string;
  };
}) {
  return data;
}
