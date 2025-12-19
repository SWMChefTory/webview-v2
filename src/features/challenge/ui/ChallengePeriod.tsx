import { formatChallengePeriod } from "../lib/formatDate";

interface ChallengePeriodProps {
  startDate: string;
  endDate: string;
}

export function ChallengePeriod({ startDate, endDate }: ChallengePeriodProps) {
  return (
    <div className="px-4 py-3 bg-gray-50">
      <p className="text-center text-gray-600 font-medium">
        {formatChallengePeriod(startDate, endDate)}
      </p>
    </div>
  );
}
