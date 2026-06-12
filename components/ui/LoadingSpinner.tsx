import { cn } from "@/utils/helpers";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-primary-200 border-t-primary-600", sizes[size], className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3" aria-label="AI is typing">
      <div className="typing-dot h-2 w-2 rounded-full bg-primary-400" />
      <div className="typing-dot h-2 w-2 rounded-full bg-primary-400" />
      <div className="typing-dot h-2 w-2 rounded-full bg-primary-400" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
