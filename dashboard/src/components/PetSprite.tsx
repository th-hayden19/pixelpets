import type { Pet } from '../types/Pet'
import './PetSprite.css'
import { PetControls } from "./PetControls";

interface PetSpriteProps {
  pet: Pet
}

export function PetSprite({ pet }: PetSpriteProps) {
    return (
        <div className={`pet-sprite ${pet.mood}`} title={`${pet.id} (Hunger: ${pet.hunger})`}>
            <div className="pet-image">🐾</div>
            <PetControls petId={pet.id} />
        </div>
    )
}