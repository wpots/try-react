export interface ContainerProps extends React.ComponentProps<"div"> {
  size?: "narrow" | "default" | "wide" | "full";
  noPadding?: boolean;
  as?: React.ElementType;
}

export { Container } from "./Container";
