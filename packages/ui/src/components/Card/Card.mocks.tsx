import { Button } from "../Button";
import { buttonDefaultArgs } from "../Button/Button.mocks";
import type { CardProps } from "./index";
import { CardActions } from "./partials/CardActions";
import { CardHeader } from "./partials/CardHeader";

export const cardDefaultArgs = {
  children: (
    <>
      <CardHeader
        title="Meal summary"
        description="Your daily snapshot."
      />
      <p className="text-ds-on-surface-secondary">Calories: 1840 kcal</p>
      <CardActions>
        <Button {...buttonDefaultArgs} size="sm" />
      </CardActions>
    </>
  ),
} satisfies CardProps;
