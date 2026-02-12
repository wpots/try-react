interface ProgressDotsProps {
  total: number;
  currentIndex: number;
}

export function ProgressDots({
  total,
  currentIndex,
}: ProgressDotsProps): React.JSX.Element {
  return (
    <div
      className="flex items-center gap-ds-xs"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              isPast
                ? "w-1.5 bg-ds-primary"
                : isCurrent
                  ? "w-4 bg-ds-primary"
                  : "w-1.5 bg-ds-border-subtle",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

