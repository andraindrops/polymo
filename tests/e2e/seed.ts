import db from "@/lib/db";

import { fixedTeamId, fixedUserId } from "@/services/shared/auth";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestExample } from "@/tests/_helpers/fixtures/example";

export async function main() {
  await cleanupDatabase();

  await createTestExample(
    { id: fixedTeamId, teamId: fixedTeamId, userId: fixedUserId },
    { name: "Test Example" },
  );
}

export async function disconnectDB() {
  await db.$disconnect();
}

if (require.main === module) {
  main()
    .then(async () => {
      await db.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    });
}
