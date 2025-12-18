import './PetControls.css'

type PetControlsProps = {
  petId: string;
};

export function PetControls({ petId }: PetControlsProps) {
  const sendCommand = async (action: "feed" | "cheer") => {
    await fetch(`/pets/${petId}/${action}`, {
      method: "POST",
    });
  };

  return (
    <div className="pet-controls">
      <button onClick={() => sendCommand("feed")}>F</button>
      <button onClick={() => sendCommand("cheer")}>C</button>
    </div>
  );
}
