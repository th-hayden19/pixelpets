import type { Pet } from "./types/Pet"
import { useState, useEffect } from 'react';
import { fetchPets } from './api/pets'
import mqtt, { MqttClient } from 'mqtt';
import Grid from './components/Grid'
import './App.css'

// App() is the component that renders the grid
function App() {
  // The useState hook tracks each pet state through the pairing of its Current state value (named pets) and State update function (named setPets)
  // setPets() is the only way to update the pets object, and so whenever setPets() is called there must be an update in state, in which case a re-render is desired
  // Whenever a State update function (i.e. setPets()) is called, the component it is in (i.e. App()) re-renders (returns new jsx info to the UI)
  const [pets, setPets] = useState<Record<string, Pet>>({})  

  // NOTE: The useEffect hook is for tasks that lie outside of React's rendering flow (i.e. subscribing to MQTT messages, fetching data from API, setting up timer etc.)
  // Essentially, things you don't really want on every single render

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


  // Subscribe to MQTT messages
  useEffect(() => {
    // Connect to Mosquitto broker using WebSocket port 9001
    const client: MqttClient = mqtt.connect('ws://localhost:9001');

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('pixelpets/updates'); // subscribe to topic
    });

    client.on('message', (_, payload) => {
      const updatedPet: Pet = JSON.parse(payload.toString());

      // When setPets() is called, the most recent pets state is passed as the argument (stored in prev)
      // What comes after => is returned... Here, parentheses wrap the => ({object literal}) to delineate from => {multi-line function block}
      // New object literal contains all of prev, and then overwrites pet with updatedPet.id with updatedPet (or adds updatedPet if no match)
      setPets(prev => ({ ...prev, [updatedPet.id]: updatedPet }));  // Sets ({ ...prev })[updatedPet.id] equal to updatedPet (or adds it if non-existent)
    });

    return () => { client.end(); }; // Disconnect from broker on dismount... { } w/o return statement returns void (which TS wants) instead of MqttClient expression
  }, []);

  return <Grid pets={Object.values(pets)} />; // Converts pets dictionary into a Pet[] and passes it into Grid component... body of App() component, so this is called for every render
}

export default App
