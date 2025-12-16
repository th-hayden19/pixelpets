# Lambda handler
def handler(event, context):
    """
    Input: event is a JSON object with pet state
    Output: JSON object with pet id and computed mood
    """

    # Extract relevant state
    pet_id = event.get("id")
    hunger = event.get("hunger", 0)  # default to 0 if missing

    # Compute mood based on hunger
    if hunger < 10:
        mood = "happy"
    elif hunger < 30:
        mood = "neutral"
    else:
        mood = "sad"

    # Step 3: Return structured result
    return {
        "id": pet_id,
        "mood": mood
    }
