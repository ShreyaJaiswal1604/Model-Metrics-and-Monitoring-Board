import React, { useState } from 'react';
import { Card, CardBody, Title, Button, Progress, DataList, DataListItem, DataListCell } from '@patternfly/react-core';

const DatasetPage = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ rows: 1000, columns: 3 });

  const generateData = () => {
    setProgress(0);
    setDone(false);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDone(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Card>
      <CardBody>
        <Title headingLevel="h2">Dataset Generator</Title>
        <Button onClick={generateData}>Generate Dataset</Button>
        <Progress value={progress} title="Generation Progress" />
        {done && (
          <>
            <Title headingLevel="h3">Dataset Stats</Title>
            <DataList>
              <DataListItem><DataListCell><strong>Rows:</strong> {stats.rows}</DataListCell></DataListItem>
              <DataListItem><DataListCell><strong>Columns:</strong> {stats.columns}</DataListCell></DataListItem>
            </DataList>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default DatasetPage;
