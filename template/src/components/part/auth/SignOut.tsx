import { TextResourceProps } from "@/locales/TextResourceProps";

interface Props {
  t: TextResourceProps;
  signOutHandler: () => void;
}

export const SignOut = (props: Props) => {
  const { t, signOutHandler } = props;

  return (
    <button
      type="submit"
      className="btn btn-secondary btn-block"
      onClick={() => {
        signOutHandler();
      }}
    >
      {t.part.auth.signOut.action}
    </button>
  );
};
