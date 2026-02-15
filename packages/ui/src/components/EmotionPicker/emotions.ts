export type EmotionCategory = "positive" | "optimistic" | "neutral" | "worried" | "negative";

export const EMOTION_CATEGORY_ORDER: EmotionCategory[] = ["positive", "optimistic", "neutral", "worried", "negative"];

export interface EmotionDefinition {
  key: string;
  emoji: string;
  label: string;
}

export const EMOTIONS_BY_CATEGORY: Record<EmotionCategory, EmotionDefinition[]> = {
  positive: [
    { key: "blij", emoji: "😄", label: "blij" },
    { key: "kalm", emoji: "😑", label: "kalm" },
    { key: "opgelucht", emoji: "😌", label: "opgelucht" },
    { key: "trots", emoji: "😅", label: "trots" },
    { key: "zelfverzekerd", emoji: "😉", label: "zelfverzekerd" },
  ],
  optimistic: [{ key: "hoopvol", emoji: "😇", label: "hoopvol" }],
  neutral: [
    { key: "moe", emoji: "😴", label: "moe" },
    { key: "onzeker", emoji: "🤔", label: "onzeker" },
    { key: "verveeld", emoji: "😶", label: "verveeld" },
  ],
  worried: [
    { key: "angstig", emoji: "😰", label: "angstig" },
    { key: "bezorgd", emoji: "😟", label: "bezorgd" },
    { key: "gestressed", emoji: "😵", label: "gestressed" },
  ],
  negative: [
    { key: "bang", emoji: "😨", label: "bang" },
    { key: "boos", emoji: "😡", label: "boos" },
    { key: "depressief", emoji: "😩", label: "depressief" },
    { key: "eenzaam", emoji: "😶", label: "eenzaam" },
    { key: "geirriteerd", emoji: "😤", label: "geïrriteerd" },
    { key: "geisoleerd", emoji: "🤐", label: "geïsoleerd" },
    { key: "gekwetst", emoji: "🤕", label: "gekwetst" },
    { key: "schaamte", emoji: "😖", label: "schaamte" },
    { key: "schuldig", emoji: "😣", label: "schuldig" },
    { key: "teleurgesteld", emoji: "😞", label: "teleurgesteld" },
    { key: "misselijk", emoji: "🤢", label: "misselijk" },
    { key: "verdrietig", emoji: "😢", label: "verdrietig" },
  ],
};

/** Flat list of all emotions (with category) for consumers that need it. */
export const emotions: (EmotionDefinition & { category: EmotionCategory })[] = EMOTION_CATEGORY_ORDER.flatMap(
  category => EMOTIONS_BY_CATEGORY[category].map(e => ({ ...e, category })),
);
