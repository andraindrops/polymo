import { useForm, SubmitHandler } from "react-hook-form";

import { ProfileInput } from "@/graphql/generated/resolvers";

import { TextResourceProps } from "@/locales/TextResourceProps";

import { Form } from "@/components/ui/form/Form";
import { FormInput } from "@/components/ui/form/FormInput";
import { Stack } from "@/components/ui/layout/Stack";

interface Props {
  t: TextResourceProps;
  item: ProfileInput;
  updateHandler: SubmitHandler<ProfileInput>;
}

export const Edit = (props: Props) => {
  const { t, item, updateHandler } = props;

  const form = useForm<ProfileInput>({
    defaultValues: {
      name: item.name,
      image: item.image,
    },
  });

  return (
    <Form onSubmit={form.handleSubmit(updateHandler)}>
      <Stack>
        <FormInput t={t} form={form} name="name" type="text" label="name" required />
        <FormInput t={t} form={form} name="image" type="text" label="image" required={false} />
        <button type="submit" className="btn btn-primary btn-block" disabled={form.formState.isSubmitting}>
          {t.update.action}
        </button>
      </Stack>
    </Form>
  );
};
