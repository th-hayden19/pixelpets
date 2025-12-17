import type { Pet } from "../types/Pet";

export async function fetchPets(): Promise<Pet[]> {
  const res = await fetch("http://localhost:3000/pets");
  return res.json();
}
