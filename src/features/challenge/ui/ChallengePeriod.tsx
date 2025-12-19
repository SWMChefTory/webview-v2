import { FaCalendarAlt } from "react-icons/fa";
import { formatChallengePeriod, calculateDday } from "../lib/formatDate";

interface ChallengePeriodProps {
  startDate: string;
  endDate: string;
}

export function ChallengePeriod({ startDate, endDate }: ChallengePeriodProps) {
  const dday = calculateDday(endDate);
  const isEnded = dday === "종료";
  const isDday = dday === "D-Day";

  return (
    <div className="mx-4 my-3 px-4 py-3 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt size={14} className="text-gray-400" />
          <span className="font-medium">
            {formatChallengePeriod(startDate, endDate)}
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            isEnded
              ? "bg-gray-200 text-gray-500"
              : isDday
                ? "bg-red-100 text-red-600"
                : "bg-orange-100 text-orange-600"
          }`}
        >
          {dday}
        </span>
      </div>
    </div>
  );
}
