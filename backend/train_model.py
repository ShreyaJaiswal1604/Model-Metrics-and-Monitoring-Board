import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import json
import datetime

def simulate_sensor_data(num_points=1000):
    # Random base values for each run
    temp_base = np.random.uniform(65, 85)
    vib_base = np.random.uniform(0.2, 0.5)
    pres_base = np.random.uniform(90, 110)

    # Add unpredictable noise + sine wave + occasional spikes
    time = np.linspace(0, 20 * np.pi, num_points)

    temperature = (
        np.random.normal(loc=temp_base, scale=np.random.uniform(2, 6), size=num_points) +
        5 * np.sin(time) +
        np.random.uniform(-3, 3, num_points)
    )

    vibration = (
        np.random.normal(loc=vib_base, scale=np.random.uniform(0.03, 0.08), size=num_points) +
        0.1 * np.sin(2 * time) +
        np.random.uniform(-0.05, 0.05, num_points)
    )

    pressure = (
        np.random.normal(loc=pres_base, scale=np.random.uniform(3, 8), size=num_points) +
        10 * np.sin(0.5 * time) +
        np.random.uniform(-5, 5, num_points)
    )

    # Inject anomalies randomly across points
    anomaly_indices = np.random.choice(num_points, size=int(0.05 * num_points), replace=False)
    temperature[anomaly_indices] += np.random.normal(20, 5, len(anomaly_indices)) * np.random.choice([-1, 1], len(anomaly_indices))
    vibration[anomaly_indices] += np.random.normal(0.5, 0.1, len(anomaly_indices)) * np.random.choice([-1, 1], len(anomaly_indices))
    pressure[anomaly_indices] += np.random.normal(30, 5, len(anomaly_indices)) * np.random.choice([-1, 1], len(anomaly_indices))

    df = pd.DataFrame({
        'temperature': temperature,
        'vibration': vibration,
        'pressure': pressure
    })

    # Shuffle the dataset to avoid any predictable time trend
    df = df.sample(frac=1).reset_index(drop=True)

    return df

def train_model():
    df = simulate_sensor_data(1000)
    features = df[['temperature', 'vibration', 'pressure']]

    model = IsolationForest(contamination=0.05, random_state=None)
    df['anomaly'] = model.fit_predict(features)

    failure_probability = (df['anomaly'] == -1).mean()
    anomaly_count = int((df['anomaly'] == -1).sum())

    result = {
        "failure_probability": failure_probability,
        "total_samples": int(len(df)),
        "anomaly_count": anomaly_count,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }
    return result

if __name__ == "__main__":
    result = train_model()
    print(json.dumps(result))
