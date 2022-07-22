import { TextResourceProps } from "@/locales/TextResourceProps";

export const ja: TextResourceProps = {
  hello: "こんにちは。",
  addNew: {
    action: "新規作成",
  },
  create: {
    action: "作成",
    succeed: "作成しました。",
  },
  update: {
    action: "更新",
    succeed: "更新しました。",
  },
  delete: {
    action: "削除",
    succeed: "削除しました。",
  },
  form: {
    required: {
      label: "必須",
      error: "入力してください。",
    },
    email: {
      error: "メールアドレスを入力してください。",
    },
    minLength: "[MIN_LENGTH]文字以上で入力してください。",
    maxLength: "[MAX_LENGTH]文字以内で入力してください。",
    min: "[MIN]以上で入力してください。",
    max: "[MAX]以内で入力してください。",
  },
  list: {
    empty: "アイテムはありません。",
  },
  loading: "読み込み中...",
  uploadedFile: "アップロードされたファイル",
  exceptionErrorOccurred: "エラーが発生しました。",
  brands: {
    gitHub: "GitHub",
  },
  page: {
    auth: {
      signIn: {
        title: "サインイン",
      },
    },
    settings: {
      title: "設定",
    },
  },
  part: {
    auth: {
      signIn: {
        title: "サインイン",
        action: "サインイン",
      },
      signOut: {
        title: "サインアウト",
        action: "サインアウト",
      },
    },
    profiles: {
      edit: {
        title: "プロフィール",
      },
    },
  },
};
