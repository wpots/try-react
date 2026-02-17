import { formLabelDefaultArgs } from "../Form/FormLabel.mocks";
import type { TextFieldProps } from "./index";

const textFieldLabel =
  typeof formLabelDefaultArgs.children === "string"
    ? formLabelDefaultArgs.children
    : "Field label";

export const textFieldDefaultArgs = {
  label: textFieldLabel,
  placeholder: "e.g. Chicken salad",
  defaultValue: "Lunch",
} satisfies TextFieldProps;
