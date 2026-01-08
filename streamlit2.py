import streamlit as st
import pandas as pd
from collections import Counter
from datetime import timedelta
import traceback

# =========================================================
# PAGE CONFIG
# =========================================================
st.set_page_config(
    page_title="Explainable Banking Anomaly Monitor",
    layout="wide"
)

st.title("🏦 Explainable Transaction Anomaly Monitoring System")
st.caption("Upload transactions → get explainable risk alerts")

# =========================================================
# CONSTANTS
# =========================================================
MAX_ROWS = 150_000

# =========================================================
# PROCESSING PIPELINE
# =========================================================
def process_transactions(df, simulation_mode=True, available_features=None):
    """
    Process transactions with flexible feature handling.
    Only applies risk checks for features that are available in the dataset.
    """
    if available_features is None:
        available_features = set(df.columns)
    
    # ---------- Basic preprocessing ----------
    df = df.copy()
    
    # Track which risk checks are active
    active_risks = []
    
    # Timestamp handling
    has_timestamp = "timestamp" in available_features
    if has_timestamp:
        df["timestamp"] = pd.to_datetime(df["timestamp"], format="ISO8601", utc=True)
        df = df.sort_values(["sender_account", "timestamp"])
        df["hour"] = df["timestamp"].dt.hour
    else:
        df["hour"] = 12  # Default hour if no timestamp
    
    # ---------- Amount z-score ----------
    has_amount = "amount" in available_features
    if has_amount:
        df["amount_zscore"] = (
            df.groupby("sender_account")["amount"]
              .transform(lambda x: (x - x.mean()) / x.std() if x.std() > 0 else 0)
        )
        df["risk_amount"] = df["amount_zscore"] >= 1
        active_risks.append(("risk_amount", "Unusual transaction amount"))
    else:
        df["risk_amount"] = False
        df["amount_zscore"] = 0

    # ---------- New device ----------
    has_device = "device_hash" in available_features
    if has_device:
        df["is_new_device"] = df.groupby("sender_account")["device_hash"] \
                                .transform(lambda x: ~x.duplicated())
        df["risk_new_device"] = df["is_new_device"]
        active_risks.append(("risk_new_device", "New device detected"))
    else:
        df["is_new_device"] = False
        df["risk_new_device"] = False

    # ---------- New IP ----------
    has_ip = "ip_address" in available_features
    if has_ip:
        df["is_new_ip"] = df.groupby("sender_account")["ip_address"] \
                            .transform(lambda x: ~x.duplicated())
        df["risk_new_ip"] = df["is_new_ip"]
        active_risks.append(("risk_new_ip", "New IP address detected"))
    else:
        df["is_new_ip"] = False
        df["risk_new_ip"] = False

    # ---------- Location change ----------
    has_location = "location" in available_features
    if has_location:
        df["prev_location"] = df.groupby("sender_account")["location"].shift(1)
        df["location_changed"] = df["location"] != df["prev_location"]
        df["risk_location_change"] = df["location_changed"]
        active_risks.append(("risk_location_change", "Transaction location changed"))
    else:
        df["prev_location"] = None
        df["location_changed"] = False
        df["risk_location_change"] = False

    # ---------- Off-hour activity ----------
    if has_timestamp:
        dominant_hour = (
            df.groupby(["sender_account", "hour"])
              .size()
              .reset_index(name="count")
              .sort_values(["sender_account", "count"], ascending=[True, False])
              .groupby("sender_account", as_index=False)
              .head(1)
              .set_index("sender_account")["hour"]
        )
        df["dominant_hour"] = df["sender_account"].map(dominant_hour)
        df["off_hour_txn"] = df["hour"] != df["dominant_hour"]
        df["risk_off_hour"] = df["off_hour_txn"]
        active_risks.append(("risk_off_hour", "Transaction at unusual time"))
    else:
        df["dominant_hour"] = 12
        df["off_hour_txn"] = False
        df["risk_off_hour"] = False

    # ---------- Risk flags aggregation ----------
    base_risk_cols = [r[0] for r in active_risks]
    
    if base_risk_cols:
        df["base_risk_score"] = df[base_risk_cols].sum(axis=1)
    else:
        df["base_risk_score"] = 0

    # ---------- Velocity simulation ----------
    df["risk_velocity_sim"] = False
    df["txn_count_sim"] = 1
    df["session_id"] = pd.NA
    df["sim_timestamp"] = df["timestamp"] if has_timestamp else pd.NaT

    if simulation_mode and has_timestamp:
        df = df.reset_index(drop=True)
        session_size = 5
        num_sessions = min(100, len(df) // session_size)

        for s in range(num_sessions):
            idx = df.index[s*session_size:(s+1)*session_size]
            base_time = df.loc[idx[0], "timestamp"]
            session = f"SIM_SESSION_{s}"

            for j, i in enumerate(idx):
                df.loc[i, "session_id"] = session
                df.loc[i, "sim_timestamp"] = base_time + timedelta(seconds=10*j)

        df = df.sort_values(["session_id", "sim_timestamp"], na_position="last")
        df["txn_count_sim"] = df.groupby("session_id", dropna=True).cumcount() + 1
        df["risk_velocity_sim"] = df["txn_count_sim"] >= 3
        active_risks.append(("risk_velocity_sim", "Multiple transactions in short time"))

    # ---------- Final risk score ----------
    df["final_risk_score"] = df["base_risk_score"] + df["risk_velocity_sim"].astype(int)

    # ---------- Explainability ----------
    # Build a mapping of risk columns to their descriptions
    risk_descriptions = {r[0]: r[1] for r in active_risks}
    
    def build_reasons(row):
        reasons = []
        for risk_col, description in risk_descriptions.items():
            if row.get(risk_col, False):
                reasons.append(description)
        return reasons

    df["final_reasons"] = df.apply(build_reasons, axis=1)

    # ---------- Dynamic anomaly threshold ----------
    # Original logic: 5 out of 6 risks (83%) with simulation, 4 out of 5 (80%) without
    # We maintain ~80% ratio for consistency with original anomaly rate (~5%)
    total_possible_risks = len(active_risks)
    if total_possible_risks == 0:
        threshold = 1  # Fallback
    elif total_possible_risks == 1:
        threshold = 1  # Only 1 feature, need that risk to flag
    elif total_possible_risks == 2:
        threshold = 2  # Need both risks (100%)
    elif total_possible_risks == 3:
        threshold = 3  # Need all 3 risks (100%) - stricter for few features
    elif total_possible_risks == 4:
        threshold = 3  # Need 3 out of 4 (75%)
    elif total_possible_risks == 5:
        threshold = 4  # Need 4 out of 5 (80%)
    else:  # 6 or more
        threshold = 5  # Need 5 out of 6 (83%) - matches original
    
    df["final_is_anomalous"] = df["final_risk_score"] >= threshold
    
    # Store metadata for UI display
    df.attrs["active_risks"] = active_risks
    df.attrs["threshold"] = threshold
    df.attrs["available_features"] = list(available_features)

    return df

# =========================================================
# FILE UPLOAD
# =========================================================
st.sidebar.header("Input")

uploaded_file = st.sidebar.file_uploader(
    "Upload transaction CSV",
    type=["csv"]
)

simulation_mode = st.sidebar.checkbox(
    "Enable Simulation Mode (Velocity)",
    value=True
)

if uploaded_file is None:
    st.info("Upload a CSV file to start analysis.")
    st.stop()

# Read with row limit
raw_df = pd.read_csv(uploaded_file, nrows=MAX_ROWS)

# Validate minimum required columns (only need ID and account identifier)
minimal_required_cols = {"transaction_id", "sender_account"}
missing_minimal = minimal_required_cols - set(raw_df.columns)
if missing_minimal:
    st.error(f"Missing minimum required columns in CSV: {sorted(missing_minimal)}")
    st.stop()

# Define optional feature columns for anomaly detection
optional_feature_cols = {"timestamp", "amount", "device_hash", "ip_address", "location"}
available_features = set(raw_df.columns)
present_optional = optional_feature_cols & available_features
missing_optional = optional_feature_cols - available_features

if len(raw_df) == 0:
    st.warning("The uploaded CSV has no rows.")
    st.stop()

# Show what features are available
st.sidebar.success(f"Loaded {len(raw_df):,} rows (max {MAX_ROWS:,})")

if present_optional:
    st.sidebar.info(f"✅ Available features: {', '.join(sorted(present_optional))}")
if missing_optional:
    st.sidebar.warning(f"⚠️ Missing optional features: {', '.join(sorted(missing_optional))}")

# Warn if very few features available
if len(present_optional) < 2:
    st.warning("⚠️ Limited features available. Anomaly detection will be basic. For better results, include more columns like: timestamp, amount, device_hash, ip_address, location")

# =========================================================
# PROCESS DATA
# =========================================================
with st.spinner("Processing transactions..."):
    try:
        data = process_transactions(raw_df, simulation_mode, available_features)
    except Exception as e:
        st.error("❌ Error while processing uploaded dataset")
        st.code(str(e))
        st.code(traceback.format_exc())
        st.stop()

# Show detection configuration
if hasattr(data, 'attrs') and data.attrs:
    active_risks = data.attrs.get('active_risks', [])
    threshold = data.attrs.get('threshold', 'N/A')
    st.sidebar.markdown("---")
    st.sidebar.subheader("🔍 Detection Config")
    st.sidebar.write(f"**Active risk checks:** {len(active_risks)}")
    st.sidebar.write(f"**Anomaly threshold:** ≥ {threshold} risks")
    with st.sidebar.expander("View active checks"):
        for risk_col, desc in active_risks:
            st.write(f"• {desc}")

# =========================================================
# METRICS
# =========================================================
st.header("📊 Overview Metrics")

c1, c2, c3, c4 = st.columns(4)
c1.metric("Total Transactions", f"{len(data):,}")
c2.metric("Anomalies Detected", f"{data['final_is_anomalous'].sum():,}")
c3.metric("Anomaly Rate", f"{data['final_is_anomalous'].mean()*100:.2f}%")
c4.metric("Unique Accounts", f"{data['sender_account'].nunique():,}")

# =========================================================
# CHARTS ROW 1
# =========================================================
st.header("📈 Visualizations")

col1, col2 = st.columns(2)

# Anomaly Reason Breakdown
with col1:
    st.subheader("🧠 Anomaly Reason Breakdown")
    all_reasons = Counter(
        r for reasons in data["final_reasons"] for r in reasons
    )
    if all_reasons:
        reason_df = pd.DataFrame.from_dict(all_reasons, orient="index", columns=["count"])
        reason_df = reason_df.sort_values("count", ascending=False)
        st.bar_chart(reason_df)
    else:
        st.info("No anomaly reasons detected.")

# Risk Score Distribution
with col2:
    st.subheader("🎯 Risk Score Distribution")
    score_counts = data["final_risk_score"].value_counts().sort_index()
    st.bar_chart(score_counts)

# =========================================================
# CHARTS ROW 2
# =========================================================
col3, col4 = st.columns(2)

# Transactions by Hour
with col3:
    st.subheader("⏰ Transactions by Hour")
    if "timestamp" in available_features:
        hourly = data.groupby("hour").size()
        st.line_chart(hourly)
    else:
        st.info("Timestamp data not available for hourly analysis.")

# Anomalies by Hour
with col4:
    st.subheader("🚨 Anomalies by Hour")
    if "timestamp" in available_features:
        anomaly_hourly = data[data["final_is_anomalous"]].groupby("hour").size()
        if not anomaly_hourly.empty:
            st.bar_chart(anomaly_hourly)
        else:
            st.info("No anomalies detected.")
    else:
        st.info("Timestamp data not available for hourly analysis.")

# =========================================================
# CHARTS ROW 3
# =========================================================
col5, col6 = st.columns(2)

# Amount Distribution (Normal vs Anomalous)
with col5:
    st.subheader("💰 Amount Distribution")
    if "amount" in available_features:
        amount_summary = pd.DataFrame({
            "Normal": data[~data["final_is_anomalous"]]["amount"].describe(),
            "Anomalous": data[data["final_is_anomalous"]]["amount"].describe()
        })
        st.dataframe(amount_summary, use_container_width=True)
    else:
        st.info("Amount data not available for distribution analysis.")

# Top Accounts by Anomaly Count
with col6:
    st.subheader("👤 Top 10 Accounts by Anomaly Count")
    top_accounts = (
        data[data["final_is_anomalous"]]
        .groupby("sender_account")
        .size()
        .sort_values(ascending=False)
        .head(10)
    )
    if not top_accounts.empty:
        st.bar_chart(top_accounts)
    else:
        st.info("No anomalies found.")

# =========================================================
# SIMULATION MODE SECTION
# =========================================================
if simulation_mode and "timestamp" in available_features:
    st.header("⚡ Simulation Mode Insights")

    sim_col1, sim_col2 = st.columns(2)

    with sim_col1:
        st.subheader("🔄 Velocity Violations per Session")
        velocity_flags = data[data["risk_velocity_sim"]]
        session_violations = velocity_flags.groupby("session_id", dropna=True).size().head(20)
        if not session_violations.empty:
            st.bar_chart(session_violations)
        else:
            st.info("No velocity violations detected.")

    with sim_col2:
        st.subheader("📋 Simulation Summary")
        total_sessions = data["session_id"].dropna().nunique()
        velocity_flagged = data["risk_velocity_sim"].sum()
        st.metric("Simulated Sessions", f"{total_sessions:,}")
        st.metric("Velocity-Flagged Transactions", f"{velocity_flagged:,}")

    # Session Details Table
    st.subheader("🗂️ Sample Simulated Sessions")
    session_sample = (
        data[data["session_id"].notna()]
        [["session_id", "transaction_id", "sender_account", "sim_timestamp",
          "txn_count_sim", "risk_velocity_sim", "final_risk_score"]]
        .head(50)
    )
    st.dataframe(session_sample, use_container_width=True, height=300)

# =========================================================
# FLAGGED TRANSACTIONS TABLE
# =========================================================
st.header("🚨 Flagged Transactions")

# Dynamically build column list based on available features
flagged_cols = ["transaction_id", "sender_account"]
if "timestamp" in available_features:
    flagged_cols.append("timestamp")
if "amount" in available_features:
    flagged_cols.append("amount")
if "location" in available_features:
    flagged_cols.append("location")
flagged_cols.extend(["final_risk_score", "final_reasons"])

flagged = data[data["final_is_anomalous"]][flagged_cols]

st.dataframe(flagged, use_container_width=True, height=400)

# =========================================================
# DOWNLOAD
# =========================================================
st.header("📥 Export Results")

csv_export = flagged.to_csv(index=False).encode("utf-8")
st.download_button(
    label="Download Flagged Transactions as CSV",
    data=csv_export,
    file_name="flagged_transactions.csv",
    mime="text/csv"
)

st.caption(f"Analysis limited to first {MAX_ROWS:,} rows for performance.")
