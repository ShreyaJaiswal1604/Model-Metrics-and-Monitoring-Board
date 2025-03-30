import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Page,
  PageSidebar,
  Masthead,
  MastheadMain,
  MastheadBrand,
  Nav,
  NavList,
  NavItem
} from '@patternfly/react-core';

import IntroductionPage from './components/IntroductionPage';
import DatasetPage from './components/DatasetPage';
import TrainingDashboard from './components/TrainingDashboard';
import SystemResources from './components/SystemResources';

// 🧠 Sidebar navigation
const SidebarNav = (
  <Nav>
    <NavList>
      <NavItem to="/" itemId={0}>Project Overview</NavItem>
      <NavItem to="/dataset" itemId={1}>Dataset Generation</NavItem>
      <NavItem to="/training" itemId={2}>Model Training</NavItem>
      <NavItem to="/system" itemId={3}>System Resources</NavItem>
    </NavList>
  </Nav>
);

// 🧠 Top header using PatternFly's Masthead
const Header = (
  <Masthead>
    <MastheadMain>
      <MastheadBrand>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          Predictive Maintenance Dashboard
        </span>
      </MastheadBrand>
    </MastheadMain>
  </Masthead>
);

const App = () => {
  return (
    <Router>
      <Page header={Header} sidebar={<PageSidebar nav={SidebarNav} />}>
        <Routes>
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/training" element={<TrainingDashboard />} />
          <Route path="/system" element={<SystemResources />} />
        </Routes>
      </Page>
    </Router>
  );
};

export default App;
