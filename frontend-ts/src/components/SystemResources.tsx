// import React, { useEffect, useState } from 'react';
// import { Card, CardBody, CardHeader, Title, DataList, DataListItem, DataListCell, Spinner } from '@patternfly/react-core';

// const SystemResources = () => {
//   const [stats, setStats] = useState(null);

//   const fetchStats = async () => {
//     const res = await fetch('/api/system-stats');
//     const json = await res.json();
//     setStats(json);
//   };

//   useEffect(() => {
//     fetchStats();
//     const interval = setInterval(fetchStats, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   if (!stats) return <Spinner size="xl" />;

//   return (
//     <Card>
//       <CardHeader><Title headingLevel="h2">System Metrics</Title></CardHeader>
//       <CardBody>
//         <DataList>
//           <DataListItem><DataListCell><strong>CPU Usage:</strong> {stats.cpuUsage}%</DataListCell></DataListItem>
//           <DataListItem><DataListCell>
//             <strong>Memory:</strong> {(stats.usedMemory / 1e9).toFixed(2)} GB / {(stats.totalMemory / 1e9).toFixed(2)} GB
//           </DataListCell></DataListItem>
//         </DataList>
//         <Title headingLevel="h3">Disk Usage</Title>
//         {stats.diskUsage.map((disk, i) => (
//           <p key={i}>{disk.filesystem}: {disk.use}% used</p>
//         ))}
//       </CardBody>
//     </Card>
//   );
// };

// export default SystemResources;


// frontend/src/components/SystemResources.tsx
import React from 'react';
import { Card, CardHeader, CardBody, Title, DataList, DataListItem, DataListCell } from '@patternfly/react-core';

// Define interfaces for system stats
interface DiskUsage {
  filesystem: string;
  size: number;
  used: number;
  use: number;
}

interface SystemStats {
  cpuUsage: string;
  totalMemory: number;
  usedMemory: number;
  diskUsage: DiskUsage[];
}

interface SystemResourcesProps {
  stats: SystemStats;
}

const SystemResources: React.FC<SystemResourcesProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <Title headingLevel="h2">System Metrics</Title>
      </CardHeader>
      <CardBody>
        <DataList aria-label="System Metrics">
          <DataListItem>
            <DataListCell>
              <strong>CPU Usage:</strong> {stats.cpuUsage}%
            </DataListCell>
          </DataListItem>
          <DataListItem>
            <DataListCell>
              <strong>Memory:</strong> {(stats.usedMemory / 1e9).toFixed(2)} GB used of {(stats.totalMemory / 1e9).toFixed(2)} GB
            </DataListCell>
          </DataListItem>
        </DataList>
        <Title headingLevel="h3">Disk Usage</Title>
        {stats.diskUsage.map((disk, index) => (
          <p key={index}>
            {disk.filesystem}: {disk.use}% used
          </p>
        ))}
      </CardBody>
    </Card>
  );
};

export default SystemResources;
