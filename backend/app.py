
import io
import traceback
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from data_processing.data_processing import process_data
from compute.infer import infer_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
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
        contents = await file.read()
        try:
            df = pd.read_csv(io.BytesIO(contents), sep=";", encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(contents), sep=";", encoding="ISO-8859-1")

        df = process_data(df)
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.fillna("")

        return df.to_dict(orient="records")

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error during processing : {str(e)}"
        ) from e

@app.post("/api/infer-dataset")
async def infer_dataset(file: UploadFile | None = None):
    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.BytesIO(contents), sep=";", encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(contents), sep=";", encoding="ISO-8859-1")

        players_to_return = infer_data(df)

        return players_to_return.to_dict(orient="records")

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error during processing : {str(e)}"
        ) from e
