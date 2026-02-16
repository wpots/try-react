import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, ToggleButtonGroup, Section, Container } from "@repo/ui";

import { FormButton } from "@/components/FormButton";
import type { DashboardViewMode } from "../index";

interface DashboardToolbarProps {
  canNavigateNext: boolean;
  onGoToToday: () => void;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  onSelectViewMode: (viewMode: DashboardViewMode) => void;
  periodLabel: string;
  translateDashboard: (key: string) => string;
  viewMode: DashboardViewMode;
}

const viewModeLabels: Record<DashboardViewMode, string> = {
  day: "view.day",
  month: "view.month",
  week: "view.week",
};

const viewModes: DashboardViewMode[] = ["day", "week", "month"];

function isDashboardViewMode(value: string): value is DashboardViewMode {
  return value === "day" || value === "week" || value === "month";
}

export function DashboardToolbar({
  canNavigateNext,
  onGoToToday,
  onNavigateNext,
  onNavigatePrevious,
  onSelectViewMode,
  periodLabel,
  translateDashboard,
  viewMode,
}: DashboardToolbarProps): React.JSX.Element {
  const viewModeOptions = viewModes.map(view => ({
    value: view,
    label: translateDashboard(viewModeLabels[view]),
  }));

  return (
    <Section>
      <Container size="wide">
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-ds-s mb-ds-xl">
          <FormButton
            className={cn("!rounded-ds-full text-sm")}
            onClick={onGoToToday}
            type="button"
          >
            {translateDashboard("navigation.today")}
          </FormButton>
          <ToggleButtonGroup
            options={viewModeOptions}
            selectedValue={viewMode}
            onSelectedValueChange={value => {
              if (isDashboardViewMode(value)) {
                onSelectViewMode(value);
              }
            }}
          />
        </div>
        <div className="flex items-center justify-center gap-ds-l">
          <FormButton
            aria-label={translateDashboard("navigation.previous")}
            className={cn(
              "h-9 w-9",
              "hover:border-ds-brand-primary",
              "hover:bg-ds-brand-primary-soft",
            )}
            onClick={onNavigatePrevious}
            type="button"
            variant="iconOnly"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </FormButton>
          <p className="font-ds-label-base text-ds-on-surface">{periodLabel}</p>
          <FormButton
            aria-label={translateDashboard("navigation.next")}
            className={cn(
              "h-9 w-9",
              "hover:border-ds-brand-primary",
              "hover:bg-ds-brand-primary-soft",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
            disabled={!canNavigateNext}
            onClick={onNavigateNext}
            type="button"
            variant="iconOnly"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </FormButton>
        </div>
      </Container>
    </Section>
  );
}
