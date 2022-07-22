import { TextResourceProps } from "@/locales/TextResourceProps";
import { en } from "@/locales/textResource/en";
import { ja } from "@/locales/textResource/ja";

export class Locale {
  t: TextResourceProps;

  constructor({ locale }: { locale: string | undefined }) {
    let t: TextResourceProps;

    switch (locale) {
      case "en":
        t = en;
        break;
      case "ja":
        t = ja;
        break;
      default:
        t = en;
        break;
    }

    this.t = t;
  }
}
