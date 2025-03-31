// frontend/src/App.tsx
import React from 'react';
import {
  Wizard,
  WizardHeader,
  WizardStep,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardExpandableContent,
  Flex
} from '@patternfly/react-core';

import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon';
import BrainIcon from '@patternfly/react-icons/dist/esm/icons/brain-icon';
import TachometerAltIcon from '@patternfly/react-icons/dist/esm/icons/tachometer-alt-icon';
import ChartLineIcon from '@patternfly/react-icons/dist/esm/icons/chart-line-icon';

// Existing components
import DataSimulation from './components/DatasetSimulation';
// New components
import GrafanaDashboard from './components/GrafanaDashboard';
import AnomalyDetection from './components/AnomalyDetection';

export const App: React.FunctionComponent = () => {
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  const handleExpand = (event: React.MouseEvent, cardId: string) => {
    setExpandedCard(prev => (prev === cardId ? null : cardId));
  };

  const listStyle = { listStyleType: 'disc', paddingLeft: '1.5rem' };

  const createExpandableCard = (
    id: string,
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => (
    <Card id={id} isExpanded={expandedCard === id} style={{ marginBottom: '1rem' }}>
      <CardHeader
        onExpand={(e) => handleExpand(e, id)}
        toggleButtonProps={{
          id: `${id}-toggle`,
          'aria-label': `${title} details`,
          'aria-labelledby': `${id}-title ${id}-toggle`,
          'aria-expanded': expandedCard === id
        }}
      >
        <CardTitle id={`${id}-title`}>
          <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
            {icon}
            <b>{title}</b>
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>{content}</CardBody>
      </CardExpandableContent>
    </Card>
  );

  // Footer component pinned to the bottom using marginTop: 'auto'
  const FooterBanner: React.FC = () => (
    <div style={{ marginTop: 'auto', textAlign: 'center', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>🚨 DataCenter HeatGuard</strong>
      <small>AI-Powered Dashboard for Thermal Risk Detection & Predictive Maintenance</small>
    </div>
  );

  return (
    // Main container: flex column to fill full viewport height
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Content area: grows to fill available space */}
      <div style={{ flex: 1 }}>
        <Wizard
          height={600}
          title="Header wizard"
          header={
            <WizardHeader
              title="🚨 DataCenter HeatGuard"
              description="AI-Powered Dashboard for Thermal Risk Detection & Predictive Maintenance"
              closeButtonAriaLabel="Close header"
            />
          }
        >
          {/* Step 1: Project Overview */}
          <WizardStep name="Project Overview" id="header-first-step">
            {createExpandableCard(
              'project-description',
              'Project Description',
              <ServerIcon />,
              <ul style={listStyle}>
                <li>Data center hardware faces unprecedented pressure in the era of AI and data-driven operations.</li>
                <li>HeatGuard acts as a centralized command center for monitoring the silent thermal stress affecting GPUs and CPUs across global zones.</li>
                <li>It empowers operators to gain real-time sensor-level visibility, detect anomalies early, and shift from reactive firefighting to proactive maintenance.</li>
                <li>The sleek PatternFly UI ensures intuitive navigation and actionable insights.</li>
              </ul>
            )}

            {createExpandableCard(
              'dataset-overview',
              'Dataset Overview',
              <ChartLineIcon />,
              <ul style={listStyle}>
                <li>High-fidelity synthetic sensor data is generated across multiple data center zones (e.g., North America, Europe, Asia).</li>
                <li>Each server node reports telemetry such as temperature, utilization, power consumption, and cooling efficiency.</li>
                <li>Approximately 5% of the data includes anomalies (e.g., sudden spikes or drops), simulating real operational stress events.</li>
              </ul>
            )}

            {createExpandableCard(
              'risk-monitoring',
              'Risk Monitoring',
              <BrainIcon />,
              <ul style={listStyle}>
                <li>A Machine Learning model (Isolation Forest) continuously monitors and flags anomalies.</li>
                <li>Risk scores and failure probabilities are calculated per node to flag high-risk areas.</li>
                <li>Real-time charts display temperature trends, utilization, and risk classification (safe, warning, critical).</li>
              </ul>
            )}

            {createExpandableCard(
              'system-health',
              'System Health & Alerts',
              <TachometerAltIcon />,
              <ul style={listStyle}>
                <li>HeatGuard monitors backend system metrics like CPU usage, memory consumption, and disk performance.</li>
                <li>If thresholds are exceeded, actionable alerts are triggered to help operators respond quickly.</li>
              </ul>
            )}
          </WizardStep>

          {/* Step 2: Simulation & Visualization */}
          <WizardStep name="Data Simulation & Visualization" id="header-second-step">
            <div style={{ marginBottom: '1rem' }}>
              <DataSimulation />
            </div>
            <div>
              <GrafanaDashboard />
            </div>
          </WizardStep>

          {/* Step 3: Anomaly Detection */}
          <WizardStep name="Anomaly Detection" id="header-third-step">
            <AnomalyDetection />
          </WizardStep>

          {/* Step 4: Review */}
          {/* <WizardStep name="Review" id="header-fourth-step" footer={{ nextButtonText: 'Finish' }}>
            <div>
              Review all steps and confirm your selections. Once satisfied, click 'Finish' to complete the process.
            </div>
          </WizardStep> */}
        </Wizard>
      </div>
      <FooterBanner />
    </div>
  );
};

export default App;
