import React, { useState } from 'react';
import {
  WizardStep,
  Form,
  FormGroup,
  TextInput,
  NumberInput,
  Button,
  Select,
  SelectOption,
  SelectVariant,
  Alert,
  Progress,
  ProgressVariant
} from '@patternfly/react-core';

export const DatasetSimulationStep: React.FC = () => {
  const [nodes, setNodes] = useState<number>(50);
  const [anomalyRate, setAnomalyRate] = useState<number>(5);
  const [selectedZone, setSelectedZone] = useState<string>('North America');
  const [isZoneOpen, setIsZoneOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string>('');

  const zoneOptions = ['North America', 'Europe', 'Asia'];

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationStatus('Running simulation...');
    // Simulate processing delay
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStatus(`Simulation completed for ${nodes} nodes in ${selectedZone} with ${anomalyRate}% anomalies.`);
    }, 2000);
  };

  return (
    <WizardStep name="Dataset Simulation" id="header-second-step">
      <Form isWidthLimited maxWidth="500px">
        <FormGroup label="Number of Nodes" fieldId="num-nodes">
          <NumberInput
            value={nodes}
            onChange={(event, value) => setNodes(value)}
            onMinus={() => setNodes(nodes - 1)}
            onPlus={() => setNodes(nodes + 1)}
            inputName="num-nodes"
            inputAriaLabel="Number of Nodes"
            min={1}
          />
        </FormGroup>

        <FormGroup label="Anomaly Rate (%)" fieldId="anomaly-rate">
          <NumberInput
            value={anomalyRate}
            onChange={(event, value) => setAnomalyRate(value)}
            onMinus={() => setAnomalyRate(Math.max(0, anomalyRate - 1))}
            onPlus={() => setAnomalyRate(Math.min(100, anomalyRate + 1))}
            inputName="anomaly-rate"
            inputAriaLabel="Anomaly Rate"
            min={0}
            max={100}
          />
        </FormGroup>

        <FormGroup label="Data Center Zone" fieldId="zone-select">
          <Select
            variant={SelectVariant.single}
            aria-label="Select Zone"
            onToggle={() => setIsZoneOpen(!isZoneOpen)}
            onSelect={(event, selection) => {
              setSelectedZone(selection as string);
              setIsZoneOpen(false);
            }}
            selections={selectedZone}
            isOpen={isZoneOpen}
          >
            {zoneOptions.map((zone, index) => (
              <SelectOption key={index} value={zone} />
            ))}
          </Select>
        </FormGroup>

        <Button variant="primary" onClick={handleSimulate} isDisabled={isSimulating}>
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </Button>

        {simulationStatus && (
          <Alert
            variant={isSimulating ? 'info' : 'success'}
            title={simulationStatus}
            isInline
            style={{ marginTop: '1rem' }}
          />
        )}

        {isSimulating && (
          <Progress
            title="Simulation progress"
            value={70}
            variant={ProgressVariant.info}
            measureLocation="inside"
            style={{ marginTop: '1rem' }}
          />
        )}
      </Form>
    </WizardStep>
  );
};
