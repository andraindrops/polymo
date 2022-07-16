import { DateTime } from "luxon";

export const DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

export const valueAsString = (t: string | undefined | null): string | null => {
  if (t == null || t === "") {
    return null;
  }

  return t;
};

export const valueAsNumber = (t: number | undefined | null): number | null => {
  if (t == null) {
    return null;
  }

  return t;
};

export const valueAsDate = (t: string | undefined | null): string | null => {
  if (t == null || t === "") {
    return null;
  }

  return DateTime.fromISO(t).toUTC().toLocal().toFormat(DATE_TIME_FORMAT);
};
