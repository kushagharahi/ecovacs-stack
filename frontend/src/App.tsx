import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import Dashboard from './pages/Dashboard';
import websocketService from './services/websocket.service';
import { hideDialog } from './store/dialog/dialogSlice';
import { useAppDispatch } from './store/hooks';
import { setCachedMapInfo } from './store/vacuum/editMapSlice';
import {
  incrementMapTracesListUpdateIndex,
  onRelocateSuccess,
  setGoToCoordinates,
  setMapSubsetsList,
  setMapTracesList,
  setNoGoMapSubsetsList,
  setNoMopMapSubsetsList,
  setObstaclesList,
  setSelectedRoomsList,
  setSelectedZonesList,
  setVacuumMap,
  setVacuumPos,
} from './store/vacuum/mapSlice';
import { setEventsList, setLifeSpanAccessory, setLifeSpanDeviceList } from './store/vacuum/notificationSlice';
import {
  getVacuumClean,
  setAutoEmpty,
  setBotSerialInfo,
  setChargeState,
  setDoNotDisturb,
  setMoppingOption,
  setSavedPatternList,
  setSchedulesList,
  setVacuumBattery,
  setVacuumingOption,
  setVacuumState,
} from './store/vacuum/stateSlice';
import { sliceIntoChunks } from './utils/array.utils';
import { WebSocketContext } from './utils/socket.utils';
import { isString } from './utils/typeguard.utils';

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();
  const status = getVacuumClean();

  useEffect(() => {
    console.log('start websocket Service.');
    const websocket = websocketService();
    setSocket(websocket);

    return () => {
      websocket.disconnect();
    };
  }, []);

  //WIP todo move to backend.
  useEffect(() => {
    if (!status) return;

    const type = status?.cleanState?.type;
    if (!type) return;
    if (type === 'customArea') {
      const content = status?.cleanState?.content;
      if (!content || !isString(content)) return;
      const coordinatesList = content.split(',').map((coordinate: string) => +coordinate >> 0);

      if (status?.cleanState && status?.cleanState?.donotclean && status?.cleanState?.donotclean === 1) {
        dispatch(setGoToCoordinates([coordinatesList[0], coordinatesList[1]]));
      } else {
        dispatch(setSelectedZonesList(sliceIntoChunks(coordinatesList, 4)));
      }
    } else if (type === 'mapPoint') {
      const content = status?.cleanState?.content;
      if (!content || !isString(content)) return;

      const coordinatesList = content.split(',').map((coordinate: string) => +coordinate >> 0);
      dispatch(setGoToCoordinates([coordinatesList[0], coordinatesList[1]]));
    } else if (type === 'spotArea') {
      const content = status?.cleanState?.content;
      if (!content || !isString(content)) return;

      const mssidList = content.split(',').map((coordinate: string) => +coordinate >> 0);
      dispatch(setSelectedRoomsList(mssidList));
    }
  }, [status]);

  useEffect(() => {
    console.log(socket?.connected);
    if (socket) {
      socket.on('connect', () => {
        console.log('connected! ', socket.id);
        setIsConnected(true);
        socket.emit('getMajorMap');
        socket.emit('getLifeSpanDevice');
        socket.emit('getLifeSpanAccessory');
        socket.emit('getEventsList');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('vacuumMap', (payload) => {
        dispatch(setVacuumMap(payload));
      });

      socket.on('chargePos', (payload) => {
        dispatch(
          setVacuumPos({
            device: 'dock',
            devicesCoordinates: payload[0],
          }),
        );
      });

      socket.on('botPos', (payload) => {
        dispatch(
          setVacuumPos({
            device: 'bot',
            devicesCoordinates: payload,
          }),
        );
      });

      socket.on('batteryLevel', (payload) =>
        dispatch(setVacuumBattery({ level: payload.value, isLow: !!+payload.isLow })),
      );

      socket.on('status', (payload) => dispatch(setVacuumState(payload)));

      socket.on('chargeState', (payload) => dispatch(setChargeState(payload)));

      socket.on('mapSubSet', (payload) => dispatch(setMapSubsetsList(payload)));

      socket.on('NoMopMapSubSet', (payload) => dispatch(setNoMopMapSubsetsList(payload)));

      socket.on('NoGoMapSubSet', (payload) => dispatch(setNoGoMapSubsetsList(payload)));

      socket.on('speed', (payload) => dispatch(setVacuumingOption(payload)));

      socket.on('cleanCount', (payload) => dispatch(setVacuumingOption(payload)));

      socket.on('autoEmpty', (payload) => dispatch(setAutoEmpty(payload)));

      socket.on('schedulesList', (payload) => dispatch(setSchedulesList(payload)));

      socket.on('waterInfo', (payload) => dispatch(setMoppingOption(payload)));

      socket.on('doNotDisturb', (payload) => dispatch(setDoNotDisturb(payload)));

      socket.on('relocateSuccess', () => dispatch(onRelocateSuccess()));

      socket.on('lifeSpanInfo', (payload) => dispatch(setLifeSpanDeviceList(payload)));

      socket.on('obstacleList', (payload) => dispatch(setObstaclesList(payload)));

      socket.on('cachedMapInfo', (payload) => dispatch(setCachedMapInfo(payload)));

      socket.on('lifeSpanReminder', (payload) => dispatch(setLifeSpanAccessory(payload)));

      socket.on('mapActionFinished', () => dispatch(hideDialog()));

      socket.on('eventList', (payload) =>
        dispatch(setEventsList(payload.map((botEvent: any) => ({ ...botEvent, code: botEvent.evt_code })))),
      );

      socket.on('savedPatternList', (payload) => dispatch(setSavedPatternList(payload)));

      socket.on('botSerialInfo', (payload) => dispatch(setBotSerialInfo(payload)));

      socket.on('mapTrace', (payload) => {
        payload.isResponse && dispatch(incrementMapTracesListUpdateIndex());
        dispatch(setMapTracesList(payload));
      });
    }
  }, [socket]);

  return (
    <>
      {isConnected && (
        <WebSocketContext.Provider value={socket!}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </WebSocketContext.Provider>
      )}
      {!isConnected && <Typography>connection to websocket server in progress...</Typography>}
    </>
  );
};

export default App;
