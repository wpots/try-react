export interface EmotionDefinition {
  key: string;
  label: string;
  mouthPath: string;
}

export const emotions: EmotionDefinition[] = [
  { key: "happy", label: "happy", mouthPath: "M8 14s1.5 2 4 2 4-2 4-2" },
  { key: "sad", label: "sad", mouthPath: "M8 17s1.5-2 4-2 4 2 4 2" },
  { key: "angry", label: "angry", mouthPath: "M8 15s1.5 1 4 1 4-1 4-1" },
  { key: "anxious", label: "anxious", mouthPath: "M9 15a3 3 0 0 0 6 0" },
  { key: "guilty", label: "guilty", mouthPath: "M9 15h6" },
  { key: "calm", label: "calm", mouthPath: "M8 14.5s1.5 1.5 4 1.5 4-1.5 4-1.5" },
  { key: "tense", label: "tense", mouthPath: "M8 15s1 .5 4 .5 4-.5 4-.5" },
  { key: "proud", label: "proud", mouthPath: "M8 13s1.5 2.5 4 2.5 4-2.5 4-2.5" },
  { key: "lonely", label: "lonely", mouthPath: "M8 17s1.5-1.5 4-1.5 4 1.5 4 1.5" },
  { key: "tired", label: "tired", mouthPath: "M8 15.5s1 .5 4 .5 4-.5 4-.5" },
  { key: "ashamed", label: "ashamed", mouthPath: "M9 15.5h6" },
  { key: "relieved", label: "relieved", mouthPath: "M8 14s1.5 2 4 2 4-2 4-2" },
];

