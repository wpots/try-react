import { Button } from "../Button";
import { buttonDefaultArgs } from "../Button/Button.mocks";
import { TextField } from "../TextField";
import { textFieldDefaultArgs } from "../TextField/TextField.mocks";
import type { FormProps } from "./index";

export const formDefaultArgs = {
  children: (
    <>
      <TextField {...textFieldDefaultArgs} name="name" />
      <Button {...buttonDefaultArgs} type="submit" />
    </>
  ),
  className: "grid gap-ds-s",
} satisfies FormProps;
