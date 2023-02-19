import React from 'react';
import { Box, Button, ButtonProps } from '@mui/material';

type Props = ButtonProps;

const CustomButton: React.FC<Props> = (props) => {
  return (
      <Box p={1}>
        <Button variant="contained" {...props}>
          {props.children}
        </Button>
      </Box>
  );
};

export default CustomButton