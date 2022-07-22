export interface TextResourceProps {
  hello: string;
  addNew: {
    action: string;
  };
  create: {
    action: string;
    succeed: string;
  };
  update: {
    action: string;
    succeed: string;
  };
  delete: {
    action: string;
    succeed: string;
  };
  form: {
    required: {
      label: string;
      error: string;
    };
    email: {
      error: string;
    };
    minLength: string;
    maxLength: string;
    min: string;
    max: string;
  };
  list: {
    empty: string;
  };
  loading: string;
  uploadedFile: string;
  exceptionErrorOccurred: string;
  brands: {
    gitHub: string;
  };
  page: {
    auth: {
      signIn: {
        title: string;
      };
    };
    settings: {
      title: string;
    };
  };
  part: {
    auth: {
      signIn: {
        title: string;
        action: string;
      };
      signOut: {
        title: string;
        action: string;
      };
    };
    profiles: {
      edit: {
        title: string;
      };
    };
  };
}
