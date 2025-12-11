import paho.mqtt.client as mqtt
from commands import handle_command

def init_mqtt_client(pets):
    # Creates MQTT client 
    client = mqtt.Client()

    # Defining message handler
    def on_msg(client, userdata, msg):
        # Split the topic string by '/' and return the last item: the command name
        topic_split = msg.topic.split("/")
        cmd = topic_split[-1]
        pet_id = topic_split[1]

        if pet_id in pets:
            handle_command(pets[pet_id], cmd)
            print(f"Command received: {pet_id}: {cmd}")

    # Defines what to do when an incoming message is received
    client.on_message = on_msg

    # Connect to broker
    client.connect("localhost", 1883, keepalive=60)

    # Subscribe to the command topic ('+' matches any topics that contain /cmd (each pet), '#' matches all topics within cmd)
    client.subscribe("pixelpets/+/cmd/#")

    # Beings processing MQTT traffic for incoming messages
    client.loop_start()

    return client