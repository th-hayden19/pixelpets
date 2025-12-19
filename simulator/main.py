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
        # Queue of (id, raw-dict pet) tuples for finalizing MQTT updates
        while not event_queue.empty():
            pet_id, payload = event_queue.get()

            # Update all values of pet with pet-like dict from MQTT payload
            target_pet = pets[pet_id]
            for key, value in payload.items():
                setattr(target_pet, key, value)

        for pet in pets.values():
            pet.update()

            # Publish raw states which are subbed by backend
            client.publish(f"pixelpets/{pet.id}/state/raw", json.dumps(pet.__dict__))

            print("Published /raw: " + json.dumps(pet.__dict__))

        # Pause for x seconds before looping
        time.sleep(3)


if __name__ == "__main__":
    main()