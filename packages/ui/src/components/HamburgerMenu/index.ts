export interface HamburgerMenuProps extends React.ComponentProps<"div"> {
  buttonLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  panelClassName?: string;
  buttonClassName?: string;
  children: React.ReactNode;
}

export { HamburgerMenu } from "./HamburgerMenu";
