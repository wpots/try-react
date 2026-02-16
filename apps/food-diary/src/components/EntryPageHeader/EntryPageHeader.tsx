"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@repo/ui";

import { Link } from "@/i18n/navigation";

import type { EntryPageHeaderProps } from "./index";

export function EntryPageHeader({
  backHref = "/dashboard",
  className,
  id = "entry-page-header",
  onBackClick,
  ...props
}: EntryPageHeaderProps): React.JSX.Element {
  const tBrand = useTranslations("common.brand");
  const tNav = useTranslations("nav");

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

      <span aria-hidden="true" className="h-6 w-6 justify-self-end" />
    </header>
  );
}
