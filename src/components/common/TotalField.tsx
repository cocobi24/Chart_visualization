import React from 'react';
import { Box, TextField } from '@mui/material';

type Props = {
    label: string | undefined;
    value: number | string | undefined;
};

const TotalField: React.FC<Props> = ({label, value}) => {
  return (
    <Box p={1} sx={{ marginTop: 5 }}>
        <TextField 
          sx={{
              "& fieldset": { border: 'none' },
          }} 
          inputProps={{style: {fontSize: 14, width: 200, height: 10}}}
          InputLabelProps={{style: {fontSize: 16}}}
          label={label}
          value={value ? value : 0}
        />
    </Box>
  );
};

export default TotalField;