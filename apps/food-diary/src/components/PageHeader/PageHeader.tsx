"use client";

import { cn } from "@repo/ui";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { BookmarkToggleButton } from "@/components/BookmarkToggleButton";
import { FormButton } from "@/components/FormButton";
import { useRouter } from "@/i18n/navigation";

import type { PageHeaderProps } from "./index";

export function PageHeader({
  backHref = "/dashboard",
  backAriaLabel,
  className,
  id = "page-header",
  isBookmarked = false,
  onBackClick,
  onBookmarkClick,
  showBookmarkButton = true,
  ...props
}: PageHeaderProps): React.JSX.Element {
  const router = useRouter();
  const tBrand = useTranslations("common.brand");
  const tNav = useTranslations("nav");
  const tDashboard = useTranslations("dashboard");
  const resolvedBackAriaLabel = backAriaLabel ?? tNav("dashboard");

  const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    onBackClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    router.push(backHref);
  };

  return (
    <header
      data-component-type="PageHeader"
      id={id}
      className={cn(
        "grid grid-cols-3 items-center border-b",
        "border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m",
        className,
      )}
      {...props}
    >
      <FormButton
        aria-label={resolvedBackAriaLabel}
        onClick={handleBackClick}
        className={cn(
          "h-8 w-8 border-transparent bg-transparent p-0",
          "text-ds-on-surface-secondary hover:border-transparent",
          "hover:bg-ds-surface-muted",
          "hover:text-ds-on-surface",
        )}
        type="button"
        iconOnly
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </FormButton>

      <span className="font-ds-script-base text-ds-on-surface text-center">{tBrand("wordmark")}</span>

      {showBookmarkButton ? (
        <BookmarkToggleButton
          addBookmarkLabel={tDashboard("entry.addBookmark")}
          className="h-8 w-8 justify-self-end"
          isBookmarked={isBookmarked}
          onToggle={onBookmarkClick}
          removeBookmarkLabel={tDashboard("entry.removeBookmark")}
        />
      ) : (
        <span aria-hidden="true" className="h-8 w-8 justify-self-end" />
      )}
    </header>
  );
}
