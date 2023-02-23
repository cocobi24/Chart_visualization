import React from 'react';
import { Box, Button, ButtonProps } from '@mui/material';
import fontConfigs from '@/configs/fontConfigs';

type Props = ButtonProps;

const CustomButton: React.FC<Props> = (props) => {
  return (
      <Box p={1}>
        <Button 
          variant="contained" 
          {...props} 
          sx={{fontFamily: fontConfigs.main.fontFamily}}
        >
          {props.children}
        </Button>
      </Box>
  );
};

export default CustomButton