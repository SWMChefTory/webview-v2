function formatTimeKorean(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}시간`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}분`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}초`);
  }

  return parts.join(" ");
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${minutes}:${remainingSeconds}`;
  }
  return `${minutes}:${remainingSeconds}`;
}

export { formatTimeKorean, formatTime };
