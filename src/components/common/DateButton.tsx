import React from 'react';
import { Grid, Box, Button, ButtonProps } from '@mui/material';
import ViewsDatePicker from '@/components/common/DatePicker';

type Props = ButtonProps;

const DateButton: React.FC<Props> = (props) => {
  return (
    <Grid container spacing={1}>
      <Box p={2}>
        <ViewsDatePicker />
      </Box>
      <Box p={2}>
        <Button variant="contained" {...props}>
          {props.children}
        </Button>
      </Box>
    </Grid>
  );
};

export default DateButton;