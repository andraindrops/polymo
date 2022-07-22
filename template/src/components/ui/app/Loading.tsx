import { TextResourceProps } from "@/locales/TextResourceProps";

interface Props {
  t: TextResourceProps;
}

export const Loading = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = props;

  return <p>{t.loading}</p>;
};
