export interface PageHeaderRenderContext {
  isScrolled: boolean;
}

export interface PageHeaderProps extends React.ComponentProps<"header"> {
  children?:
    | React.ReactNode
    | ((context: PageHeaderRenderContext) => React.ReactNode);
}

export { PageHeader } from "./PageHeader";
