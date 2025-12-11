import time, json
from pet import Pet
from mqtt_client import init_mqtt_client

# Manually create three pets
pets = {
    "pet1": Pet("pet1"),
    "pet2": Pet("pet2"),
    "pet3": Pet("pet3")
}

client = init_mqtt_client(pets)

# Looping the simulation
def main():
    print("Simulation begun. \nPublishing updates to MQTT each second...\n")

    while True:
        for pet in pets.values():
            pet.update()

            # Publish telemetry
            topic = f"pixelpets/{pet.id}/state"
            payload = json.dumps(pet.__dict__)

            client.publish(topic, payload)

            print(f"Published: {topic}: {payload}")

        # Pause for 1 second before looping
        time.sleep(1)


if __name__ == "__main__":
    main()