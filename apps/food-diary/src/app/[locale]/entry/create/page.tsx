import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import type { EntryFormMode } from "@/components/EntryForm";
import { CreateEntryTemplate } from "@/templates/CreateEntryTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("addEntry")} — ${tCommon("brand.tagline")}`,
  };
}

interface CreateEntryPageSearchParams {
  mode?: string | string[];
  from?: string | string[];
  entryId?: string | string[];
}

interface CreateEntryPageProps {
  searchParams: Promise<CreateEntryPageSearchParams>;
}

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function CreateEntryPage({ searchParams }: CreateEntryPageProps): Promise<React.JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const modeParam = getSingleParam(resolvedSearchParams.mode);
  const fromParam = getSingleParam(resolvedSearchParams.from);
  const entryIdParam = getSingleParam(resolvedSearchParams.entryId);

  const initialMode: EntryFormMode =
    modeParam === "chat" || modeParam === "form"
      ? modeParam
      : fromParam === "dashboard" && Boolean(entryIdParam)
        ? "form"
        : "chat";

  return <CreateEntryTemplate entryId={entryIdParam} initialMode={initialMode} />;
}
