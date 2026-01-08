from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import upload, analytics, transactions

app = FastAPI(
    title="Explainable Banking Anomaly Detection API",
    description="Backend for CSV ingestion, anomaly detection, and analytics",
    version="1.0.0"
)

# --------------------------------------------------
# CORS (needed for React frontend)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allows all frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# ROUTES
# --------------------------------------------------
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------
@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Backend is running"}
