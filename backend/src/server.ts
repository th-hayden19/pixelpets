import express from "express";
import type {Request, Response, NextFunction} from "express";
// MQTT client connects and begins listening solely due to importing the client object (executes mqttClient code)
import client, { pets } from "./mqttClient.js"

// Express object (for HTTP server)
const app = express()

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