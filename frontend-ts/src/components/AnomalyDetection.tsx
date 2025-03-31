import React, { useEffect, useState } from 'react';
import {
  Button,
  Title,
  Card,
  CardBody,
  Spinner,
  Alert,
  Split,
  SplitItem,
  Bullseye
} from '@patternfly/react-core';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartVoronoiContainer,
  ChartDonutUtilization
} from '@patternfly/react-charts/victory';

interface AnomalyResult {
  _id?: string;
  failure_probability: number;
  total_samples: number;
  anomaly_count: number;
  timestamp: string;
}

const AnomalyDetection: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/anomalies');
      if (!response.ok) {
        throw new Error('Failed to fetch anomaly data.');
      }
      const data = await response.json();
      setAnomalies(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching anomaly data.');
    } finally {
      setLoading(false);
    }
  };

  const triggerTraining = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/train', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Training failed.');
      }
      await fetchAnomalies();
    } catch (err: any) {
      setError(err.message || 'An error occurred during training.');
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const latest = anomalies[anomalies.length - 1];

  return (
    <Card>
      <CardBody>
        <Title headingLevel="h2">Anomaly Detection Results</Title>
        <Button variant="primary" onClick={triggerTraining} style={{ marginBottom: '1rem' }}>
          Retrain Model
        </Button>

        {loading ? (
          <Bullseye><Spinner size="xl" /></Bullseye>
        ) : error ? (
          <Alert variant="danger" title={error} isInline />
        ) : latest ? (
          <Split hasGutter>
            {/* Donut Chart */}
            <SplitItem>
              <div style={{ height: '230px', width: '230px' }}>
                <ChartDonutUtilization
                  ariaDesc="Failure Probability"
                  ariaTitle="Failure Probability Donut Chart"
                  constrainToVisibleArea
                  data={{ x: 'Failure Probability', y: latest.failure_probability * 100 }}
                  labels={({ datum }) => `${datum.x}: ${datum.y.toFixed(1)}%`}
                  name="failureDonut"
                  subTitle="Failure Risk"
                  title={`${(latest.failure_probability * 100).toFixed(1)}%`}
                />
              </div>
            </SplitItem>

            {/* Bar Chart */}
            <SplitItem>
              <div style={{ height: '250px', width: '600px' }}>
                <Chart
                  ariaDesc="Total Samples and Anomaly Count"
                  ariaTitle="Anomaly Bar Chart"
                  containerComponent={
                    <ChartVoronoiContainer
                      labels={({ datum }) => `${datum.name}: ${datum.y}`}
                      constrainToVisibleArea
                    />
                  }
                  domainPadding={{ x: [30, 25] }}
                  legendData={[{ name: 'Total Samples' }, { name: 'Anomaly Count' }]}
                  legendOrientation="vertical"
                  legendPosition="right"
                  height={250}
                  name="anomalyBar"
                  padding={{ bottom: 50, left: 50, right: 200, top: 50 }}
                  width={600}
                >
                  <ChartAxis />
                  <ChartAxis dependentAxis showGrid />
                  <ChartGroup offset={11}>
                    <ChartBar
                      data={anomalies.map((a, i) => ({
                        name: 'Total Samples',
                        x: `test_${(i + 1).toString().padStart(2, '0')}`,
                        y: a.total_samples
                      }))}
                    />
                    <ChartBar
                      data={anomalies.map((a, i) => ({
                        name: 'Anomaly Count',
                        x: `test_${(i + 1).toString().padStart(2, '0')}`,
                        y: a.anomaly_count
                      }))}
                    />
                  </ChartGroup>
                </Chart>
              </div>
            </SplitItem>
          </Split>
        ) : (
          <Alert variant="info" title="No anomaly data available." isInline />
        )}
      </CardBody>
    </Card>
  );
};

export default AnomalyDetection;
