from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from pydantic import Field

class BeaconData(BaseModel):
    scanner_id: str
    beacon_id: str # mac address
    rssi: str | int | None = None
    timestamp: datetime = Field(default_factory=datetime.now)

