import { useForm, SubmitHandler } from "react-hook-form";

import { TextResourceProps } from "@/locales/TextResourceProps";

import { Form } from "@/components/ui/form/Form";
import { FormInput } from "@/components/ui/form/FormInput";
import { Stack } from "@/components/ui/layout/Stack";

export type SignInInput = {
  email: string;
};

interface Props {
  t: TextResourceProps;
  signInHandler: SubmitHandler<SignInInput>;
}

export const SignIn = (props: Props) => {
  const { t, signInHandler } = props;

  const form = useForm<SignInInput>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form onSubmit={form.handleSubmit(signInHandler)}>
      <Stack>
        <FormInput t={t} form={form} name="email" type="email" label="email" required />
        <button type="submit" className="btn btn-primary btn-block" disabled={form.formState.isSubmitting}>
          {t.part.auth.signIn.action}
        </button>
      </Stack>
    </Form>
  );
};
