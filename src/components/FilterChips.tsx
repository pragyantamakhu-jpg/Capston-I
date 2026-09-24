"use client";

const filters = [
  { label: "All", value: "all" },
  { label: "Veg", value: "veg" },
  { label: "Non-veg", value: "nonveg" },
] as const;

export type MenuFilter = (typeof filters)[number]["value"];

export default function FilterChips({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: MenuFilter;
  onFilterChange: (filter: MenuFilter) => void;
}) {
  return (
    <div className="my-6 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onFilterChange(filter.value)}
          className={`rounded-full px-3 py-1 text-sm ${
            activeFilter === filter.value
              ? "bg-brand-600 text-white"
              : "border border-neutral-300 text-neutral-600"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
