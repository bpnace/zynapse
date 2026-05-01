export function formatDuration(duration: string): string {
  const seconds = parseInt(duration, 10);

  if (Number.isNaN(seconds)) {
    return duration;
  }

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${sec.toString().padStart(2, "0")}`;
}
