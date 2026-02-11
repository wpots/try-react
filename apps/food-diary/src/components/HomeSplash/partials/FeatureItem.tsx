interface FeatureItemProps {
  icon: string;
  text: string;
}

export function FeatureItem({
  icon,
  text,
}: FeatureItemProps): React.JSX.Element {
  return (
    <li className="flex items-start gap-3 border-t border-ds-border/35 px-4 py-3 text-xs leading-5 text-ds-text-strong">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ds-text-strong/10 text-xs font-semibold text-ds-text-strong/55"
      >
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}
