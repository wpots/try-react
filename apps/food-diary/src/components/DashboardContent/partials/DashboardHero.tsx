import type { DashboardMoodSummary } from "../index";

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
        "relative overflow-hidden rounded-ds-2xl border border-ds-border-subtle " +
        "bg-gradient-to-br from-ds-brand-primary-soft " +
        "via-ds-surface to-ds-surface-subtle/20 p-ds-xxl"
      }
    >
      <div className="dashboard-hero-float dashboard-hero-orb-a" />
      <div className="dashboard-hero-float-delay dashboard-hero-orb-b" />

      <div className="relative z-10 grid gap-ds-l">
        <div>
          <h1 className="font-ds-heading-sm text-ds-on-surface">{title}</h1>
          <p className="mt-ds-xs font-ds-body-base text-ds-on-surface-secondary">
            {dateLabel}
          </p>
        </div>

        <div>
          <p className="font-ds-label-sm text-ds-on-surface-secondary">
            {translateDashboard("hero.affirmation")}
          </p>
          <p className="mt-ds-xs max-w-2xl font-ds-body-lg text-ds-on-surface">
            {affirmation}
          </p>
        </div>

        <div>
          <p className="font-ds-label-sm text-ds-on-surface-secondary">
            {translateDashboard("hero.averageMood")}
          </p>
          {averageMood ? (
            <p className="mt-ds-xs font-ds-heading-xs text-ds-on-surface">
              <span className="font-openmoji" aria-hidden="true">
                {averageMood.emoji}
              </span>{" "}
              {averageMood.label}
            </p>
          ) : (
            <p className="mt-ds-xs font-ds-body-base text-ds-on-surface-secondary">
              {translateDashboard("hero.noMood")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
