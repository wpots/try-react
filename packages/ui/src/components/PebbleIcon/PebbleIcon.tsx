import { PEBBLE_PATH, PEBBLE_VIEWBOX } from "../../assets/pebblePath";
import type { PebbleIconProps } from "./index";

export function PebbleIcon({ fill = "currentColor", className, ...rest }: PebbleIconProps): React.JSX.Element {
  return (
    <svg
      viewBox={PEBBLE_VIEWBOX}
      fill="none"
      className={className}
      aria-hidden
      {...rest}
    >
      <path d={PEBBLE_PATH} fill={fill} fillRule="evenodd" />
    </svg>
  );
}
