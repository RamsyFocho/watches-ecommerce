import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin text-primary"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="text-muted-foreground font-headline">Loading Celestial Gems...</p>
      </div>
    </div>
  );
}
