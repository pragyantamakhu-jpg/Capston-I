export default function MenuItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 py-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-neutral-200" />
        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-3 w-16 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
