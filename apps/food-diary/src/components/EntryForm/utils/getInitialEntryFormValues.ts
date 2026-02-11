export interface EntryFormValues {
  foodEaten: string;
  description: string;
  date: string;
  time: string;
}

export function getInitialEntryFormValues(): EntryFormValues {
  return {
    foodEaten: "",
    description: "",
    date: "",
    time: "",
  };
}
