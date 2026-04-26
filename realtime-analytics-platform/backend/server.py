"""Local development server simulating Lambda + WebSocket behavior."""
import asyncio
import json
import time
import uuid
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

events_store = []
connected_clients: list[WebSocket] = []


async def broadcast(data: dict):
    for ws in connected_clients:
        try:
            await ws.send_json(data)
        except Exception:
            pass


@app.post("/events")
async def ingest_event(payload: dict):
    event = {
        "event_id": str(uuid.uuid4()),
        "event_type": payload.get("event_type", "unknown"),
        "payload": payload.get("payload", {}),
        "timestamp": int(time.time() * 1000),
        "created_at": datetime.utcnow().isoformat(),
    }
    events_store.append(event)
    await broadcast({"type": "new_event", "data": event})
    return {"event_id": event["event_id"], "status": "ingested"}


@app.get("/events")
def get_events(limit: int = 50):
    return sorted(events_store, key=lambda x: x["timestamp"], reverse=True)[:limit]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        # Send last 10 events on connect
        recent = sorted(events_store, key=lambda x: x["timestamp"], reverse=True)[:10]
        await websocket.send_json({"type": "history", "data": recent})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
