export interface CallToActionProps extends React.ComponentProps<"section"> {
  variant?: "default" | "strong" | "knockout";
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export { CallToAction } from "./CallToAction";
