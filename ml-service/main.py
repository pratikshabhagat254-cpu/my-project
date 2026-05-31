from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import speech_recognition as sr
import io
import re

# Create FastAPI application instance
app = FastAPI(title="Smart Food Monitor ML API")

# Enable CORS so frontend applications can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["*"],       # Allow all HTTP methods
    allow_headers=["*"],       # Allow all request headers
)

# Nutrition values stored per 100g of food
# Acts as a temporary database for MVP development
NUTRITION_DB = {
    "apple": {"calories": 52, "sugar": 10.4, "carbohydrates": 14, "protein": 0.3, "fat": 0.2},
    "banana": {"calories": 89, "sugar": 12.2, "carbohydrates": 23, "protein": 1.1, "fat": 0.3},
    "rice": {"calories": 130, "sugar": 0.1, "carbohydrates": 28, "protein": 2.7, "fat": 0.3},
    "chicken": {"calories": 239, "sugar": 0, "carbohydrates": 0, "protein": 27, "fat": 14},
    "roti": {"calories": 297, "sugar": 1.5, "carbohydrates": 46, "protein": 9, "fat": 8},
}

def extract_food_details(text: str):
    """
    Extract food name and quantity from natural language input.

    Example:
    "I ate 200 grams of chicken"
    ->
    ("chicken", 200)
    """

    # Convert text to lowercase for easier matching
    text = text.lower()

    # Default quantity if user doesn't specify any amount
    quantity = 100

    # Food item detected in the sentence
    food_item = None

    # Look for patterns like:
    # 200 grams
    # 150 g
    # 250 gm
    match = re.search(r'(\d+)\s*(grams|g|gm)', text)

    if match:
        quantity = int(match.group(1))

    # Check if any food from our nutrition database exists in the text
    for food in NUTRITION_DB.keys():
        if food in text:
            food_item = food
            break

    return food_item, quantity


@app.post("/api/analyze-voice")
async def analyze_voice(audio_file: UploadFile = File(...)):
    """
    Accepts a voice recording and extracts food information.

    Flow:
    Audio File
        ↓
    Speech-to-Text
        ↓
    Food Extraction
        ↓
    Nutrition Calculation
        ↓
    JSON Response
    """

    # Initialize speech recognizer
    recognizer = sr.Recognizer()

    try:
        # Read uploaded audio file into memory
        contents = await audio_file.read()

        # Production Approach:
        # Convert audio to WAV format using ffmpeg
        # Pass audio to Google Speech Recognition
        # Extract spoken text

        # Example implementation:
        # file_like = io.BytesIO(contents)
        # with sr.AudioFile(file_like) as source:
        #     audio_data = recognizer.record(source)
        #     text = recognizer.recognize_google(audio_data)

        # Temporary mocked speech output for MVP
        text = "I had 200 grams of chicken and some rice"

        # Extract food item and quantity from text
        food, quantity = extract_food_details(text)

        # Return response if food could not be identified
        if not food:
            return {
                "text": text,
                "found": False
            }

        # Retrieve nutrition values for selected food
        base_nutrition = NUTRITION_DB[food]

        # Calculate multiplier based on quantity
        # Example:
        # 200g / 100g = 2x
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
        # Return user-friendly API error
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analyze-plate")
async def analyze_plate(image: UploadFile = File(...)):
    """
    Analyze a food plate image and estimate
    food distribution percentages.

    Future Production Pipeline:
    Image Upload
        ↓
    OpenCV Processing
        ↓
    Food Segmentation
        ↓
    Nutrition Estimation
        ↓
    Health Recommendations
    """

    # Read uploaded image
    contents = await image.read()

    # Future Improvements:
    # 1. Detect plate boundary using contours
    # 2. Segment food regions
    # 3. Classify foods using CNN model
    # 4. Estimate nutrition automatically

    # Static response for MVP demonstration
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
    # Run FastAPI application locally
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )
