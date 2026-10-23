export function formatDate(date: Date): string {
  const dateStr = date?.toISOString()?.split('T')[0]?.replaceAll('-', '');
  return (dateStr || "");
}

export function getDayFromButton(customId: string): number {
  const split: string[] = customId.split(":");
  const dateStr = split[2] || "";
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return (date.getDay() + 6) % 7;
}

export function getDateFromButton(customId: string): Date {
  const split: string[] = customId.split(":");
  const dateStr = split[2] || "";
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function getButtonId(customId: string): string {
  const split: string[] = customId.split(":");
  if (split[0] && split[1]) {
    return `${split[0]}:${split[1]}`;
  }
  return customId;
}
