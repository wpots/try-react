import { Label, Card } from "@repo/ui";
import type { DashboardMoodSummary } from "../index";
import { Quote } from "@/components/Quote";

interface DashboardHeroProps {
  affirmation: string;
  averageMood: DashboardMoodSummary | null;
  dateLabel: string;
  title: string;
  translateDashboard: (key: string) => string;
}

export function DashboardHero({
  affirmation,
  averageMood,
  dateLabel,
  title,
  translateDashboard,
}: DashboardHeroProps): React.JSX.Element {
  return (
    <section
      className={
        "border-b-1 border-ds-border-subtle " +
        "bg-gradient-to-br from-ds-brand-primary/40 " +
        "via-ds-surface-primary-soft to-ds-surface-muted/20 p-ds-xxl"
      }
    >
      <div className="relative z-10 grid gap-ds-l">
        <div>
          <Label>{dateLabel}</Label>
          <Quote className="py-ds-xl text-left">{affirmation}</Quote>
        </div>

        <div>
          <Label>{translateDashboard("hero.averageMood")}</Label>
          {averageMood ? (
            <Card className="mt-ds-xs font-ds-display-base bg-ds-surface h-12 flex-row">
              <span className="font-openmoji grayscale brightness-110 text-xl" aria-hidden="true">
                {averageMood.emoji}
              </span>
              {averageMood.label}
            </Card>
          ) : (
            <p className="mt-ds-xs font-ds-body-sm">{translateDashboard("hero.noMood")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
