import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker,  } from '@mui/x-date-pickers/DatePicker';

interface Props {
  views: Array<any>;
  value: Dayjs | null;
  setDate: (newValue: Dayjs | null) => void;
}

const CustomDatePicker = ({ views, value, setDate }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ko'}>
      <Stack spacing={3}>
        <DatePicker
          inputFormat={views.length === 1? 'YYYY년' : "YYYY년 MM월"}
          views={views}
          label={views.length === 1? '조회기간(년도)' : "조회기간(년월)"}
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
