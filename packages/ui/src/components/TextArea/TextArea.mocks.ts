import { formLabelDefaultArgs } from "../Form/FormLabel.mocks";
import type { TextAreaProps } from "./index";

export const textAreaDefaultArgs = {
  label: formLabelDefaultArgs.children,
  defaultValue: "Tasted great.",
} satisfies TextAreaProps;
