import React, { useState, useEffect } from 'react';
import { View } from 'native-base';

const ProgressBar = ({ style, duration, position }) => {
    const progress = (_duration, _position) => {
        if (!isNaN(_duration - _position)) {
            return _duration - _position
        } else {
            return 0
        }
    }

    return (<View style={[{ display: 'flex', flexDirection: 'row-reverse', width: '100%', height: 10 }, style]}>
        <View style={{ flex: progress(duration, position), alignSelf: 'flex-start', height: 10, backgroundColor: '#dadada' }} />
        <View style={{ flex: position, height: 10, backgroundColor: '#39FF' }} />
    </View>
    );

}

export default ProgressBar;