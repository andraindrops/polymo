"use server";

import { revalidatePath } from "next/cache";

import type * as productSchema from "@/schemas/domain/product";

import * as authService from "@/services/shared/auth";

import * as productService from "@/services/domain/product";

export async function findMany() {
  const teamId = await authService.getTeamId();

  const result = await productService.findMany({ teamId });

  return result;
}

export async function findById({ id }: { id: string }) {
  const teamId = await authService.getTeamId();

  const result = await productService.findById({ id, teamId });

  return result;
}

export async function create({ data }: { data: productSchema.createSchema }) {
  const teamId = await authService.getTeamId();
  const userId = await authService.getUserId();

  const result = await productService.create({ data, teamId, userId });

  revalidatePath("/products");

  return result;
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: productSchema.updateSchema;
}) {
  const teamId = await authService.getTeamId();

  const result = await productService.update({ id, data, teamId });

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);

  return result;
}

export async function remove({ id }: { id: string }) {
  const teamId = await authService.getTeamId();

  const result = await productService.remove({ id, teamId });

  revalidatePath("/products");

  return result;
}
