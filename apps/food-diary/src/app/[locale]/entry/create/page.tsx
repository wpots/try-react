import { CreateEntryTemplate } from "@/templates/CreateEntryTemplate";
import type { EntryFormMode } from "@/components/EntryForm";

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

export default async function CreateEntryPage({
  searchParams,
}: CreateEntryPageProps): Promise<React.JSX.Element> {
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

  return <CreateEntryTemplate initialMode={initialMode} />;
}
