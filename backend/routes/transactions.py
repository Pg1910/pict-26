from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from backend.config.mongo import get_collection

router = APIRouter()

# --------------------------------------------------
# GET FLAGGED TRANSACTIONS (TABLE)
# --------------------------------------------------
@router.get("/flagged")
def get_flagged_transactions(
    limit: int = Query(50, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    min_risk: int = Query(0, ge=0)
):
    """
    Returns paginated flagged (anomalous) transactions.
    Frontend renders this as a table.
    """
    c = get_collection()

    query = {
        "final_is_anomalous": True,
        "final_risk_score": {"$gte": min_risk}
    }

    cursor = (
        c.find(query, {"_id": 0})
         .skip(offset)
         .limit(limit)
    )

    return list(cursor)

# --------------------------------------------------
# COUNT FLAGGED (FOR PAGINATION)
# --------------------------------------------------
@router.get("/flagged/count")
def count_flagged_transactions(min_risk: int = Query(0, ge=0)):
    """
    Returns total count of flagged transactions
    (used by frontend to compute pages).
    """
    c = get_collection()

    count = c.count_documents({
        "final_is_anomalous": True,
        "final_risk_score": {"$gte": min_risk}
    })

    return {"count": count}

# --------------------------------------------------
# DOWNLOAD FLAGGED TRANSACTIONS AS CSV
# --------------------------------------------------
@router.get("/flagged/download")
def download_flagged_transactions(min_risk: int = Query(0, ge=0)):
    """
    Streams flagged transactions as CSV.
    Replaces Streamlit download_button.
    """
    c = get_collection()

    cursor = c.find(
        {
            "final_is_anomalous": True,
            "final_risk_score": {"$gte": min_risk}
        },
        {"_id": 0}
    )

    def csv_generator():
        first = True
        for doc in cursor:
            if first:
                yield ",".join(doc.keys()) + "\n"
                first = False
            yield ",".join(map(str, doc.values())) + "\n"

    return StreamingResponse(
        csv_generator(),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=flagged_transactions.csv"
        }
    )
