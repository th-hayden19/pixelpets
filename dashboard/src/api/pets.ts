import type { Pet } from "../types/Pet";
import axios from 'axios';

// Backend Express server
const API_URL = "http://localhost:3001";

// For hydrating
export const fetchPets = async (): Promise<Record<string, Pet>> => {
  const response = await axios.get(`${API_URL}/pets`);
  return response.data;
};

// Sends feed POST request to backend
export const feedPet = async (petId: string) => {
    await axios.post('${API_URL}/pets/${petId}/feed');
}

// Sends cheer POST request to backend
export const cheerPet = async (petId: string) => {
    await axios.post('${API_URL}/pets/${petId}/cheer');
}
