export type EmotionCategory = "positive" | "optimistic" | "neutral" | "worried" | "negative";

export const EMOTION_CATEGORY_ORDER: EmotionCategory[] = ["positive", "optimistic", "neutral", "worried", "negative"];

export interface EmotionDefinition {
  key: string;
  emoji: string;
  label: string;
}

export const EMOTIONS_BY_CATEGORY: Record<EmotionCategory, EmotionDefinition[]> = {
  positive: [
    { key: "happy", emoji: "😄", label: "happy" },
    { key: "hopeful", emoji: "😊", label: "hopeful" },
    { key: "relieved", emoji: "😌", label: "relieved" },
    { key: "joyful", emoji: "😁", label: "joyful" },
    { key: "proud", emoji: "🥲", label: "proud" },
    { key: "confident", emoji: "😎", label: "confident" },
  ],
  optimistic: [
    { key: "calm", emoji: "😌", label: "calm" },
    { key: "meh", emoji: "😐", label: "meh" },
    { key: "fine", emoji: "🙂", label: "fine" },
  ],
  neutral: [
    { key: "tired", emoji: "😴", label: "tired" },
    { key: "isolated", emoji: "🤐", label: "isolated" },
    { key: "insecure", emoji: "🤔", label: "insecure" },
    { key: "bored", emoji: "🥱", label: "bored" },
  ],
  worried: [
    { key: "disappointed", emoji: "😞", label: "disappointed" },
    { key: "sad", emoji: "😢", label: "sad" },
    { key: "hurt", emoji: "🤕", label: "hurt" },
    { key: "concerned", emoji: "😟", label: "concerned" },
    { key: "lonely", emoji: "😔", label: "lonely" },
  ],
  negative: [
    { key: "annoyed", emoji: "😤", label: "annoyed" },
    { key: "angry", emoji: "😠", label: "angry" },
    { key: "stressed", emoji: "😫", label: "stressed" },
    { key: "anxious", emoji: "😰", label: "anxious" },
    { key: "ashamed", emoji: "😖", label: "ashamed" },
    { key: "embarrassed", emoji: "😳", label: "embarrassed" },
    { key: "scared", emoji: "😨", label: "scared" },
    { key: "nausea", emoji: "🤢", label: "nausea" },
  ],
};

/** Flat list of all emotions (with category) for consumers that need it. */
export const emotions: (EmotionDefinition & { category: EmotionCategory })[] = [
  ...EMOTION_CATEGORY_ORDER.flatMap(category =>
    EMOTIONS_BY_CATEGORY[category].map(emotion => ({
      ...emotion,
      category,
    })),
  ),
];
