export type MoodType =
  | "HAPPY" | "SAD" | "ANXIOUS" | "CALM"
  | "ANGRY" | "GRATEFUL" | "EXCITED" | "NEUTRAL";

export const MOODS: Record<
  MoodType,
  { label: string; emoji: string; color: string; bg: string; border: string }
> = {
  HAPPY:    { label: "Happy",    emoji: "😊", color: "#F59E0B", bg: "#FEF3C7", border: "#FCD34D" },
  SAD:      { label: "Sad",      emoji: "😢", color: "#60A5FA", bg: "#DBEAFE", border: "#93C5FD" },
  ANXIOUS:  { label: "Anxious",  emoji: "😰", color: "#A78BFA", bg: "#EDE9FE", border: "#C4B5FD" },
  CALM:     { label: "Calm",     emoji: "🌿", color: "#10B981", bg: "#D1FAE5", border: "#6EE7B7" },
  ANGRY:    { label: "Angry",    emoji: "😤", color: "#F87171", bg: "#FEE2E2", border: "#FCA5A5" },
  GRATEFUL: { label: "Grateful", emoji: "🙏", color: "#F472B6", bg: "#FCE7F3", border: "#F9A8D4" },
  EXCITED:  { label: "Excited",  emoji: "🎉", color: "#FB923C", bg: "#FFEDD5", border: "#FED7AA" },
  NEUTRAL:  { label: "Neutral",  emoji: "😐", color: "#94A3B8", bg: "#F1F5F9", border: "#CBD5E1" },
};
