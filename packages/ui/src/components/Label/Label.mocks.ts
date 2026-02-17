import { typographyDefaultArgs } from "../Typography/Typography.mocks";
import type { LabelProps } from "./index";

export const labelDefaultArgs = {
  children: typographyDefaultArgs.children,
  variant: "default",
} satisfies LabelProps;
