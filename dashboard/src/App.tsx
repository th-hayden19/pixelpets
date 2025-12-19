import type { Pet } from "./types/Pet"
import { useState, useEffect, useCallback } from 'react';
import { fetchPets } from './api/pets'
import { usePetMqtt } from './mqtt/client'
import Grid from './components/Grid'
import './App.css'

// App() is the component that renders the grid - its body is called for each render
function App() {
  // The useState hook tracks each pet state through the pairing of its Current state value (named pets) and State update function (named setPets)
  // React is built to force component re-render (return new jsx info to the UI) whenever a State update function (i.e. setPets()) is called
  const [pets, setPets] = useState<Record<string, Pet>>({})  

  // Hydrating frontend state
  useEffect(() => {
    // useEffect cannot be async so we wrap our code in an async function, loadPets
    const loadPets = async () => {
      try {
        const data = await fetchPets(); // 'Consumes' the Promise that wraps the dictionary returned by fetchPets()
        setPets(data);
      } catch (err) {
        console.error('Failed to fetch pets:', err);
      }
    };

    loadPets();
  }, []);

  // Calling  useCallback(fn, [])  returns a memoized version of fn
  // So, handlePetUpdate is the memoized arrow function "(pet: Pet) => setPets(...)" Memoized functions are unique because they do NOT get new function objects each time the component renders
  // So, no changes will be detected for useEffect() since its sole dep.-array variable within client.ts is onPetUpdate (which is handlePetUpdate)
  // The result is that despite usePetMqtt running on every render, the useEffect within does not run after it runs once on mount
  const handlePetUpdate = useCallback((pet: Pet) => {
    // When setPets() is called, the most recent pets state is passed as the argument (stored in prev)
    // What comes after => is returned... Here, parentheses wrap the => ({object literal}) to delineate from => {multi-line function block}
    // New object literal contains all of prev, and then overwrites the id-indexed pet with the passed-in pet (or adds the passed-in pet if no match)
    setPets(prev => ({ ...prev, [pet.id]: pet }));  // Sets ({ ...prev })[pet.id] equal to pet (or adds it if non-existent)
  }, []);

  usePetMqtt(handlePetUpdate);

  return <Grid pets={Object.values(pets)} />; // Converts pets dictionary into a Pet[] and passes the jsx info to Grid component
}

export default App;
