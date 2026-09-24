"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { RecommendPick } from "@/types/recommend";

type RecommendModalProps = { isOpen: boolean; onClose: () => void };

type RecommendResponse = { picks?: RecommendPick[]; fallback?: boolean };

export default function RecommendModal({
  isOpen,
  onClose,
}: RecommendModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVeg, setIsVeg] = useState<boolean | undefined>(undefined);
  const [cuisine, setCuisine] = useState("All");
  const [loading, setLoading] = useState(false);
  const [picks, setPicks] = useState<RecommendPick[]>([]);
  const [fallback, setFallback] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getRecommendations = async () => {
    setLoading(true);
    setError(false);
    setHasResult(false);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVeg, cuisine }),
      });
      if (!response.ok) throw new Error("Recommendation request failed");
      const result = (await response.json()) as RecommendResponse;
      setPicks(result.picks ?? []);
      setFallback(Boolean(result.fallback));
      setHasResult(true);
    } catch {
      setError(true);
      setPicks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium">Find your meal</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-600"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Preference</legend>
          <div className="mt-2 flex gap-4 text-sm text-neutral-600">
            {[
              { label: "Veg", value: true },
              { label: "Non-veg", value: false },
              { label: "Any", value: undefined },
            ].map((option) => (
              <label key={option.label} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="diet"
                  checked={isVeg === option.value}
                  onChange={() => setIsVeg(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label
          className="mt-4 block text-sm font-medium"
          htmlFor="recommend-cuisine"
        >
          Cuisine
          <select
            id="recommend-cuisine"
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value)}
            className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal text-neutral-900"
          >
            {["All", "Indian", "Italian", "Japanese", "Mexican"].map(
              (option) => (
                <option key={option} className="text-neutral-900" style={{ color: "black" }}>
                  {option}
                </option>
              ),
            )}
          </select>
        </label>
        <button
          type="button"
          onClick={getRecommendations}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-60"
        >
          Get recommendations
        </button>
        {loading && (
          <div className="mt-5 flex items-center gap-2 text-sm text-neutral-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-600" />
            Thinking...
          </div>
        )}
        {error && (
          <div className="mt-5 text-sm text-red-600">
            <p>Could not load recommendations.</p>
            <button
              type="button"
              onClick={getRecommendations}
              className="mt-2 underline"
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !error && hasResult && (
          <div className="mt-5">
            {fallback && (
              <p className="mb-2 text-xs text-neutral-500">
                Showing popular picks
              </p>
            )}
            {picks.length ? (
              picks.map((pick) => (
                <div
                  key={pick.menuItemId}
                  className="mb-2 rounded-lg border border-neutral-200 p-3"
                >
                  <p className="font-medium">{pick.name}</p>
                  <p className="mt-1 text-sm text-neutral-600">{pick.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-600">
                No items match those filters.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
