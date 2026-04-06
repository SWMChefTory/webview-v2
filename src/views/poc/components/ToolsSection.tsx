import type { PocTool } from "../types";

const TOOL_EMOJI: Record<string, string> = {
  팬: "🍳",
  숟가락: "🥄",
  "실리콘 주걱": "🪏",
  도마: "🪵",
  칼: "🔪",
  집게: "🥢",
};

interface ToolsSectionProps {
  tools: PocTool[];
}

export function ToolsSection({ tools }: ToolsSectionProps) {
  return (
    <div className="px-4">
      <h2 className="text-lg font-bold text-gray-900">조리 도구</h2>
      <div className="h-2" />
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch]">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[72px] h-[72px] rounded-xl border border-gray-200 bg-gray-50
              flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">{TOOL_EMOJI[tool.name] ?? "🍽️"}</span>
            <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
              {tool.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
