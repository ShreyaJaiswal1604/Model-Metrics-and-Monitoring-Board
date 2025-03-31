import React from 'react';
import { Card, CardBody, Title, Grid, GridItem } from '@patternfly/react-core';

const GrafanaDashboard: React.FC = () => {
  // Replace these URLs with your actual embedded Grafana panel URLs.
  const coolingPanelUrl = "http://localhost:4000/d/heatguard-dashboard/heatguard-metrics-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s";
  const gpuPanelUrl = "http://localhost:4000/d-solo/?orgId=1&from=1743394109938&to=1743394409938&timezone=browser&panelId=1&__feature.dashboardSceneSolo";
  const powerUtilizationPanelUrl = "http://localhost:4000/dashboard/new?orgId=1&from=now-5m&to=now&timezone=browser&editPanel=1&viewPanel=panel-1";

  return (
    <Grid hasGutter>
      <GridItem span={6}>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="xl">CPU Utilization</Title>
            <iframe src="http://grafana:4000/d-solo/?orgId=1&from=1743394109938&to=1743394409938&timezone=browser&panelId=1&__feature.dashboardSceneSolo" width="450" height="200"></iframe>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="xl">GPU Utilization</Title>
            <iframe src={powerUtilizationPanelUrl} width="100%" height="300" frameBorder="0" title="Combined Utilization"></iframe>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={12}>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="xl">Combined Utilization</Title>
            <iframe src={powerUtilizationPanelUrl} width="100%" height="300" frameBorder="0" title="Combined Utilization"></iframe>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default GrafanaDashboard;
