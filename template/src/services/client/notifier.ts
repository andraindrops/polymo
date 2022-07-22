import { toast } from "react-toastify";

import { TextResourceProps } from "@/locales/TextResourceProps";

export const notifyError = ({ t, error }: { t: TextResourceProps; error?: Error }): void => {
  toast.error(t.exceptionErrorOccurred);

  if (error != null) {
    console.error(error);
  }
};
