import { FaCalendarAlt } from "react-icons/fa";
import {
  formatChallengePeriod,
  getChallengeStatus,
  getStatusBadgeText,
} from "../lib/formatDate";

interface ChallengePeriodProps {
  startDate: string;
  endDate: string;
}

export function ChallengePeriod({ startDate, endDate }: ChallengePeriodProps) {
  const status = getChallengeStatus(startDate, endDate);
  const badgeText = getStatusBadgeText(startDate, endDate);

  // 뱃지 스타일 결정
  const getBadgeStyle = () => {
    switch (status) {
      case "BEFORE":
        // 시작 전: 파란색 계열 (기대감)
        return "bg-blue-100 text-blue-600";
      case "ONGOING":
        // 진행 중: 주황색 계열
        return "bg-orange-100 text-orange-600";
      case "ENDED":
        // 종료: 회색
        return "bg-gray-200 text-gray-500";
    }
  };

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
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${getBadgeStyle()}`}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
}
