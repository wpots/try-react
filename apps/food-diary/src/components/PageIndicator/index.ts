export interface PageIndicatorProps extends React.ComponentProps<"div"> {
  /** Total number of pages/dots */
  count: number;
  /** Zero-based index of the active page */
  activeIndex: number;
}

export { PageIndicator } from "./PageIndicator.tsx";
