"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";

interface ReactAriaProviderProps {
  children: React.ReactNode;
}

export function ReactAriaProvider({ children }: ReactAriaProviderProps): React.JSX.Element {
  const router = useRouter();

  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
