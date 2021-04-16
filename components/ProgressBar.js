import React, { useState, useEffect } from 'react';
import { Container, ToastAndroid, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import TrackPlayer, { play } from 'react-native-track-player';

class ProgressBar extends TrackPlayer.ProgressComponent {
    render() {
        return (
            // Note: formatTime and ProgressBar are just examples:
            <View>
                <Text>{formatTime(this.state.position)}</Text>
                <ProgressBar
                    progress={this.getProgress()}
                    buffered={this.getBufferedProgress()}
                />
            </View>
        );
    }
}

export default ProgressBar;