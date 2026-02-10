type TimerCommandType = "SET" | "STOP" | "START" | "CHECK";

export type BasicIntent =
  | "NEXT"
  | "PREV"
  | `TIMESTAMP ${number}`
  | `STEP ${number}`
  | "VIDEO PLAY"
  | "VIDEO STOP"
  | `TIMER ${TimerCommandType} ${number}`
  | `INGREDIENT ${string}`
  | "EXTRA";

export function parseIntent(raw: string | undefined): BasicIntent {
  const key = (raw ?? "").trim().toUpperCase();
  console.log("[parseIntent] input:", raw, "→ key:", key);

  if (key === "NEXT") return "NEXT";
  if (key === "PREV") return "PREV";
  if (key === "VIDEO PLAY") return "VIDEO PLAY";
  if (key === "VIDEO STOP") return "VIDEO STOP";
  if (/^TIMESTAMP\s+\d+(\.\d+)?$/.test(key)) return key as BasicIntent;
  if (/^STEP\s+\d+$/.test(key)) return key as BasicIntent;

  const timerCmd = "(SET|START|STOP|CHECK)";
  if (new RegExp(`^TIMER\\s+${timerCmd}(?:\\s+\\d+)?$`).test(key)) {
    return key as BasicIntent;
  }

  if (/^INGREDIENT\s+.+$/.test(key)) {
    return key as BasicIntent;
  }

  console.log("[parseIntent] no match, returning EXTRA");
  return "EXTRA";
}
