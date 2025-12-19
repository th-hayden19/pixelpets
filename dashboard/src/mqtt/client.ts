import { useEffect } from "react";
import mqtt from "mqtt";
import type { Pet } from "../types/Pet";

export function usePetMqtt(
    onPetUpdate: (pet: Pet) => void
) {
    // Subscribe to MQTT messages
    useEffect(() => {
        // Connect to Mosquitto broker using WebSocket port 9001
        const client = mqtt.connect('ws://localhost:9001');

        client.on('connect', () => {
            console.log('Connected to MQTT broker');

            client.subscribe('pixelpets/+/state/#');
        });

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
    }, [onPetUpdate]);
}