from fastapi import APIRouter, Request, Query, HTTPException
from models.BeaconData import BeaconData
from fastapi.responses import HTMLResponse
import os
import csv
from datetime import datetime, timedelta

apiRouter = APIRouter()

# CSV file path
CSV_FILE = "beacon_data.csv"


# ----------- record sensor data in csv at each post request ------------
@apiRouter.post("/api/record-data")
async def create_record(sensor_data:BeaconData):

    # Check if it exists?
    file_exists = os.path.exists(CSV_FILE)

    # Open file in append mode
    with open(CSV_FILE, mode="a") as file:
        writer = csv.DictWriter(file, fieldnames=sensor_data.model_dump().keys())

        # Write headers in case
        if not file_exists:
            writer.writeheader()

        # Write the new row
        writer.writerow(sensor_data.model_dump())

    # print(sensor_data)
    return {"message": "success", "data": sensor_data}

