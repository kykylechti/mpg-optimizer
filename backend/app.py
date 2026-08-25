
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from data_processing.data_processing import load_data, process_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/process-dataset")
async def process_dataset(file: UploadFile | None = None):
    if file is None:
        file = File()
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV.")

    try:
        df = load_data()

        df = process_data(df)
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.fillna("")

        return df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error during processing : {str(e)}"
        ) from e
