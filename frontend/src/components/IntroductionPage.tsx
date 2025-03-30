import '@patternfly/react-core/dist/styles/base.css';
import React from 'react';
import {
  Card,
  CardBody,
  Title,
  //TextContent,
  //Text
} from '@patternfly/react-core';

import { TextArea } from '@patternfly/react-core';

const IntroductionPage = () => (
  <Card>
    <CardBody>
      <Title headingLevel="h1">Predictive Maintenance Dashboard</Title>
      <TextArea>
          Welcome to your dashboard. This app predicts equipment failure using synthetic sensor data 
          and machine learning. Use the sidebar to navigate between pages.
      </TextArea>
    </CardBody>
  </Card>
);

export default IntroductionPage;
