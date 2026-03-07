"use client";

import { Tab, TabList, TabPanel, Tabs as AriaTabs } from "react-aria-components";

import { cn } from "../../lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultSelectedKey?: string;
  className?: string;
}

export function Tabs({ tabs, defaultSelectedKey, className }: TabsProps): React.JSX.Element {
  return (
    <AriaTabs defaultSelectedKey={defaultSelectedKey ?? tabs[0]?.id} className={cn("grid gap-ds-m", className)}>
      <TabList className="flex border-b border-ds-border" aria-label="Dialog sections">
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            id={tab.id}
            className={({ isSelected }) =>
              cn(
                "cursor-pointer px-ds-s py-ds-xs font-ds-label-sm text-ds-on-surface-secondary outline-none",
                "border-b-2 -mb-px transition-colors",
                "hover:text-ds-on-surface focus-visible:text-ds-on-surface",
                isSelected
                  ? "border-ds-on-surface text-ds-on-surface"
                  : "border-transparent hover:border-ds-border",
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map(tab => (
        <TabPanel key={tab.id} id={tab.id} className="outline-none">
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
