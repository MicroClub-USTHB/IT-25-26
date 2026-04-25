import classnames from "classnames";

export interface LoadingSkeletonProps {
  className?: string;
  /** Number of skeleton rows to render */
  rows?: number;
}

export function LoadingSkeleton({ className, rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className={classnames("flex flex-col gap-3", className)} aria-label="Loading content" role="status">
      <div className="h-6 w-3/5 rounded-md bg-bg-muted animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={classnames(
            "rounded-md bg-bg-muted animate-pulse",
            i % 3 === 0 ? "h-14" : "h-9"
          )}
        />
      ))}
    </div>
  );
}
