"use client";

import { Button, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { fetchCustomAffirmations, saveCustomAffirmations } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";

const MAX_AFFIRMATIONS = 20;
const MAX_CHAR_LENGTH = 280;

interface AffirmationsTabProps {
  isGuest: boolean;
}

export function AffirmationsTab({ isGuest }: AffirmationsTabProps): React.JSX.Element {
  const tProfile = useTranslations("dashboard.profile.affirmations");
  const tGuest = useTranslations("dashboard.guestMode.affirmations");
  const { user } = useAuth();

  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  // Start with isLoading=true for registered users (will load on mount)
  const [isLoading, setIsLoading] = useState(!isGuest);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isGuest || !user) return;

    let isMounted = true;

    user
      .getIdToken()
      .then(idToken => fetchCustomAffirmations(idToken))
      .then(result => {
        if (!isMounted) return;
        if (result.success && result.affirmations) {
          setAffirmations(result.affirmations);
        }
      })
      .catch(() => {
        // silently ignore fetch errors
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isGuest, user]);

  const persistAffirmations = useCallback(
    async (next: string[]): Promise<void> => {
      if (!user) return;
      setSaveState("saving");
      try {
        const idToken = await user.getIdToken();
        const result = await saveCustomAffirmations(idToken, next);
        if (result.success) {
          setSaveState("saved");
          if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
          savedTimerRef.current = setTimeout(() => setSaveState("idle"), 2000);
        } else {
          setSaveState("error");
        }
      } catch {
        setSaveState("error");
      }
    },
    [user],
  );

  const handleAdd = (): void => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CHAR_LENGTH) {
      setValidationError(tProfile("tooLong", { max: MAX_CHAR_LENGTH }));
      return;
    }
    if (affirmations.includes(trimmed)) {
      setValidationError(tProfile("duplicate"));
      return;
    }
    if (affirmations.length >= MAX_AFFIRMATIONS) {
      setValidationError(tProfile("limit", { max: MAX_AFFIRMATIONS }));
      return;
    }
    setValidationError(null);
    const next = [...affirmations, trimmed];
    setAffirmations(next);
    setInputValue("");
    void persistAffirmations(next);
  };

  const handleRemove = (index: number): void => {
    const next = affirmations.filter((_, i) => i !== index);
    setAffirmations(next);
    void persistAffirmations(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  if (isGuest) {
    return (
      <div className="grid gap-ds-s rounded-ds-sm border border-ds-border bg-ds-surface-muted p-ds-s">
        <Typography variant="body" className="font-ds-label-sm text-ds-on-surface">
          {tGuest("lockedTitle")}
        </Typography>
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tGuest("lockedBody")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid gap-ds-m">
      <div className="grid gap-ds-xs">
        <Typography variant="body" className="font-ds-label-sm text-ds-on-surface">
          {tProfile("title")}
        </Typography>
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tProfile("description")}
        </Typography>
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tProfile("limit", { max: MAX_AFFIRMATIONS })}
        </Typography>
      </div>

      <div className="flex gap-ds-xs">
        <input
          aria-label={tProfile("placeholder")}
          className="min-w-0 flex-1 rounded-ds-sm border border-ds-border bg-ds-surface px-ds-s py-ds-xxs font-ds-body-sm text-ds-on-surface outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring"
          disabled={affirmations.length >= MAX_AFFIRMATIONS || saveState === "saving"}
          maxLength={MAX_CHAR_LENGTH}
          onChange={e => {
            setInputValue(e.target.value);
            setValidationError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={tProfile("placeholder")}
          type="text"
          value={inputValue}
        />
        <Button
          disabled={!inputValue.trim() || affirmations.length >= MAX_AFFIRMATIONS || saveState === "saving"}
          onClick={handleAdd}
          size="sm"
          type="button"
          variant="secondary"
        >
          {tProfile("add")}
        </Button>
      </div>

      {validationError ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {validationError}
        </Typography>
      ) : null}

      {saveState === "saving" ? (
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tProfile("saving")}
        </Typography>
      ) : saveState === "saved" ? (
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tProfile("saved")}
        </Typography>
      ) : saveState === "error" ? (
        <Typography variant="body" className="font-ds-body-sm text-danger">
          {tProfile("saveError")}
        </Typography>
      ) : null}

      {isLoading ? (
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tProfile("loading")}
        </Typography>
      ) : affirmations.length === 0 ? (
        <Typography variant="body" className="font-ds-body-sm text-ds-on-surface-secondary">
          {tProfile("empty")}
        </Typography>
      ) : (
        <ul className="grid gap-ds-xs">
          {affirmations.map((affirmation, index) => (
            <li
              key={affirmation}
              className="flex items-center justify-between gap-ds-xs rounded-ds-sm border border-ds-border bg-ds-surface-muted px-ds-s py-ds-xxs"
            >
              <Typography variant="body" className="font-ds-body-sm text-ds-on-surface">
                {affirmation}
              </Typography>
              <Button
                aria-label={tProfile("remove")}
                disabled={saveState === "saving"}
                onClick={() => handleRemove(index)}
                size="sm"
                type="button"
                variant="outline"
              >
                {tProfile("remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
