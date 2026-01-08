import pandas as pd
from datetime import timedelta

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