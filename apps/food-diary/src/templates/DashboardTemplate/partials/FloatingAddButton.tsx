import { cn } from "@repo/ui";
import { Plus } from "lucide-react";

import { Link } from "@/i18n/navigation";

interface FloatingAddButtonProps {
  ariaLabel: string;
}

export function FloatingAddButton({
  ariaLabel,
}: FloatingAddButtonProps): React.JSX.Element {
  return (
    <Link
      aria-label={ariaLabel}
      className={cn(
        "dashboard-fab fixed bottom-8 right-8",
        "inline-flex h-14 w-14 items-center justify-center rounded-ds-full",
        "bg-ds-brand-primary text-ds-on-primary shadow-ds-lg",
        "transition duration-200 hover:-translate-y-1 hover:scale-105",
        "hover:bg-ds-brand-primary-strong",
        "sm:h-16 sm:w-16",
      )}
      href="/entry/create"
    >
      <Plus aria-hidden="true" className="dashboard-fab-icon" />
    </Link>
  );
}
