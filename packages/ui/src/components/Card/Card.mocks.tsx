import { Button } from "../Button";
import { buttonDefaultArgs } from "../Button/Button.mocks";
import type { CardProps } from "./index";
import { CardActions } from "./partials/CardActions";
import { CardHeader } from "./partials/CardHeader";

export const cardDefaultArgs = {
  children: (
    <>
      <CardHeader
        title="Wednesday food diary"
        description="A realistic day at home and work."
      />
      <p className="text-ds-on-surface-secondary">
        Breakfast was yogurt with berries, lunch was a chicken wrap, and
        dinner was vegetable soup with toast.
      </p>
      <CardActions>
        <Button {...buttonDefaultArgs} size="sm" />
      </CardActions>
    </>
  ),
} satisfies CardProps;
