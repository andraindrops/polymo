import * as exampleAction from "@/actions/domain/example";

import ExampleForm from "@/components/domain/example/form";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const example = await exampleAction.findById({
    id,
  });

  return (
    <div className="mx-auto max-w-md px-8">
      <SubscriptionGuard />
      <ExampleForm example={example} />
    </div>
  );
}

export const dynamic = "force-dynamic";
