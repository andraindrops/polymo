interface Props {
  text: string;
}

const Example = (props: Props) => {
  return (
    <p data-testid="text" className="underline">
      {props.text}
    </p>
  );
};

export default Example;
