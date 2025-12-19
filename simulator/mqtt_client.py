import paho.mqtt.client as mqtt
import json

def init_mqtt_client(pets, event_queue):
    # Creates MQTT client object
    client = mqtt.Client()

    # Defining message handler... msg is of MQTTMessage class, which contains topic and payload
    def on_msg(client, userdata, msg):
        try:
            # Split the topic string by '/' and return the last item: the command name
            topic_split = msg.topic.split("/")
            pet_id = topic_split[1]

            if pet_id not in pets:
                return

            payload = json.loads(msg.payload.decode())
            event_queue.put((pet_id, payload))


        except Exception as e:
            print("[MQTT ERROR]", e, "Payload:", msg.payload)

    # Has the client object perform on_msg() when an incoming message is received
    client.on_message = on_msg

    # Connect to broker
    client.connect("localhost", 1883, keepalive=60)

    # Subscribe to state changes according to backend (lambda)
    client.subscribe("pixelpets/+/state/enriched")

    # Begins processing MQTT traffic for incoming messages
    client.loop_start()

    return client