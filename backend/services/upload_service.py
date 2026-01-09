import pandas as pd
from typing import Set

from backend.services.anomaly_engine import process_transactions
from backend.config.mongo import get_collection

MAX_ROWS = 750_000
MIN_REQUIRED_COLS = {"transaction_id", "sender_account"}
OPTIONAL_FEATURE_COLS = {
    "timestamp", "amount", "device_hash", "ip_address", "location"
}

def ingest_dataframe(
    df: pd.DataFrame,
    simulation_mode: bool = True
) -> dict:
    if df.empty:
        raise ValueError("CSV contains no rows")

    # 1️⃣ Validate minimum columns
    missing_minimal = MIN_REQUIRED_COLS - set(df.columns)
    if missing_minimal:
        raise ValueError(f"Missing required columns: {sorted(missing_minimal)}")

    available_features: Set[str] = set(df.columns)
    present_optional = OPTIONAL_FEATURE_COLS & available_features
    missing_optional = OPTIONAL_FEATURE_COLS - available_features

    # 2️⃣ Run anomaly engine
    processed = process_transactions(
        df,
        simulation_mode=simulation_mode,
        available_features=available_features
    )

    # 3️⃣ Store in MongoDB
    records = processed.to_dict(orient="records")
    collection = get_collection()
    collection.insert_many(records)

    # 4️⃣ Return metadata (shared by API & CLI)
    return {
        "rows_processed": len(records),
        "simulation_mode": simulation_mode,
        "available_features": sorted(present_optional),
        "missing_features": sorted(missing_optional),
        "active_risks": [
            desc for _, desc in processed.attrs.get("active_risks", [])
        ],
        "threshold": processed.attrs.get("threshold")
    }
