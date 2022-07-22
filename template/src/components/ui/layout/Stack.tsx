import classNames from "classnames";

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  testid?: string;
}

export const Stack = (props: Props & React.HTMLAttributes<HTMLDivElement>) => {
  const { children, testid } = props;

  return (
    <div className={classNames("grid grid-cols-1 gap-4", props.className)} data-testid={testid}>
      {children}
    </div>
  );
};
