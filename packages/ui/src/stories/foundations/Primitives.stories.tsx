import type { Meta, StoryObj } from "@storybook/react";

import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Select,
  Switch,
  TextArea,
  TextField,
} from "../../index";

const mealTypeOptions = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

function handleSelectedKeyChange(): void {
  // Storybook static showcase callback.
}

function PrimitiveShowcase() {
  return (
    <div className="min-h-screen bg-ds-surface-soft p-ds-xxl">
      <div className="mx-auto grid w-full max-w-5xl gap-ds-l">
        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">Actions</h2>
          <p className="font-ds-body-sm text-ds-on-surface-secondary">
            Base action primitives with shared variants and sizes.
          </p>
          <div className="mt-ds-s flex flex-wrap items-center gap-ds-s">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link" size="link">
              Link action
            </Button>
          </div>
        </section>

        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">Inputs</h2>
          <p className="font-ds-body-sm text-ds-on-surface-secondary">
            Text, textarea, and select primitives used across forms.
          </p>
          <div className="mt-ds-s grid gap-ds-s md:grid-cols-2">
            <TextField
              label="Entry title"
              placeholder="What did you eat?"
              defaultValue="Chicken salad and soup"
            />
            <Select
              label="Meal type"
              placeholder="Choose a meal"
              options={mealTypeOptions}
              selectedKey="lunch"
              onSelectedKeyChange={handleSelectedKeyChange}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Notes"
                defaultValue="Felt calm and energized after lunch."
              />
            </div>
          </div>
        </section>

        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">
            Selection and Layout
          </h2>
          <p className="font-ds-body-sm text-ds-on-surface-secondary">
            Feedback and composition primitives for higher-order components.
          </p>

          <div className="mt-ds-s flex flex-wrap items-center gap-ds-xl">
            <Switch defaultSelected>Receive daily check-ins</Switch>
            <Switch>Share weekly summary</Switch>
          </div>

          <div className="mt-ds-l">
            <Card variant="default">
              <CardHeader
                title="Mindful lunch entry"
                description="Composed from Card, CardHeader, and CardActions."
              />
              <p className="font-ds-body-base text-ds-on-surface-secondary">
                Salmon bowl with greens and rice. Noted lower stress after
                taking a short walk before eating.
              </p>
              <CardActions align="end">
                <Button size="sm" variant="secondary">
                  Review details
                </Button>
              </CardActions>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Primitives",
  tags: ["autodocs", "a11y"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => <PrimitiveShowcase />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
