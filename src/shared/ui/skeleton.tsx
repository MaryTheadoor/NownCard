import { cn } from "@/shared/lib/utils/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border p-6">
          <Skeleton className="mb-4 h-6 w-48" />
          <Skeleton className="mb-2 h-4 w-32" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ViewerSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      <div className="mt-6 space-y-3">
        <Skeleton className="mx-auto h-10 w-48" />
        <Skeleton className="mx-auto h-6 w-64" />
      </div>
    </div>
  );
}
