from fastapi import APIRouter, Query
from config.mongo import get_collection

router = APIRouter()

# ------------------------------
# SUMMARY METRICS
# ------------------------------
@router.get("/summary")
def summary():
    c = get_collection()
    total = c.count_documents({})
    anomalies = c.count_documents({"final_is_anomalous": True})
    unique_accounts = len(c.distinct("sender_account"))

    return {
        "total_transactions": total,
        "anomalies": anomalies,
        "anomaly_rate": round((anomalies / total) * 100, 2) if total else 0,
        "unique_accounts": unique_accounts
    }

# ------------------------------
# ANOMALY REASONS
# ------------------------------
@router.get("/reasons")
def anomaly_reasons():
    c = get_collection()
    pipeline = [
        {"$unwind": "$final_reasons"},
        {"$group": {"_id": "$final_reasons", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    data = list(c.aggregate(pipeline))

    return {
        "labels": [d["_id"] for d in data],
        "values": [d["count"] for d in data]
    }

# ------------------------------
# RISK SCORE DISTRIBUTION
# ------------------------------
@router.get("/risk-scores")
def risk_scores():
    c = get_collection()
    pipeline = [
        {"$group": {"_id": "$final_risk_score", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    data = list(c.aggregate(pipeline))

    return {
        "labels": [d["_id"] for d in data],
        "values": [d["count"] for d in data]
    }

# ------------------------------
# TRANSACTIONS BY HOUR
# ------------------------------
@router.get("/hourly")
def transactions_by_hour():
    c = get_collection()
    pipeline = [
        {"$group": {"_id": "$hour", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    data = list(c.aggregate(pipeline))

    return {
        "labels": [d["_id"] for d in data],
        "values": [d["count"] for d in data]
    }

# ------------------------------
# ANOMALIES BY HOUR
# ------------------------------
@router.get("/hourly-anomalies")
def anomalies_by_hour():
    c = get_collection()
    pipeline = [
        {"$match": {"final_is_anomalous": True}},
        {"$group": {"_id": "$hour", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    data = list(c.aggregate(pipeline))

    return {
        "labels": [d["_id"] for d in data],
        "values": [d["count"] for d in data]
    }

# ------------------------------
# AMOUNT SUMMARY
# ------------------------------
@router.get("/amount-summary")
def amount_summary():
    c = get_collection()
    pipeline = [
        {
            "$group": {
                "_id": "$final_is_anomalous",
                "avg": {"$avg": "$amount"},
                "min": {"$min": "$amount"},
                "max": {"$max": "$amount"}
            }
        }
    ]
    data = list(c.aggregate(pipeline))

    return {str(d["_id"]): d for d in data}

# ------------------------------
# TOP ACCOUNTS
# ------------------------------
@router.get("/top-accounts")
def top_accounts(limit: int = Query(10)):
    c = get_collection()
    pipeline = [
        {"$match": {"final_is_anomalous": True}},
        {"$group": {"_id": "$sender_account", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": limit}
    ]
    data = list(c.aggregate(pipeline))

    return {
        "labels": [d["_id"] for d in data],
        "values": [d["count"] for d in data]
    }

# ------------------------------
# VELOCITY SIMULATION
# ------------------------------
@router.get("/velocity")
def velocity_stats():
    c = get_collection()
    total_sessions = len(c.distinct("session_id", {"session_id": {"$ne": None}}))
    velocity_flagged = c.count_documents({"risk_velocity_sim": True})

    pipeline = [
        {"$match": {"risk_velocity_sim": True}},
        {"$group": {"_id": "$session_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ]

    sessions = list(c.aggregate(pipeline))

    return {
        "total_sessions": total_sessions,
        "velocity_flagged": velocity_flagged,
        "top_sessions": {d["_id"]: d["count"] for d in sessions}
    }
