from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from pydantic import Field

class BeaconData(BaseModel):
    beacon_id: str # mac address
    rssi: str
    timestamp: datetime = Field(default_factory=datetime.now)

