export interface HamburgerMenuProps extends React.ComponentProps<"div"> {
  buttonLabel: string;
  panelClassName?: string;
  buttonClassName?: string;
  /** When provided, shown instead of the default hamburger icon (e.g. account icon). */
  triggerContent?: React.ReactNode;
  children: React.ReactNode;
}

export { HamburgerMenu } from "./HamburgerMenu";
