import time, json
from pet import Pet
from mqtt_client import init_mqtt_client
from queue import Queue

# Manually create three pets
pets = {
    "pet1": Pet("pet1"),
    "pet2": Pet("pet2"),
    "pet3": Pet("pet3")
}

event_queue = Queue()

client = init_mqtt_client(pets, event_queue)

# Looping the simulation
def main():
    print("Simulation begun. \nPublishing updates to MQTT each second...\n")

    while True:
        # Queue ensuring MQTT payload (mood change) is received before progressing simulation
        while not event_queue.empty():
            pet_id, mood = event_queue.get()
            pets[pet_id].mood = mood

        for pet in pets.values():
            pet.update()

            # Publish telemetry
            topic = f"pixelpets/{pet.id}/state"
            payload = json.dumps(pet.__dict__)

            # Received by backend
            client.publish(topic, payload)

            print(f"Published: {topic}: {payload}")

        # Pause for 1 second before looping
        time.sleep(1)


if __name__ == "__main__":
    main()