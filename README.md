# 🏦 Explainable Transaction Anomaly Monitoring System

> A hackathon project for real-time banking fraud detection with full explainability

---

## 📋 Problem Statement

![Problem Statement](techfiest-PS.png)

Modern banking systems must **monitor transactions in real-time** to identify fraud, account misuse, and suspicious behavior. However, traditional approaches face critical challenges:

- **Fraud labels are rare, delayed, or noisy** — making supervised learning unreliable
- **Models must be explainable** — banking regulations require transparency in decision-making
- **Systems must work offline** and be **auditable** for compliance

---

## 💡 Our Solution

We built an **explainable, rule-based transaction monitoring system** that:

- ✅ **Flags high-risk anomalous transactions** using multi-signal detection
- ✅ **Explains why** each transaction is flagged with human-readable reasons
- ✅ **Works even when user history is sparse** through smart feature engineering
- ✅ **No black-box ML** — every decision is transparent and auditable
- ✅ **Offline-capable** — runs in secure banking environments without external dependencies

### Key Features
- Real-time transaction monitoring via Streamlit dashboard
- Z-score based anomaly detection per account
- Device/IP/Location change tracking
- Risk scoring with detailed explanations
- CSV export of flagged transactions

---

## 🔄 System Architecture & Pipeline

![System Flowchart](techfiesta_flowchart.png)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/YOUR_USERNAME/pict-26.git

# OR Clone via SSH
git clone git@github.com:YOUR_USERNAME/pict-26.git

# Navigate to project directory
cd pict-26
```

### Fork the Repository (Optional)

1. Click the **Fork** button on the top-right of the GitHub repository page
2. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pict-26.git
   ```

### Install Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install streamlit pandas
```

### Run the Application

```bash
# Start the Streamlit dashboard
streamlit run streamlit2.py
```

The application will open in your browser at `http://localhost:8501`

### Usage

1. Upload your transaction CSV file (must include columns: `timestamp`, `sender_account`, `amount`, `device_hash`, `ip_address`, `location`)
2. View real-time anomaly detection results
3. Export flagged transactions for further analysis

---

## 📁 Project Structure

```
pict-26/
├── streamlit2.py              # Main Streamlit application
├── Banking_anomalies.ipynb    # Jupyter notebook for analysis
├── final_transactions.csv     # Sample transaction data
├── flagged_transactions.csv   # Output: flagged anomalies
├── overview.txt               # Detailed system documentation
└── sample_images_out/         # Sample output screenshots
```

---

## 👥 Contributors

Team PICT-26

---

## 📄 License

This project was created for TechFiesta Hackathon.
