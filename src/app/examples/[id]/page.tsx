import * as exampleAction from "@/actions/domain/example";

import ExampleForm from "@/components/domain/example/form";

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
      <ExampleForm example={example} />
    </div>
  );
}

export const dynamic = "force-dynamic";
