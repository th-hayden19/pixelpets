import express from "express";
import type {Request, Response, NextFunction} from "express";
import mqtt from "mqtt";
import AWS from "aws-sdk";


interface PetState {
    id: string;
    x: number;
    y: number;
    mood: string;
    hunger: number;
}

// In-memory dictionary for the states of all pets
const pets: Record<string, PetState> = {};

// Express object (for HTTP server), MQTT client object, and lambda client object
const app = express()
const client = mqtt.connect("mqtt://localhost:1883");
const lambda = new AWS.Lambda({ region: "us-east-2" });

// MQTT subscribe to the given topic pattern (which is the state of each pet, wildcard + for ID)
client.on("connect", () => {
    client.subscribe("pixelpets/+/state");
})

// Event listener for MQTT client receiving any message
client.on("message", async (topic, msg) => {
    try {
        // log output
        console.log("MQTT message received:", topic, msg.toString());

        // Extract ID from string array of pixelpets/{petId}/state
        const petId = topic.split("/")[1] as string;
        
        // Convert msg Buffer payload to a string parsed into JSON
        const pet: PetState = JSON.parse(msg.toString());

        if (petId !== pet.id) {
            console.warn(`Warning: pet.id from payload ("${pet.id}") does not match petId from topic ("${petId}")`)
        }

        // Update the live dictionary with this pet state
        pets[petId] = pet; 

        // lambda function to calculate mood of this pet
        const result = await lambda.invoke({
            FunctionName: "PixelPetsMood",
            Payload: JSON.stringify(pet)
        }).promise();
        
        const mood = JSON.parse(result.Payload as string).mood;

        // Publish mood back to MQTT (available for subscribtion, i.e. by Python simulator or React frontend)
        client.publish(`pixelpets/${petId}/mood`, mood)

    } catch (err) {
        console.error("Failed to process MQTT message: ", err)
    }
})

// Middleware (process that happens before sending back response) can log data, errors, etc.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error
    res.status(500).send({ error: 'Something went wrong' }); // Return a user-friendly error
});

// Catch-page directing to http://localhost:3000/pets
app.get("/", (req, res) => {
  res.send("PixelPets backend is running! Go to /pets to see the pet state.");
});

// req is the incoming request object (with query parameters), res is the response object with which we send (JSON) data back to the client (i.e. a browser visiting http://localhost:3000/pets, or 
// the React dashboard requesting pet states via HTTP)
app.get("/pets", (req, res) => {
    res.json(pets)
})

// Start the server AFTER Express and MQTT clients are fully set up and connected... otherwise MQTT won't be there to handle messages to/from server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});