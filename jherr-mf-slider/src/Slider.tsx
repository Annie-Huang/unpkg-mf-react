import React from 'react';
import { Grid, Button } from '@chakra-ui/react';

const Slider = () => {
  return (
    <Grid templateColumns='1fr 10fr 1fr'>
      <Button>Left</Button>
      <div>Slider (1.0.0)</div>
      <Button>Right</Button>
    </Grid>
  );
};

export default Slider;
