from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import pandas as pd

from services.anomaly_engine import process_transactions
from config.mongo import get_collection

router = APIRouter()

MAX_ROWS = 750_000
MIN_REQUIRED_COLS = {"transaction_id", "sender_account"}
OPTIONAL_FEATURE_COLS = {"timestamp", "amount", "device_hash", "ip_address", "location"}


@router.post("/")
async def upload_csv(
    file: UploadFile = File(...),
    simulation_mode: bool = Query(True)
):
    # 1️⃣ Read CSV with row limit
    try:
        df = pd.read_csv(file.file, nrows=MAX_ROWS)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV contains no rows")

    # 2️⃣ Validate minimum required columns
    missing_minimal = MIN_REQUIRED_COLS - set(df.columns)
    if missing_minimal:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {sorted(missing_minimal)}"
        )

    # 3️⃣ Detect available features
    available_features = set(df.columns)
    present_optional = OPTIONAL_FEATURE_COLS & available_features
    missing_optional = OPTIONAL_FEATURE_COLS - available_features

    # 4️⃣ Run anomaly detection
    try:
        processed = process_transactions(
            df,
            simulation_mode=simulation_mode,
            available_features=available_features
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 5️⃣ Store in MongoDB
    records = processed.to_dict(orient="records")
    collection = get_collection()
    collection.insert_many(records)

    # 6️⃣ Return metadata (frontend uses this)
    return {
        "rows_processed": len(records),
        "simulation_mode": simulation_mode,
        "available_features": sorted(present_optional),
        "missing_features": sorted(missing_optional),
        "active_risks": [desc for _, desc in processed.attrs.get("active_risks", [])],
        "threshold": processed.attrs.get("threshold")
    }
