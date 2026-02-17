import { linkDefaultArgs } from "../Link/Link.mocks";
import type { NavigationProps } from "./index";
import { NavigationItem } from "./NavigationItem";

export const navigationDefaultArgs = {
  children: (
    <>
      <NavigationItem href={linkDefaultArgs.href}>
        {linkDefaultArgs.children}
      </NavigationItem>
      <NavigationItem href="#entries">Entries</NavigationItem>
    </>
  ),
} satisfies NavigationProps;
