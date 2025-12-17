export interface Pet {
    id: string;
    x: number;
    y: number;
    hunger: number;
    mood: "happy" | "neutral" | "sad";
}
