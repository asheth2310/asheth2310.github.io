import json
import boto3
import time
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("analytics_events")


def ingest_event(event, context):
    """Lambda handler for ingesting analytics events."""
    try:
        body = json.loads(event.get("body", "{}"))
        item = {
            "event_id": str(uuid.uuid4()),
            "event_type": body.get("event_type", "unknown"),
            "payload": json.dumps(body.get("payload", {})),
            "timestamp": int(time.time() * 1000),
            "created_at": datetime.utcnow().isoformat(),
        }
        table.put_item(Item=item)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"event_id": item["event_id"], "status": "ingested"}),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }


def get_events(event, context):
    """Lambda handler for querying recent events."""
    try:
        limit = int(event.get("queryStringParameters", {}).get("limit", 50))
        response = table.scan(Limit=limit)
        items = sorted(response.get("Items", []), key=lambda x: x["timestamp"], reverse=True)
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps(items),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }
