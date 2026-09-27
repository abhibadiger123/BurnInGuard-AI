import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


FEATURES = [
    "temperature",
    "voltage",
    "current",
    "power",
    "leakage_current"
]


def detect_anomaly(readings):
    if not readings:
        return {
            "status": "INSUFFICIENT_DATA",
            "anomaly_score": 0,
            "risk_level": "LOW",
            "explanation": "No burn-in readings available."
        }

    rows = []

    for reading in readings:
        rows.append({
            "temperature": float(reading.temperature),
            "voltage": float(reading.voltage),
            "current": float(reading.current),
            "power": float(reading.power),
            "leakage_current": float(reading.leakage_current or 0)
        })

    df = pd.DataFrame(rows)
    df = df.fillna(df.median(numeric_only=True))
    df = df.fillna(0)

    if len(df) < 5:
        base = df.iloc[0].copy()

        normal_samples = []

        for _ in range(30):
            normal_samples.append({
                feature: base[feature] * np.random.normal(1.0, 0.03)
                for feature in FEATURES
            })

        normal_df = pd.DataFrame(normal_samples)

        training_df = pd.concat(
            [normal_df, df],
            ignore_index=True
        )
    else:
        training_df = df

    scaler = StandardScaler()
    X = scaler.fit_transform(training_df[FEATURES])

    model = IsolationForest(
        n_estimators=150,
        contamination=0.10,
        random_state=42
    )

    model.fit(X)

    current_scaled = scaler.transform(df[FEATURES].iloc[[-1]])

    prediction = model.predict(current_scaled)[0]
    score = float(model.decision_function(current_scaled)[0])

    if prediction == -1:
        status = "ANOMALY"
        risk_level = "HIGH"
    elif score < 0.05:
        status = "WARNING"
        risk_level = "MEDIUM"
    else:
        status = "NORMAL"
        risk_level = "LOW"

    latest = df.iloc[-1]

    explanation_parts = []

    if latest["temperature"] > df["temperature"].median() * 1.15:
        explanation_parts.append("temperature is significantly above the lot baseline")

    if latest["current"] > df["current"].median() * 1.15:
        explanation_parts.append("current is significantly above the lot baseline")

    if latest["power"] > df["power"].median() * 1.15:
        explanation_parts.append("power is significantly above the lot baseline")

    if latest["leakage_current"] > df["leakage_current"].median() * 1.15:
        explanation_parts.append("leakage current is significantly above the lot baseline")

    if explanation_parts:
        explanation = "; ".join(explanation_parts)
    else:
        explanation = "Electrical and thermal measurements remain close to the observed baseline."

    return {
        "status": status,
        "anomaly_score": round(score, 6),
        "risk_level": risk_level,
        "explanation": explanation
    }