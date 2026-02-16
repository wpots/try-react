"use client";

import { ChevronLeft } from "lucide-react";
import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@repo/ui";

import { Link } from "@/i18n/navigation";

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
  const tBrand = useTranslations("common.brand");
  const tNav = useTranslations("nav");
  const tDashboard = useTranslations("dashboard");

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
      <Link
        href={backHref}
        aria-label={tNav("dashboard")}
        onClick={onBackClick}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-ds-full",
          "text-ds-on-surface-secondary transition-colors",
          "hover:text-ds-on-surface",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
        )}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </Link>

      <span className="font-ds-script-base text-ds-on-surface text-center">
        {tBrand("wordmark")}
      </span>

      <button
        type="button"
        aria-label={
          isBookmarked
            ? tDashboard("entry.removeBookmark")
            : tDashboard("entry.addBookmark")
        }
        onClick={onBookmarkClick}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center justify-self-end",
          "rounded-ds-full border border-ds-border-subtle",
          "text-ds-on-surface-secondary transition-colors",
          "hover:border-ds-warning-strong hover:bg-ds-warning/20",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          isBookmarked && "border-ds-warning-strong bg-ds-warning",
          isBookmarked && "text-ds-on-warning",
        )}
      >
        <Bookmark
          className={cn("h-4 w-4", isBookmarked && "fill-current")}
          aria-hidden="true"
        />
      </button>
    </header>
  );
}
