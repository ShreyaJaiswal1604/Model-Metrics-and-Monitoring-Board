// import React from 'react';
// import {
//   Page,
//   Masthead,
//   MastheadMain,
//   MastheadToggle,
//   MastheadBrand,
//   MastheadLogo,
//   MastheadContent,
//   PageSidebar,
//   PageSidebarBody,
//   PageSection,
//   PageToggleButton,
//   Toolbar,
//   ToolbarContent,
//   ToolbarItem
// } from '@patternfly/react-core';
// import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
// import IntroductionPage from './components/IntroductionPage';
// import SystemResources from './components/SystemResources';
// import TrainingDashboard from './components/TrainingDashboard';
// import DatasetPage from './components/DatasetPage';

// export const App: React.FunctionComponent = () => {


//   const headerToolbar = (
//     <Toolbar id="vertical-toolbar">
//       <ToolbarContent>
//         <ToolbarItem>header-tools</ToolbarItem>
//       </ToolbarContent>
//     </Toolbar>
//   );

//   const masthead = (
//     <Masthead>
//       <MastheadMain>
//         <MastheadBrand>
//           <MastheadLogo href="https://patternfly.org" target="_blank">
//             Logo
//           </MastheadLogo>
//         </MastheadBrand>
//       </MastheadMain>
//       <MastheadContent>{headerToolbar}</MastheadContent>
//     </Masthead>
//   );

//   const sidebar = (
//     <PageSidebar isSidebarOpen={true} id="vertical-sidebar">
//       <PageSidebarBody>Navigation</PageSidebarBody>
//     </PageSidebar>
//   );

//   return (
//     <Page masthead={masthead} sidebar={sidebar}>
//       <PageSection>
//         <IntroductionPage></IntroductionPage>
//       </PageSection>
//       <PageSection>
//         <DatasetPage/>
//       </PageSection>
//       <PageSection>
//         <TrainingDashboard/> 
//       </PageSection>
//       <PageSection>
//         <SystemResources/>
//       </PageSection>
//     </Page>
//   );
// };

// export default App

// frontend/src/App.tsx
// import React from 'react';
// import { Nav, NavItem, NavList } from '@patternfly/react-core';

// // Import your page components
// import IntroductionPage from './components/IntroductionPage';
// import DatasetPage from './components/DatasetPage';
// import TrainingDashboard from './components/TrainingDashboard';
// import SystemResources from './components/SystemResources';

// // We define an enum to represent the available sections/pages.
// export enum MySection {
//   INTRODUCTION = 'introduction',
//   DATASET_GENERATOR = 'dataset_generator',
//   MODEL_TRAINING = 'model_training',
//   SYSTEM_INFORMATION = 'system_information',
// }

// // The main App component
// export const App: React.FunctionComponent = () => {
//   // Using React state to track which section is active.
//   const [activeItem, setActiveItem] = React.useState<MySection>(MySection.INTRODUCTION);

//   // onSelect is triggered when a navigation item is clicked.
//   // The selectedItem parameter includes properties like groupId, itemId, and to.
//   const onSelect = (
//     _event: React.FormEvent<HTMLInputElement>,
//     selectedItem: { groupId?: string | number; itemId: string | number; to: string }
//   ) => {
//     // We cast the itemId to our MySection enum.
//     setActiveItem(selectedItem.itemId as MySection);
//   };

//   return (
//     <>
//       {/* Navigation bar using PatternFly Nav, NavList, and NavItem */}
//       <Nav onSelect={onSelect} aria-label="Default global" ouiaId="DefaultNav">
//         <NavList>
//           <NavItem
//             preventDefault
//             id="nav-default-link1"
//             to="#nav-default-link1"
//             itemId={MySection.INTRODUCTION}
//             isActive={activeItem === MySection.INTRODUCTION}
//           >
//             Introduction
//           </NavItem>
//           <NavItem
//             preventDefault
//             id="nav-default-link2"
//             to="#nav-default-link2"
//             itemId={MySection.DATASET_GENERATOR}
//             isActive={activeItem === MySection.DATASET_GENERATOR}
//           >
//             Dataset Generator
//           </NavItem>
//           <NavItem
//             preventDefault
//             id="nav-default-link3"
//             to="#nav-default-link3"
//             itemId={MySection.MODEL_TRAINING}
//             isActive={activeItem === MySection.MODEL_TRAINING}
//           >
//             Model Training
//           </NavItem>
//           <NavItem
//             preventDefault
//             id="nav-default-link4"
//             to="#nav-default-link4"
//             itemId={MySection.SYSTEM_INFORMATION}
//             isActive={activeItem === MySection.SYSTEM_INFORMATION}
//           >
//             System Information
//           </NavItem>
//         </NavList>
//       </Nav>

//       {/* Conditional rendering of page content based on the active navigation item */}
//       {activeItem === MySection.INTRODUCTION && <div>Introduction Content</div>}
//       {activeItem === MySection.DATASET_GENERATOR && <div>Dataset Generator Content</div>}
//       {activeItem === MySection.MODEL_TRAINING && <div>Model Training Content</div>}
//       {activeItem === MySection.SYSTEM_INFORMATION && <div>System Information Content</div>}
//     </>
//   );
// };

