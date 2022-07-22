interface Props {
  children: JSX.Element | JSX.Element[] | string;
  disabled?: boolean;
  onSubmit?: () => void;
}

export const Form = (props: Props) => {
  const { children } = props;

  return <form {...props}>{children}</form>;
};
