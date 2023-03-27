import React from 'react';
import { IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

import directionIcon from '../assets/images/directions.png';
import '../css/Direction.css';

export default function Direction(props: { longitude: number; latitude: number; }) {
    
    const showDirection = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${props.latitude},${props.longitude}`); 
    };

    return (
        <IconButton onClick={showDirection} size='small' color='warning'>
            <MapIcon />
        </IconButton>
    );

}
