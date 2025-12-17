import type { Pet } from '../types/Pet'
import './PetSprite.css'

interface PetSpriteProps {
  pet: Pet
}

export function PetSprite({ pet }: PetSpriteProps) {
    return (
        <div
            className={`pet-sprite mood-${pet.mood}`}
            title={`${pet.id} (Hunger: ${pet.hunger})`}
        >
            🐾
        </div>
    )
}