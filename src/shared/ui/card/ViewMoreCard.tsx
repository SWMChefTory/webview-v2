import Link from "next/link";

interface ViewMoreCardProps {
  href: string;
  label?: string;
}

export function ViewMoreCard({ href, label = "See All" }: ViewMoreCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all group aspect-[3/4]"
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
        <svg
          className="w-6 h-6 text-gray-400 group-hover:text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
      <span className="font-bold text-gray-500 group-hover:text-orange-600">
        {label}
      </span>
    </Link>
  );
}
