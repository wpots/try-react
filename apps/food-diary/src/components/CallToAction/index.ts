export interface CallToActionProps extends React.ComponentProps<"section"> {
  variant?: "default" | "strong" | "knockout";
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

export { CallToAction } from "./CallToAction";
