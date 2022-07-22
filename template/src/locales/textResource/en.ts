import { TextResourceProps } from "@/locales/TextResourceProps";

export const en: TextResourceProps = {
  hello: "Hello.",
  addNew: {
    action: "Add New",
  },
  create: {
    action: "Create",
    succeed: "Succeeded in creating.",
  },
  update: {
    action: "Update",
    succeed: "Succeeded in updating.",
  },
  delete: {
    action: "Delete",
    succeed: "Succeeded in deleting.",
  },
  form: {
    required: {
      label: "required",
      error: "Required.",
    },
    email: {
      error: "Incorrect format entry.",
    },
    minLength: "Please input [MIN_LENGTH] or more characters.",
    maxLength: "Please input [MAX_LENGTH] or less characters.",
    min: "Please input [MIN] or more.",
    max: "Please input [MAX] or more.",
  },
  list: {
    empty: "Not found items.",
  },
  loading: "Loading...",
  uploadedFile: "Uploaded file",
  exceptionErrorOccurred: "Exception error occurred.",
  brands: {
    gitHub: "GitHub",
  },
  page: {
    auth: {
      signIn: {
        title: "Sign In",
      },
    },
    settings: {
      title: "Settings",
    },
  },
  part: {
    auth: {
      signIn: {
        title: "Sign In",
        action: "Sign In",
      },
      signOut: {
        title: "Sign Out",
        action: "Sign Out",
      },
    },
    profiles: {
      edit: {
        title: "Profiles",
      },
    },
  },
};
