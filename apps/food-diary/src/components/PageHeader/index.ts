export interface PageHeaderProps extends React.ComponentProps<"header"> {
  children?: React.ReactNode;
}

export { PageHeader } from "./PageHeader";
export { usePageHeaderScroll } from "./PageHeaderScrollContext";
export type { PageHeaderScrollContextValue } from "./PageHeaderScrollContext";
