import db from "@/lib/db";

import {
  AccessDeniedError,
  type Scope,
  type TransactionClient,
} from "@/services/shared/scope";

export async function assertAccessible({
  scope,
  id,
  tx = db as TransactionClient,
}: {
  scope: Scope;
  id: string;
  tx?: TransactionClient;
}): Promise<void> {
  const example = await tx.example.findFirst({
    where: {
      id,
      teamId: scope.teamId,
    },
    select: { id: true },
  });

  if (example == null) {
    throw new AccessDeniedError();
  }
}
