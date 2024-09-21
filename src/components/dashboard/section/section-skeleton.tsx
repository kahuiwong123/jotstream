import { Skeleton } from "@/components/ui/skeleton";

export const SectionSkeleton = () => {
  return (
    <div className="flex h-4/5 w-full grow gap-8">
      {[1, 2, 3].map((num) => (
        <Skeleton key={num} className="h-full w-72 p-4" />
      ))}
    </div>
  );
};
