export interface USPItem {
  id: string;
  iconSrc: string;
  title: string;
  description: string;
}

export interface USPSectionProps extends React.ComponentProps<"section"> {
  items: USPItem[];
}

export { USPSection } from "./USPSection";
