import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import json

def simulate_sensor_data(num_points=1000):
    temperature = np.random.normal(loc=75, scale=3, size=num_points)
    vibration = np.random.normal(loc=0.3, scale=0.05, size=num_points)
    pressure = np.random.normal(loc=100, scale=5, size=num_points)

    # Inject anomalies into 5% of data
    anomaly_indices = np.random.choice(num_points, size=int(0.05 * num_points), replace=False)
    temperature[anomaly_indices] += np.random.normal(10, 2, len(anomaly_indices))
    vibration[anomaly_indices] += np.random.normal(0.2, 0.05, len(anomaly_indices))
    pressure[anomaly_indices] -= np.random.normal(15, 3, len(anomaly_indices))

    return pd.DataFrame({
        'temperature': temperature,
        'vibration': vibration,
        'pressure': pressure
    })

def train_model():
    df = simulate_sensor_data(1000)
    features = df[['temperature', 'vibration', 'pressure']]

    model = IsolationForest(contamination=0.05, random_state=42)
    df['anomaly'] = model.fit_predict(features)

    failure_probability = (df['anomaly'] == -1).mean()

    result = {
        "failure_probability": failure_probability,
        "total_samples": int(len(df)),
        "anomaly_count": int((df['anomaly'] == -1).sum())
    }

    return result

if __name__ == "__main__":
    result = train_model()
    print(json.dumps(result))  # Must return JSON to be read by server.js
