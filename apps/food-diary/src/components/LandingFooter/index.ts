export interface LandingFooterProps extends React.ComponentProps<"footer"> {
  appName?: string;
  quote?: string;
  tagline?: string;
  description?: string;
  copyright?: string;
}

export { LandingFooter } from "./LandingFooter";
