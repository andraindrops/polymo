import { FieldError, FieldValues, Path, UseFormReturn } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

import { TextResourceProps } from "@/locales/TextResourceProps";

interface Props<T> {
  t: TextResourceProps;
  form: UseFormReturn<T>;
  name: string;
  type: string;
  label: string;
  required: boolean;
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  min?: number | undefined;
  max?: number | undefined;
}

export const FormInput = <T extends FieldValues = never>(props: Props<T>) => {
  const { t, form, name, type, label, required, valueAsNumber, valueAsDate, minLength, maxLength, min, max } = props;

  const key = name as Path<T>;

  const rules: {
    required?: string;
    validate?: (data: string) => boolean | string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
  } = {};

  if (required) {
    rules.required = t.form.required.error;
  }

  if (type === "email") {
    rules.validate = (data: string) => isEmail(data) || t.form.email.error;
  }

  if (minLength != null) {
    rules.minLength = {
      value: minLength,
      message: t.form.minLength.replace("[MIN_LENGTH]", minLength.toString()),
    };
  }

  if (maxLength != null) {
    rules.maxLength = {
      value: maxLength,
      message: t.form.maxLength.replace("[MAX_LENGTH]", maxLength.toString()),
    };
  }

  if (min != null) {
    rules.min = {
      value: min,
      message: t.form.min.replace("[MIN]", min.toString()),
    };
  }

  if (max != null) {
    rules.max = {
      value: max,
      message: t.form.max.replace("[MAX]", max.toString()),
    };
  }

  const fieldError = form.formState.errors[key] as FieldError;

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input type={type} {...form.register(key, { valueAsNumber, valueAsDate, ...rules })} className={fieldError == null ? "input-bordered input" : "input-bordered input-error input"} />
      {fieldError != null && (
        <label className="label">
          <span className="label-text-alt">{fieldError.message}</span>
        </label>
      )}
    </div>
  );
};

FormInput.defaultProps = {
  valueAsNumber: false,
  valueAsDate: false,
  minLength: undefined,
  maxLength: undefined,
  min: undefined,
  max: undefined,
};
