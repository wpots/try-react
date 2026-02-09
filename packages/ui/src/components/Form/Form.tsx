"use client";

import { Form as ReactAriaForm } from "react-aria-components";
import type { FormProps } from "./index";

export function Form(props: FormProps) {
  return <ReactAriaForm {...props} />;
}
