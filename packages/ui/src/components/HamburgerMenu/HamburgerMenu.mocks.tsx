import { Navigation } from "../Navigation";
import { navigationDefaultArgs } from "../Navigation/Navigation.mocks";
import type { HamburgerMenuProps } from "./index";

export const hamburgerMenuDefaultArgs = {
  buttonLabel: "Open navigation menu",
  children: <Navigation {...navigationDefaultArgs} />,
} satisfies HamburgerMenuProps;
