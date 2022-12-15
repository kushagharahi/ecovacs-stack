import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Grid } from '@mui/material';

import EditMap from '../../components/VacuumMap/EditMap';
import theme from '../../theme';
import MapDelete from './MapDelete/MapDelete';
import MergeRoomTool from './MergeRoomTool/MergeRoomTool';
import NoGoZoneTool from './NoGoZoneTool/NoGoZoneTool';
import RenameRoomTool from './RenameRoomTool/RenameRoomTool';
import SplitRoomTool from './SplitRoomTool/SplitRoomTool';

const Edit = () => {
  return (
    <>
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <Button href="/" variant="contained" startIcon={<ArrowBack />}>
            Back
          </Button>
        </Box>
        <RenameRoomTool />
        <SplitRoomTool />
        <MergeRoomTool />
        <NoGoZoneTool />
        <MapDelete />
      </Grid>
      <Grid item xs={12} md={6}>
        <EditMap />
      </Grid>
    </>
  );
};

export default Edit;
