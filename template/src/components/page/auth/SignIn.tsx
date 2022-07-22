import { useRouter } from "next/router";

import { signIn } from "next-auth/react";

import { notifyError } from "@/services/client/notifier";

import { Locale } from "@/locales/Locale";

import { Layout } from "@/components/layout/Layout";

import { Stack } from "@/components/ui/layout/Stack";

import { SignIn, SignInInput } from "@/components/part/auth/SignIn";

const Page = (): JSX.Element => {
  const router = useRouter();

  const { t } = new Locale({ locale: router.locale });

  const signInHandler = async (input: SignInInput) => {
    try {
      signIn("email", {
        email: input.email,
      });
    } catch (error) {
      notifyError({ t, error: error as Error });
    }
  };

  return (
    <Layout>
      <Stack>
        <h1 className="text-2xl">{t.page.auth.signIn.title}</h1>
        <SignIn t={t} signInHandler={signInHandler} />
      </Stack>
    </Layout>
  );
};

export default Page;
