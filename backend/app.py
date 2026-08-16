from data_processing.data_processing import process_data, load_data
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process-dataset")
async def process_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV.")
    
    contents = await file.read()
    
    try:
        df = load_data()

        df = process_data(df)
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.fillna("")

        return df.to_dict(orient="records")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during processing : {str(e)}")