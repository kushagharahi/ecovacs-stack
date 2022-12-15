import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import ControlMap from '../../components/VacuumMap/ControlMap';
import Commands from './Commands/Commands';
import Notifications from './Notifications/Notifications';
import Options from './Options/Options';

const Dashboard = () => {
  const [value, setValue] = useState('2');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Notifications" value="1" />
                <Tab label="Commands" value="2" />
                <Tab label="Options" value="3" />
              </TabList>
            </Box>
            <TabPanel
              value="1"
              sx={value === '1' ? { display: 'flex', height: 'calc(100vh - 150px)', overflow: 'scroll' } : {}}
            >
              <Notifications />
            </TabPanel>
            <TabPanel
              value="2"
              sx={value === '2' ? { display: 'flex', height: 'calc(100vh - 150px)', overflow: 'scroll' } : {}}
            >
              <Commands />
            </TabPanel>
            <TabPanel
              value="3"
              sx={value === '3' ? { display: 'flex', height: 'calc(100vh - 150px)', overflow: 'scroll' } : {}}
            >
              <Options />
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <ControlMap />
      </Grid>
    </>
  );
};

export default Dashboard;
