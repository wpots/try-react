"use client";

import { Button, TextArea, TextField, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { fetchUserContext, saveUserContext } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";

type SaveState = "idle" | "saving" | "saved" | "error";

interface ContextValues {
  company: string;
  location: string;
  behaviour: string;
}

interface ContextTabProps {
  isGuest: boolean;
}

export function ContextTab({ isGuest }: ContextTabProps): React.JSX.Element {
  const t = useTranslations("dashboard.profile");
  const { user } = useAuth();

  const [values, setValues] = useState<ContextValues>({
    company: "",
    location: "",
    behaviour: "",
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [validationErrors, setValidationErrors] = useState<Partial<ContextValues>>({});

  useEffect(() => {
    if (isGuest || !user) return;

    let cancelled = false;

    user.getIdToken().then(idToken => {
      return fetchUserContext(idToken);
    }).then(result => {
      if (cancelled || !result.success || !result.context) return;
      setValues({
        company: result.context.company ?? "",
        location: result.context.location ?? "",
        behaviour: result.context.behaviour ?? "",
      });
    }).catch(() => {
      // Initial load failure is non-critical; the form simply starts empty
    });

    return () => {
      cancelled = true;
    };
  }, [user, isGuest]);

  const validate = (): boolean => {
    const errors: Partial<ContextValues> = {};
    if (values.company.length > 100) {
      errors.company = t("context.tooLong", { field: t("context.company.label"), max: 100 });
    }
    if (values.location.length > 100) {
      errors.location = t("context.tooLong", { field: t("context.location.label"), max: 100 });
    }
    if (values.behaviour.length > 280) {
      errors.behaviour = t("context.tooLong", { field: t("context.behaviour.label"), max: 280 });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!user || !validate()) return;

    setSaveState("saving");
    try {
      const idToken = await user.getIdToken();
      const result = await saveUserContext(idToken, {
        company: values.company,
        location: values.location,
        behaviour: values.behaviour,
      });

      if (!result.success) {
        setSaveState("error");
        return;
      }

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  };

  const handleSaveClick = (): void => {
    void handleSave();
  };

  if (isGuest) {
    return (
      <div className="grid gap-ds-s rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-m text-center">
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {t("context.guestPrompt")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid gap-ds-m">
      <div>
        <Typography variant="body" className="font-ds-label-sm text-ds-on-surface">
          {t("context.title")}
        </Typography>
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {t("context.description")}
        </Typography>
      </div>

      <div className="grid gap-ds-s">
        <TextField
          label={t("context.company.label")}
          placeholder={t("context.company.placeholder")}
          value={values.company}
          maxLength={100}
          errorMessage={validationErrors.company}
          onChange={val => {
            setValues(prev => ({ ...prev, company: val }));
            if (validationErrors.company) {
              setValidationErrors(prev => ({ ...prev, company: undefined }));
            }
          }}
        />

        <TextField
          label={t("context.location.label")}
          placeholder={t("context.location.placeholder")}
          value={values.location}
          maxLength={100}
          errorMessage={validationErrors.location}
          onChange={val => {
            setValues(prev => ({ ...prev, location: val }));
            if (validationErrors.location) {
              setValidationErrors(prev => ({ ...prev, location: undefined }));
            }
          }}
        />

        <TextArea
          label={t("context.behaviour.label")}
          placeholder={t("context.behaviour.placeholder")}
          value={values.behaviour}
          maxLength={280}
          errorMessage={validationErrors.behaviour}
          onChange={val => {
            setValues(prev => ({ ...prev, behaviour: val }));
            if (validationErrors.behaviour) {
              setValidationErrors(prev => ({ ...prev, behaviour: undefined }));
            }
          }}
        />
      </div>

      {saveState === "error" ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {t("context.saveError")}
        </Typography>
      ) : null}

      <Button
        className="w-full"
        disabled={saveState === "saving"}
        onClick={handleSaveClick}
        type="button"
        variant={saveState === "saved" ? "secondary" : "default"}
      >
        {saveState === "saving"
          ? t("context.saving")
          : saveState === "saved"
            ? t("context.saved")
            : t("context.save")}
      </Button>
    </div>
  );
}
