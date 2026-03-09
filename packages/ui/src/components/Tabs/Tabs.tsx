"use client";

import { Tab, TabList, TabPanel, Tabs as AriaTabs } from "react-aria-components";

import type { TabsProps } from "./index";
import { cn } from "../../lib/utils";

export function Tabs<T extends string = string>({
  items,
  defaultSelectedKey,
  selectedKey,
  onSelectionChange,
  orientation = "horizontal",
  "aria-label": ariaLabel,
  className,
  tabListClassName,
  tabClassName,
  tabPanelClassName,
}: TabsProps<T>): React.JSX.Element {
  return (
    <AriaTabs
      defaultSelectedKey={defaultSelectedKey}
      selectedKey={selectedKey}
      onSelectionChange={key => onSelectionChange?.(key as T)}
      orientation={orientation}
      className={cn("flex flex-col gap-0", orientation === "vertical" && "flex-row", className)}
    >
      <TabList
        aria-label={ariaLabel}
        className={cn(
          "flex gap-0 border-b border-ds-border",
          orientation === "vertical" && "flex-col border-b-0 border-r",
          tabListClassName,
        )}
      >
        {items.map(item => (
          <Tab
            key={item.id}
            id={item.id}
            isDisabled={item.isDisabled}
            className={({ isSelected, isFocusVisible }) =>
              cn(
                "cursor-pointer px-ds-m py-ds-s font-ds-label-sm text-ds-on-surface-secondary outline-none",
                "border-b-2 border-transparent transition-colors",
                "-mb-px",
                isSelected && "border-ds-brand-primary text-ds-on-surface",
                !isSelected && "hover:text-ds-on-surface hover:border-ds-border-subtle",
                isFocusVisible && "ring-2 ring-ds-focus-ring ring-offset-2",
                item.isDisabled && "cursor-not-allowed opacity-50",
                orientation === "vertical" && "border-b-0 border-r-2 -mr-px",
                tabClassName,
              )
            }
          >
            {item.label}
          </Tab>
        ))}
      </TabList>

      {items.map(item => (
        <TabPanel
          key={item.id}
          id={item.id}
          className={cn("outline-none pt-ds-m", tabPanelClassName)}
        >
          {item.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
