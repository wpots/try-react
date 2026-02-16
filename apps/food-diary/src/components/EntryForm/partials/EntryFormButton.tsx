import { FormButton } from "@/components/FormButton";

type EntryFormButtonProps = React.ComponentProps<typeof FormButton>;

export function EntryFormButton({
  ...props
}: EntryFormButtonProps): React.JSX.Element {
  return <FormButton {...props} />;
}