// export default App;


/////////////////////////////////////////////////////////////////////////////////////////////////

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

import DataSimulation from './components/DatasetSimulation';

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

  return (
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
      <WizardStep name="Project Overview" id="header-first-step">
        {createExpandableCard(
          'project-description',
          'Project Description',
          <ServerIcon />,
          <ul style={listStyle}>
            <li>In an era of AI booms and data-driven chaos, data center hardware is under unprecedented pressure—literally.</li>
            <li>HeatGuard acts as a centralized command center for monitoring the silent thermal stress affecting GPUs and CPUs across global data center zones.</li>
            <li>It empowers data center operators to:
              <ul style={listStyle}>
                <li>Gain real-time visibility into sensor-level metrics.</li>
                <li>Detect abnormal patterns before they become hardware disasters.</li>
                <li>Move from reactive firefighting to proactive maintenance planning.</li>
              </ul>
            </li>
            <li>The sleek UI, built with PatternFly, ensures intuitive navigation and quick insights without complexity.</li>
            <li>By converting raw metrics into visual intelligence, HeatGuard makes data-driven decisions effortless and actionable.</li>
          </ul>
        )}

        {createExpandableCard(
          'dataset-overview',
          'Dataset Overview',
          <ChartLineIcon />,
          <ul style={listStyle}>
            <li>To simulate real-world operational conditions, HeatGuard generates high-fidelity synthetic sensor data across multiple data center zones (e.g., North America, Europe, Asia).</li>
            <li>Each server node includes the following telemetry:
              <ul style={listStyle}>
                <li>Timestamped readings.</li>
                <li>Zone & Node identifiers.</li>
                <li>CPU & GPU temperatures (°C).</li>
                <li>CPU & GPU utilization (%).</li>
                <li>Power consumption (Watts).</li>
                <li>Cooling efficiency index (a derived metric).</li>
              </ul>
            </li>
            <li>~5% of the data includes anomalies, such as:
              <ul style={listStyle}>
                <li>Sudden spikes in temperature.</li>
                <li>Drops in cooling performance or power irregularities.</li>
              </ul>
            </li>
            <li>These anomalies simulate stress events like overheating or partial cooling failures—providing realistic data for model training and visualization.</li>
            <li>The result: a dynamic, flexible dataset that mirrors actual operational complexity in real-time.</li>
          </ul>
        )}

        {createExpandableCard(
          'risk-monitoring',
          'Risk Monitoring',
          <BrainIcon />,
          <ul style={listStyle}>
            <li>At the core of HeatGuard's intelligence is a Machine Learning model based on Isolation Forest—perfectly suited for detecting anomalies in high-dimensional, unlabeled data.</li>
            <li>The ML system continuously monitors and:
              <ul style={listStyle}>
                <li>Trains on both normal and injected anomalous data patterns.</li>
                <li>Calculates risk scores and failure probabilities per server node.</li>
                <li>Flags high-risk zones or hardware components.</li>
              </ul>
            </li>
            <li>Real-time charts and dashboards display:
              <ul style={listStyle}>
                <li>Trends in temperature and utilization over time.</li>
                <li>Risk classification per zone (safe, warning, critical).</li>
              </ul>
            </li>
            <li>With this predictive approach:
              <ul style={listStyle}>
                <li>Maintenance teams are alerted before failures strike.</li>
                <li>Risk becomes manageable, not reactionary.</li>
              </ul>
            </li>
          </ul>
        )}

        {createExpandableCard(
          'system-health',
          'System Health & Alerts',
          <TachometerAltIcon />,
          <ul style={listStyle}>
            <li>Beyond monitoring data center metrics, HeatGuard also keeps an eye on itself.</li>
            <li>The platform includes built-in system resource monitoring for the backend infrastructure, including:
              <ul style={listStyle}>
                <li>CPU usage</li>
                <li>Memory consumption</li>
                <li>Disk performance</li>
              </ul>
            </li>
            <li>These insights help ensure the platform itself remains responsive, even under load.</li>
            <li>If a threshold is exceeded or anomaly is detected, HeatGuard will:
              <ul style={listStyle}>
                <li>Trigger instant visual alerts (e.g., warning banners or modals).</li>
                <li>Offer recommended actions, such as:
                  <ul style={listStyle}>
                    <li>Increase cooling capacity in Europe Zone</li>
                    <li>Schedule maintenance for Node-X</li>
                    <li>Investigate power drop in Rack-12</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>These alerts are designed to be actionable, helping operators move quickly with data-backed confidence.</li>
          </ul>
        )}
      </WizardStep>

      <WizardStep name="Dataset Simulation" id="header-second-step">
      <DataSimulation />
      </WizardStep>

      <WizardStep name="Review" id="header-review-step" footer={{ nextButtonText: 'Finish' }}>
        Review step content
      </WizardStep>
    </Wizard>
  );
};

export default App;

