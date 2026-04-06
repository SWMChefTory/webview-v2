/**
 * "MM:SS", "MM:SS:FF", "HH:MM:SS", "HH:MM:SS.F" 형태의 시간 문자열을 초 단위 숫자로 변환
 * 영상 길이가 1시간 미만인 경우 "AA:BB:CC" → MM:SS:FF (프레임 무시)로 해석
 */
export function parseTimeToSeconds(time: string): number {
  const parts = time.split(":");
  if (parts.length === 3) {
    const a = parseInt(parts[0], 10);
    const b = parseInt(parts[1], 10);
    const c = parseFloat(parts[2]);

    // 첫 번째 파트가 24 미만이고 세 번째 파트가 60 미만이면
    // HH:MM:SS vs MM:SS:FF 구분이 모호함.
    // 영상 길이 기준: 첫 번째 값이 60 이상이면 확실히 MM:SS:FF 불가 → HH:MM:SS
    // 아니면 합리적 범위로 판단: a < 1이면 HH:MM:SS (0시간대), a >= 1이면 MM:SS:FF
    // 실질적으로 대부분 레시피 영상은 1시간 미만이므로:
    // a가 0이면 HH:MM:SS (00:04:54 → 4분 54초)
    // a가 1 이상이면 MM:SS:FF로 해석 (04:53:00 → 4분 53초)
    if (a === 0) {
      // "00:MM:SS" 형식 → HH:MM:SS
      return a * 3600 + b * 60 + c;
    }
    // MM:SS:FF 형식으로 해석 (프레임은 무시)
    return a * 60 + b;
  }
  const minutes = parseInt(parts[0], 10);
  const seconds = parseFloat(parts[1]);
  return minutes * 60 + seconds;
}

/**
 * unit 문자열을 한글로 표시
 */
export function formatUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    spoons: "큰술",
    spoon: "큰술",
    g: "g",
    ml: "ml",
  };
  return unitMap[unit] ?? unit;
}
