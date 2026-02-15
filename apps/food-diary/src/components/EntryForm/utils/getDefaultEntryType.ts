export function getDefaultEntryType(date: string, time: string): "breakfast" | "lunch" | "dinner" | "moment" {
  const fallback: "breakfast" | "lunch" | "dinner" | "moment" = "moment";

  if (!time) {
    return fallback;
  }

  const [hoursString, minutesString] = time.split(":");
  const hours = Number.parseInt(hoursString ?? "", 10);
  const minutes = Number.parseInt(minutesString ?? "", 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return fallback;
  }

  const totalMinutes = hours * 60 + minutes;

  const breakfastStart = 6 * 60;
  const breakfastEnd = 10 * 60;
  if (totalMinutes >= breakfastStart && totalMinutes <= breakfastEnd) {
    return "breakfast";
  }

  const lunchStart = 11 * 60 + 30;
  const lunchEnd = 14 * 60;
  if (totalMinutes >= lunchStart && totalMinutes <= lunchEnd) {
    return "lunch";
  }

  const dinnerStart = 17 * 60;
  const dinnerEnd = 21 * 60;
  if (totalMinutes >= dinnerStart && totalMinutes <= dinnerEnd) {
    return "dinner";
  }

  return fallback;
}

