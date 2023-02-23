import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
  value: Dayjs | null;
  setDate: (newValue: Dayjs | null) => void;
}

const CustomDatePicker = ({ value, setDate }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DatePicker
          views={['year']}
          label="Year"
          minDate={dayjs('2018-01-01')}
          maxDate={dayjs('2021-12-01')}
          value={value}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
