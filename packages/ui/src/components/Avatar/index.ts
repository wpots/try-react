import type React from "react";

export interface AvatarProps extends React.ComponentProps<"div"> {
  /** Image URL. When absent, children are shown as fallback. */
  src?: string | null;
  /** Alt text for the image. Use empty string for decorative. */
  alt?: string;
}

export { Avatar } from "./Avatar";
