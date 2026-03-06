import * as exampleAction from "@/actions/domain/example";

import ExampleList from "@/components/domain/example/list";

export default async function Page() {
  const examples = await exampleAction.findMany();

  return (
    <div className="mx-auto max-w-md px-8">
      <ExampleList examples={examples} />
    </div>
  );
}

export const dynamic = "force-dynamic";
