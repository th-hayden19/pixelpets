import mqtt from "mqtt";
import AWS from "aws-sdk";
import type { PetState } from "./types"

// In-memory dictionary for the states of all pets
export const pets: Record<string, PetState> = {};

// MQTT client object, and lambda client object
const client = mqtt.connect("mqtt://localhost:1883");
const lambda = new AWS.Lambda({ region: "us-east-2" });

// MQTT subscribe to all states for dictionary of pets
client.on("connect", () => {
    client.subscribe("pixelpets/+/state/#");
})

// Event listener for MQTT client receiving any message
client.on("message", async (topic, msg) => {
    try {
        // Extract ID from string array of pixelpets/{petId}/state
        const splitStr = topic.split("/")
        const petId = splitStr[1] as string;
        const stateType = splitStr[3] as string;

        // Convert msg Buffer payload to a string parsed into JSON
        const pet: PetState = JSON.parse(msg.toString());

        if (petId !== pet.id) {
            console.warn(`Warning: pet.id from payload ("${pet.id}") does not match petId from topic ("${petId}")`)
        }

        // Update the live dictionary with this pet state
        pets[petId] = pet; 

        // lambda function to calculate mood of this pet ONLY if topic is through /raw
        if (stateType === "raw") {
            const result = await lambda.invoke({
                FunctionName: "PixelPetsMood",
                Payload: JSON.stringify(pet)
            }).promise();
        
            pet.mood = JSON.parse(result.Payload as string).mood;

            // Publish mood back to MQTT (available for subscribtion, i.e. by Python simulator or React frontend)
            client.publish(
                `pixelpets/${petId}/state/enriched`, 
                JSON.stringify(pet)
            );
        }

    } catch (err) {
        console.error("Failed to process MQTT message: ", err)
    }
})

export default client;