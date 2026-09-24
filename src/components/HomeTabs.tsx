"use client";

export type HomeTab = "All restaurants" | "Favorites";

const tabs: HomeTab[] = ["All restaurants", "Favorites"];

type HomeTabsProps = {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
};

export default function HomeTabs({ activeTab, onTabChange }: HomeTabsProps) {
  return (
    <div className="mt-4 mb-6 flex gap-6 border-b border-neutral-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`border-b-2 pb-2 text-sm ${
            activeTab === tab
              ? "border-brand-600 font-semibold text-brand-600"
              : "border-transparent text-neutral-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
