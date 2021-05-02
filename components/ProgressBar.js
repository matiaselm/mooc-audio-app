import React, { useState, useEffect } from 'react';
import { View } from 'native-base';
import COLORS from '../assets/colors';

const ProgressBar = ({ style, duration, position }) => {
    const progress = (_duration, _position) => {
        if (!isNaN(_duration - _position)) {
            return _duration - _position
        } else {
            return 0
        }
    }

    return (<View style={[{ display: 'flex', flexDirection: 'row-reverse', width: '100%', height: 8 }, style]}>
        <View style={{ flex: progress(duration, position), alignSelf: 'flex-start', height: 8, backgroundColor: '#dadada' }} />
        <View style={{ flex: position, height: 8, backgroundColor: COLORS.PRIMARY }} />
    </View>
    );

}

export default ProgressBar;