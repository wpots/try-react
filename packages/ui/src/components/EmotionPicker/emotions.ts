export interface EmotionDefinition {
  key: string;
  emoji: string;
  label: string;
}

export const emotions: EmotionDefinition[] = [
  { key: "angstig", emoji: "😰", label: "angstig" },
  { key: "bang", emoji: "😨", label: "bang" },
  { key: "bezorgd", emoji: "😟", label: "bezorgd" },
  { key: "blij", emoji: "😄", label: "blij" },
  { key: "boos", emoji: "😡", label: "boos" },
  { key: "depressief", emoji: "😩", label: "depressief" },
  { key: "eenzaam", emoji: "😶", label: "eenzaam" },
  { key: "geirriteerd", emoji: "😤", label: "geïrriteerd" },
  { key: "geisoleerd", emoji: "🤐", label: "geïsoleerd" },
  { key: "gekwetst", emoji: "🤕", label: "gekwetst" },
  { key: "gestressed", emoji: "😵", label: "gestressed" },
  { key: "hoopvol", emoji: "😇", label: "hoopvol" },
  { key: "kalm", emoji: "😑", label: "kalm" },
  { key: "moe", emoji: "😴", label: "moe" },
  { key: "onzeker", emoji: "🤔", label: "onzeker" },
  { key: "opgelucht", emoji: "😌", label: "opgelucht" },
  { key: "schaamte", emoji: "😖", label: "schaamte" },
  { key: "schuldig", emoji: "😣", label: "schuldig" },
  { key: "teleurgesteld", emoji: "😞", label: "teleurgesteld" },
  { key: "trots", emoji: "😅", label: "trots" },
  { key: "verafschuwd", emoji: "🤢", label: "verafschuwd" },
  { key: "verdrietig", emoji: "😢", label: "verdrietig" },
  { key: "verveeld", emoji: "😶", label: "verveeld" },
  { key: "zelfverzekerd", emoji: "😉", label: "zelfverzekerd" },
];
