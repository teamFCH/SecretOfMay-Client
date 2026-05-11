export function formatClock(seconds: number, separator = ":") {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}${separator}${String(remainingSeconds).padStart(2, "0")}`;
}

export function formatArchiveDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "기록 없음";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}
