export interface AnimatedPageHeaderProps extends React.ComponentProps<"header"> {
  children?: React.ReactNode;
}

export { AnimatedPageHeader } from "./AnimatedPageHeader";
export { usePageHeaderScroll } from "./PageHeaderScrollContext";
export type { PageHeaderScrollContextValue } from "./PageHeaderScrollContext";
