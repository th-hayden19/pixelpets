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

    // 1. An effect runs whenever a variable in its dependency array changes value.
    //    The dependency array must contain any external values that are read inside the effect, 
    //    so that the effect can re-run and stay in sync with changes to those values.
    //    (Guarunteed stable external values, such as setState functions, are exceptions and do not need to be included.)
    // 2. Whenever a function is rendered, a new function object and reference are created in memory,
    //    even if the function object is identical to the previous one.
    //    A variable holding the reference now updates its value to the newly made reference.
    //
    // Implementation:
    // 1. Normally, [onPetUpdate] would cause this effect to run on every render in which the onPetUpdate function reference changes, 
    //    forcing unecessary mqtt client object connections.
    // 2. To prevent this, we memoize the passed-in function from App.tsx with useCallback(), 
    //    which "freezes the reference" (new references/objects are not created until dependencies change;
    //    in our case, the useCallback dependency array is [], so a new reference/object will never be made).
    // 3. The result is a proper dependency array with the external value onPetUpdate, 
    //    while ensuring this useEffect only ever runs once, on mount.
    }, [onPetUpdate]);
}
