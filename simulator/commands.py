def handle_command(pet, cmd):
    if cmd == "feed":
        pet.hunger = 0
    elif cmd == "cheer":
        pet.mood = "excited"