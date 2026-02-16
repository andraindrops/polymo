// import * as container from "@/lib/container";
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
    data: { ...data, teamId, userId },
  });

  const id = product.id;

  await productStudioService.createProductFiles({ id });

  // const app = await container.appCreate({ appName: `polymo-${id}` });

  // await container.ipAllocate({ appName: app.name });

  // const files = await productStudioService.collectProductFiles(id);

  // const createdContainer = await container.containerCreate({
  //   appName: app.name,
  //   files,
  // });

  // console.log("createdContainer", createdContainer);

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

// export async function deploy({ id, teamId }: { id: string; teamId: string }) {
//   const scope: Scope = { teamId };

//   await productPolicy.assertAccessible({ scope, id });

//   const appName = `polymo-${id}`;

//   const containers = await container.containerFindMany({ appName });

//   if (containers.length === 0) {
//     throw new Error("No container found to update");
//   }

//   const target = containers[0];

//   const files = await productStudioService.collectProductFiles(id);

//   const updatedContainer = await container.containerUpdate({
//     appName,
//     machineId: target.id,
//     files,
//   });

//   console.log("updatedContainer", updatedContainer);

//   await container.containerWaitForState({
//     appName,
//     machineId: updatedContainer.id,
//     instanceId: updatedContainer.instanceId,
//     state: "started",
//   });

//   return updatedContainer;
// }

export async function remove({ id, teamId }: { id: string; teamId: string }) {
  const scope: Scope = { teamId };

  await productPolicy.assertAccessible({ scope, id });

  // const appName = `polymo-${id}`;

  // const containers = await container.containerFindMany({ appName });

  // for (const containerInstance of containers) {
  //   await container.containerEnd({
  //     appName,
  //     instanceId: containerInstance.id,
  //   });

  //   await container.containerWaitForState({
  //     appName,
  //     machineId: containerInstance.id,
  //     instanceId: containerInstance.instanceId,
  //     state: "stopped",
  //   });

  //   await container.containerRemove({
  //     appName,
  //     instanceId: containerInstance.id,
  //   });
  // }

  // await container.appRemove({ appName });

  // await productStudioService.removeProductFiles({ id });

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
