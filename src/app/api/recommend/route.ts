import { GoogleGenAI } from "@google/genai";
import { getAllMenuItems } from "@/lib/data/menu";
import type { RecommendFilters, RecommendPick } from "@/types/recommend";

export async function POST(request: Request) {
  const filters = (await request.json()) as RecommendFilters;
  const filteredMenu = getAllMenuItems().filter((item) => {
    const matchesDiet =
      filters.isVeg === undefined || item.isVeg === filters.isVeg;
    const matchesCuisine =
      !filters.cuisine ||
      filters.cuisine === "All" ||
      item.cuisine === filters.cuisine;
    return matchesDiet && matchesCuisine;
  });

  if (filteredMenu.length === 0) {
    return Response.json({
      picks: [],
      fallback: true,
      message: "No items match those filters.",
    });
  }

  const menuContext = filteredMenu
    .map((item) => `${item.id} | ${item.name} | ${item.price}`)
    .join("\n");
  const prompt = `Choose 2-3 items from ONLY this menu list and explain briefly in one sentence why each is a good choice.\n\nMenu (id | name | price):\n${menuContext}\n\nRespond ONLY with valid JSON, no markdown fences or preamble: { "picks": [ { "menuItemId": "...", "name": "...", "reason": "..." } ] }`;

  try {
    const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });
    const text = response.text ?? "";
    const cleanText = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    const parsed: unknown = JSON.parse(cleanText);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray((parsed as { picks?: unknown }).picks)
    ) {
      throw new Error("Gemini response did not contain a picks array");
    }
    return Response.json({
      picks: (parsed as { picks: RecommendPick[] }).picks,
      fallback: false,
    });
  } catch (error) {
    console.error("Recommendation request failed", error);
    return Response.json({
      picks: filteredMenu.slice(0, 3).map((item) => ({
        menuItemId: item.id,
        name: item.name,
        reason: "Popular pick",
      })),
      fallback: true,
    });
  }
}
