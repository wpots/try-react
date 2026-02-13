/** Desktop sticky phone frame for feature preview. */
export function DesktopPhoneFrame({
  children,
}: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-ds-2xl border-2 border-ds-border bg-ds-surface-elevated shadow-ds-lg">
      <div className="flex items-center justify-center bg-ds-surface py-ds-s">
        <div className="h-1.5 w-16 rounded-ds-full bg-ds-on-surface-secondary/15" />
      </div>
      <div className="relative h-[380px] overflow-hidden bg-ds-surface px-ds-m py-ds-m">
        {children}
      </div>
      <div className="flex items-center justify-center bg-ds-surface pb-ds-s pt-ds-xs">
        <div className="h-1 w-24 rounded-ds-full bg-ds-on-surface-secondary/10" />
      </div>
    </div>
  );
}

/** Mobile-only inline phone frame for feature preview. */
export function MobilePhoneFrame({
  children,
}: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-ds-2xl border-2 border-ds-border bg-ds-surface-elevated shadow-ds-md">
      <div className="flex items-center justify-center bg-ds-surface py-ds-s">
        <div className="h-1 w-12 rounded-ds-full bg-ds-on-surface-secondary/15" />
      </div>
      <div className="relative h-[280px] overflow-hidden bg-ds-surface px-ds-m py-ds-s">
        {children}
      </div>
      <div className="flex items-center justify-center bg-ds-surface pb-ds-s pt-ds-xs">
        <div className="h-0.5 w-16 rounded-ds-full bg-ds-on-surface-secondary/10" />
      </div>
    </div>
  );
}
