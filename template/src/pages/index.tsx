import { Layout } from "@/components/layout/Layout";

import { Stack } from "@/components/ui/layout/Stack";

const Page = (): JSX.Element => {
  return (
    <Layout>
      <Stack className="py-32">
        <img src="/index/kv.svg" alt="kv" className="mx-auto max-h-60" />
        <h1 className="mt-8 text-6xl font-bold">Example</h1>
        <Stack className="mt-8">
          <h2 className="text-2xl">
            Hi, This is your web app.
            <br />
            Enjoy dev day!
          </h2>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Page;
