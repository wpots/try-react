import { Image } from "../Image";
import { cn } from "../../lib/utils";
import type { AvatarProps } from "./index";

export function Avatar({ src, alt = "", className, children, ...props }: AvatarProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ds-surface-muted",
        className,
      )}
      {...props}
    >
      {src ? <Image src={src} alt={alt} aria-hidden={!alt} className="size-full object-cover" /> : children}
    </div>
  );
}
