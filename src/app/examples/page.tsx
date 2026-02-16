import * as exampleAction from "@/actions/domain/example";

import ExampleList from "@/components/domain/example/list";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

export default async function Page() {
  const examples = await exampleAction.findMany();

  return (
    <>
      <SubscriptionGuard />
      <ExampleList examples={examples} />
    </>
  );
}

export const dynamic = "force-dynamic";
