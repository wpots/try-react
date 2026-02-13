export interface CallToActionProps extends React.ComponentProps<"section"> {
  variant?: "default" | "knockout";
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  eyebrow?: React.ReactNode;
}

export { CallToAction } from "./CallToAction";
