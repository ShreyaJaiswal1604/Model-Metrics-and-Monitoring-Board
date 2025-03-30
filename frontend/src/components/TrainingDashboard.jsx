import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Title, Button, Spinner } from '@patternfly/react-core';
// import { ChartDonut } from '@patternfly/react-charts/verify';

const TrainingDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const trainModel = async () => {
    setLoading(true);
    const res = await fetch('/api/train', { method: 'POST' });
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const chartData = data ? [
    { x: 'Failure', y: data.failure_probability * 100 },
    { x: 'Normal', y: 100 - data.failure_probability * 100 }
  ] : [];

  return (
    <Card>
      <CardHeader>
        <Title headingLevel="h2">Model Training</Title>
      </CardHeader>
      <CardBody>
        <Button onClick={trainModel} isDisabled={loading}>Train Model</Button>
        {loading && <Spinner size="lg" />}
        {data && (
          <>
            <p><strong>Failure Probability:</strong> {(data.failure_probability * 100).toFixed(2)}%</p>
            <p><strong>Total Samples:</strong> {data.total_samples}</p>
            <p><strong>Anomalies:</strong> {data.anomaly_count}</p>
            {/* <ChartDonut
              ariaDesc="Failure chart"
              ariaTitle="Failure Rate"
              data={chartData}
              title={`${(data.failure_probability * 100).toFixed(2)}%`}
              subTitle="Failure"
              height={250}
              width={250}
            /> */}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default TrainingDashboard;
