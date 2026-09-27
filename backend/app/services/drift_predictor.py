import numpy as np
from sklearn.linear_model import LinearRegression


def predict_drift(value_0h, value_24h):
    if value_0h is None or value_24h is None:
        return {
            "status": "INSUFFICIENT_DATA",
            "prediction": "UNKNOWN",
            "predicted_168h": None,
            "drift_rate": None,
            "safety_slope": None,
            "risk_level": "LOW",
            "explanation": "Value_0h and Value_24h are required."
        }

    value_0h = float(value_0h)
    value_24h = float(value_24h)

    X = np.array([[0], [24]])
    y = np.array([value_0h, value_24h])

    model = LinearRegression()
    model.fit(X, y)

    predicted_168h = float(model.predict([[168]])[0])

    drift_rate = float((value_24h - value_0h) / 24)

    safety_slope = float(abs(value_0h) * 0.001)

    if safety_slope == 0:
        safety_slope = 0.001

    if abs(drift_rate) > safety_slope * 2:
        risk_level = "HIGH"
        prediction = "FAILURE_RISK"
        status = "CRITICAL"
    elif abs(drift_rate) > safety_slope:
        risk_level = "MEDIUM"
        prediction = "DEGRADATION_RISK"
        status = "WARNING"
    else:
        risk_level = "LOW"
        prediction = "STABLE"
        status = "NORMAL"

    explanation = (
        f"Value changed from {value_0h:.3f} at 0h to "
        f"{value_24h:.3f} at 24h. "
        f"Predicted value at 168h is {predicted_168h:.3f}."
    )

    return {
        "status": status,
        "prediction": prediction,
        "predicted_168h": round(predicted_168h, 3),
        "drift_rate": round(drift_rate, 6),
        "safety_slope": round(safety_slope, 6),
        "risk_level": risk_level,
        "explanation": explanation
    }