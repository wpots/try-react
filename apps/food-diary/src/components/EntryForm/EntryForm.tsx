"use client";

import { useTranslations } from "next-intl";
import { Button, Card, Form, Text, TextField } from "@repo/ui";
import { useEntryForm } from "./useEntryForm";

function EntryForm(): React.JSX.Element {
  const t = useTranslations("createEntry");
  const { formValues, isSaving, onFieldChange, onSubmit, saveState } =
    useEntryForm();

  return (
    <Card>
      <Form className="mt-4 flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          id="foodEaten"
          label={t("fields.foodEaten")}
          name="foodEaten"
          onChange={(value) => onFieldChange("foodEaten", value)}
          required
          value={formValues.foodEaten}
        />
        <TextField
          id="description"
          label={t("fields.description")}
          name="description"
          onChange={(value) => onFieldChange("description", value)}
          value={formValues.description}
        />
        <TextField
          id="date"
          label={t("fields.date")}
          name="date"
          onChange={(value) => onFieldChange("date", value)}
          type="date"
          value={formValues.date}
        />
        <TextField
          id="time"
          label={t("fields.time")}
          onChange={(value) => onFieldChange("time", value)}
          type="time"
          value={formValues.time}
        />
        <Button className="mt-2 w-full" disabled={isSaving} type="submit">
          {isSaving ? t("saving") : t("saveEntry")}
        </Button>
        {saveState.error ? <Text tone="danger">{saveState.error}</Text> : null}
        {saveState.success ? <Text>{t("saveSuccess")}</Text> : null}
      </Form>
    </Card>
  );
}

export default EntryForm;
