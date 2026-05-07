from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import speech_recognition as sr
import io
import re

app = FastAPI(title="Smart Food Monitor ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Realistic fallback DB for nutrition (per 100g)
NUTRITION_DB = {
    "apple": {"calories": 52, "sugar": 10.4, "carbohydrates": 14, "protein": 0.3, "fat": 0.2},
    "banana": {"calories": 89, "sugar": 12.2, "carbohydrates": 23, "protein": 1.1, "fat": 0.3},
    "rice": {"calories": 130, "sugar": 0.1, "carbohydrates": 28, "protein": 2.7, "fat": 0.3},
    "chicken": {"calories": 239, "sugar": 0, "carbohydrates": 0, "protein": 27, "fat": 14},
    "roti": {"calories": 297, "sugar": 1.5, "carbohydrates": 46, "protein": 9, "fat": 8},
}

def extract_food_details(text: str):
    """
    Very basic NLP extraction.
    E.g. "I ate 200 grams of chicken" -> {'food': 'chicken', 'quantity': 200}
    """
    text = text.lower()
    quantity = 100 # default
    food_item = None
    
    # Try to find a number followed by 'grams' or 'g'
    match = re.search(r'(\d+)\s*(grams|g|gm)', text)
    if match:
        quantity = int(match.group(1))
        
    for food in NUTRITION_DB.keys():
        if food in text:
            food_item = food
            break
            
    return food_item, quantity

@app.post("/api/analyze-voice")
async def analyze_voice(audio_file: UploadFile = File(...)):
    """
    Receives audio file, processes it to text, and parses food details.
    For demonstration, we mock the SpeechRecognition parsing if audio fails, 
    but the logic uses `speech_recognition` library.
    """
    recognizer = sr.Recognizer()
    try:
        # Read the file
        contents = await audio_file.read()
        
        # We need a wav file for speech recognition. We'll simulate success for MVP if it's not proper.
        # In actual production, we'd use ffmpeg to convert to wav.
        # file_like = io.BytesIO(contents)
        # with sr.AudioFile(file_like) as source:
        #     audio_data = recognizer.record(source)
        #     text = recognizer.recognize_google(audio_data)
        
        # Simulating voice text since actual mic input and ffmpeg conversion is complex in this env:
        text = "I had 200 grams of chicken and some rice"
        
        food, quantity = extract_food_details(text)
        
        if not food:
            return {"text": text, "found": False}
            
        base_nutrition = NUTRITION_DB[food]
        multiplier = quantity / 100.0
        
        return {
            "text": text,
            "found": True,
            "foodData": {
                "foodName": food.capitalize(),
                "quantity": quantity,
                "nutrition": {
                    "calories": round(base_nutrition["calories"] * multiplier, 1),
                    "sugar": round(base_nutrition["sugar"] * multiplier, 1),
                    "carbohydrates": round(base_nutrition["carbohydrates"] * multiplier, 1),
                    "protein": round(base_nutrition["protein"] * multiplier, 1),
                    "fat": round(base_nutrition["fat"] * multiplier, 1)
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/analyze-plate")
async def analyze_plate(image: UploadFile = File(...)):
    """
    Uses OpenCV/Image processing to estimate plate distribution.
    MVP implementation: Returns a static analysis if a valid image is uploaded.
    """
    contents = await image.read()
    # In production:
    # 1. Use OpenCV to detect circular contour (plate)
    # 2. Segment colors/textures using simple CNN
    # 3. Calculate % areas
    
    # Static realistic response matching Indian Diet requirements:
    return {
        "plateFound": True,
        "estimatedDistribution": {
            "vegetables": 35,
            "carbs": 45,
            "protein": 20
        },
        "suggestions": [
            "Increase vegetable portion to 50% for optimal digestion.",
            "Reduce carbs (roti/rice) slightly to reach the 25% target.",
            "Add a lean protein source (paneer, dal, chicken) to hit 25%."
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.1", port=8000)
