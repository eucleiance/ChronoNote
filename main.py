from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Load model and feature columns
model = joblib.load("model.pkl")
feature_columns = joblib.load("feature_columns.pkl")

app = FastAPI()

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change if your frontend is hosted elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    features: dict

@app.post("/predict")
def predict(data: InputData):
    input_dict = data.features

    # Start with zero for all features
    input_array = {col: 0 for col in feature_columns}

    # Update with incoming values
    for key, value in input_dict.items():
        if key in input_array:
            input_array[key] = value

    # Predict
    ordered = [input_array[col] for col in feature_columns]
    prediction = model.predict([ordered])[0]

    return {"prediction": round(prediction, 2)}
