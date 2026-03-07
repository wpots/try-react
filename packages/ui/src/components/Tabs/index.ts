import type React from "react";

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  content: React.ReactNode;
  isDisabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  defaultSelectedKey?: T;
  selectedKey?: T;
  onSelectionChange?: (key: T) => void;
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  tabPanelClassName?: string;
}

export { Tabs } from "./Tabs";
