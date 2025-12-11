import random

#
# This pet.py and its while loop are the stand-in for a "device" from which MQTT payloads (sensor info) are sent
#

class Pet:
    def __init__(self, pet_id):
        self.id = pet_id
        self.x = random.randint(0,9)
        self.y = random.randint(0,9) 
        self.mood = "happy"
        self.hunger = 0

    def move_randomly(self):
        # One step in a random direction
        self.x += random.choice([-1,0,1])
        self.y += random.choice([-1,0,1])

        # Limits to 10x10 grid
        self.x = max(0, min(9, self.x))
        self.y = max(0, min(9, self.y))

    def update(self):
        # Update pet each tick
        self.move_randomly()
        self.hunger += 1

