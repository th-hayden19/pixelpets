import { useEffect } from "react";
import mqtt from "mqtt";
import type { Pet } from "../types/Pet";


export function usePetMqtt(onPetUpdate: (pet: Pet) => void) {
    useEffect(() => {
        const client = mqtt.connect('ws://localhost:9001');

        client.on('connect', () => {
            console.log('Connected to MQTT broker');

            client.subscribe('pixelpets/+/state/#');
        });

        // The onPetUpdate() function (actually handlePetUpdate of App.tsx) is passed out to the MQTT library in a listener
        // Ultimately,  setPets(prev => ({ ...prev, [updatedPet.id]: updatedPet })  runs as a callback inside of MQTT listener whenever a message is received
        client.on('message', (_, payload) => {
            try {
                const updatedPet: Pet = JSON.parse(payload.toString());
                onPetUpdate(updatedPet);
            } catch (err) {
                console.error("Failed to parse MQTT message:", err)
            }
        });

        return () => {
            client.end();
        };
    // The arrow function  (prev) => ({ ...prev, [updatedPet.id]: updatedPet }) is not stable, so every time handlePetUpdate is called, a new function OBJECT is created for prev => ...
    // Similarly, the pet argument changes every time a new Pet is passed in
    // Therefore we need to pass in this external value? Not very clear...
    }, [onPetUpdate]);
}
// The aha - moment is to stop thinking about use effect as "run this code when the component mounts" or "run this code when this value changes".
// Instead it should be seen as a way of synchronizing your React components state with some external API.
// When you look at it like that it becomes clear that you need to re-evaluate the synchronization when any dependency changes.
