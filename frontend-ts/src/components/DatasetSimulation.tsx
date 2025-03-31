import React, { useState } from 'react';
import { Button, Card, CardBody, Title, Alert, AlertActionCloseButton } from '@patternfly/react-core';

const DataSimulation: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleStartSimulation = async () => {
    try {
      const response = await fetch('http://localhost:5001/start', { method: 'POST' });
      if (response.ok) {
        setIsSimulating(true);
        setAlertMessage('Simulation started successfully.');
        setAlertVisible(true);
      } else {
        throw new Error('Failed to start simulation.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage('An unknown error occurred.');
      }
      setAlertVisible(true);
    }
  };

  const handleStopSimulation = async () => {
    try {
      const response = await fetch('http://localhost:5001/stop', { method: 'POST' });
      if (response.ok) {
        setIsSimulating(false);
        setAlertMessage('Simulation stopped successfully.');
        setAlertVisible(true);
      } else {
        throw new Error('Failed to stop simulation.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage('An unknown error occurred.');
      }
      setAlertVisible(true);
    }
  };

  return (
    <Card>
      <CardBody>
        <Title headingLevel="h1">Data Simulation Control</Title>
        {alertVisible && (
          <Alert
            variant={isSimulating ? 'success' : 'danger'}
            title={alertMessage}
            actionClose={<AlertActionCloseButton onClose={() => setAlertVisible(false)} />}
          />
        )}
        <Button
          variant="primary"
          onClick={handleStartSimulation}
          isDisabled={isSimulating}
          style={{ marginRight: '1rem', marginTop: '1rem' }}
        >
          Start Simulation
        </Button>
        <Button
          variant="danger"
          onClick={handleStopSimulation}
          isDisabled={!isSimulating}
          style={{ marginTop: '1rem' }}
        >
          Stop Simulation
        </Button>
      </CardBody>
    </Card>
  );
};

export default DataSimulation;
