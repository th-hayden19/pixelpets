import type { Pet } from '../types/Pet';

interface GridProps {
  pets: Pet[];
}

// Read-only snapshot of pets from App.tsx ... Grid is decoupled from any MQTT, HTTP, useEffect, useState etc.
export default function Grid({ pets }: GridProps) {
  const GRID_SIZE = 10;

// This is the JSX returned to the return line of App.tsx
    return (
        <div 
            className="grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                gap: '4px',
                width: '400px',
                height: '400px',
                border: '1px solid #ccc'
            }}
        >
            {/* Render grid cells in background */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                <div
                    key={index}
                    style={{
                        border: '1px solid #eee',
                        position: 'relative'
                    }}
                />
            ))}

            {/* Render pets in foreground, + 1 because it's 1-indexed */}
            {pets.map(pet => (
                <div
                    key={pet.id}
                    style={{
                        gridColumnStart: pet.x + 1,
                        gridRowStart: pet.y + 1,
                        background: 'pink',
                        textAlign: 'center',
                        borderRadius: '4px'
                    }}
                >
                    {pet.id}
                </div>
            ))}
        </div>
    );
}
