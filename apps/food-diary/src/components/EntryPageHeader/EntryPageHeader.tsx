"use client";

import { Bookmark, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@repo/ui";

import { FormButton } from "@/components/FormButton";
import { useRouter } from "@/i18n/navigation";

import type { EntryPageHeaderProps } from "./index";

export function EntryPageHeader({
  backHref = "/dashboard",
  className,
  id = "entry-page-header",
  isBookmarked = false,
  onBackClick,
  onBookmarkClick,
  ...props
}: EntryPageHeaderProps): React.JSX.Element {
  const router = useRouter();
  const tBrand = useTranslations("common.brand");
  const tNav = useTranslations("nav");
  const tDashboard = useTranslations("dashboard");

  const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    onBackClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    router.push(backHref);
  };

  return (
    <header
      data-component-type="EntryPageHeader"
      id={id}
      className={cn(
        "grid grid-cols-3 items-center border-b",
        "border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m",
        className,
      )}
      {...props}
    >
      <FormButton
        aria-label={tNav("dashboard")}
        onClick={handleBackClick}
        className={cn(
          "h-6 w-6 border-transparent bg-transparent p-0",
          "text-ds-on-surface-secondary hover:border-transparent",
          "hover:bg-ds-surface-muted",
          "hover:text-ds-on-surface",
        )}
        type="button"
        variant="iconOnly"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </FormButton>

      <span className="font-ds-script-base text-ds-on-surface text-center">
        {tBrand("wordmark")}
      </span>

      <FormButton
        type="button"
        aria-label={
          isBookmarked
            ? tDashboard("entry.removeBookmark")
            : tDashboard("entry.addBookmark")
        }
        onClick={onBookmarkClick}
        variant="iconOnly"
        className={cn(
          "h-6 w-6 justify-self-end",
          "hover:border-ds-warning-strong hover:bg-ds-warning/20",
          isBookmarked && "border-ds-warning-strong bg-ds-warning",
          isBookmarked && "text-ds-on-warning",
        )}
      >
        <Bookmark
          className={cn("h-4 w-4", isBookmarked && "fill-current")}
          aria-hidden="true"
        />
      </FormButton>
    </header>
  );
}
