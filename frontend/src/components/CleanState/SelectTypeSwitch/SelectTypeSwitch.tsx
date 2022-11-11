import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ChangeEvent } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import {
  getSelectionType,
  resetSelectedRoomsList,
  resetSelectedZonesList,
  setSelectionType,
} from '../../../store/vacuum/mapSlice';
import { resetSelectedSavedPatternId } from '../../../store/vacuum/stateSlice';

const SelectTypeSwitch = () => {
  const selectionType = getSelectionType();
  const dispatch = useAppDispatch();

  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: any) => {
    console.log(value);
    dispatch(resetSelectedRoomsList());
    dispatch(resetSelectedZonesList());
    dispatch(resetSelectedSavedPatternId());
    dispatch(setSelectionType(value));
  };

  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="vac-power-options"
        value={selectionType}
        onChange={handleChange}
        name="vac-power-options"
      >
        <FormControlLabel value={'room'} control={<Radio />} label="Spot Area" />
        <FormControlLabel value={'zone'} control={<Radio />} label="Custom Area" />
      </RadioGroup>
    </FormControl>
  );
};

export default SelectTypeSwitch;
