import type React from "react";
import { Form as ReactAriaForm } from "react-aria-components";

export type FormProps = React.ComponentProps<typeof ReactAriaForm>;
export type FormLabelProps = React.ComponentProps<"label">;

export { Form } from "./Form";
export { FormLabel } from "./FormLabel";
