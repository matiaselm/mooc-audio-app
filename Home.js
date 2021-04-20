import React, { useState, useEffect } from 'react';
import { Container, ToastAndroid, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './components/CustomButton';
import CustomFooter from './components/CustomFooter';
import CustomHeader from './components/CustomHeader';
import Main from './views/Main';
import Audio from './views/Audio';
import AudioControls from './components/AudioControls';
import PlayerInfo from './components/PlayerInfo';
import ProgressBar from './components/ProgressBar';
import axios from 'axios';
import { API_URL } from '@env';
import TrackPlayer, { play } from 'react-native-track-player';
import useTrackPlayerHooks from './hooks/trackPlayerHooks';

const Home = (props) => {
    const [refresh, setRefresh] = useState(true);
    const {
        audio,
        playing,
        position,
        addAudio,
        getAudio,
        getCurrentAudio,
        updateAudioInfo,
        initView,
        togglePlayback,
    } = useTrackPlayerHooks();

    // Makes first letter uppercase. For prettier UI
    const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    useEffect(() => {
        getAudio();
    }, [refresh])

    return <>
        <CustomHeader title={capitalize('home')} />
        <Container>
            <Content>
                {/*<PlayerInfo />*/}
                <Button onPress={() => setRefresh(!refresh)}>
                    <Text>
                        refresh
                    </Text>
                </Button>
                {audio && <AudioControls
                    title={audio.title}
                    duration={audio.duration}
                    position={position}
                    image={audio.image}
                    status={playing}
                    skip={skip}
                    togglePlayback={togglePlayback} />}
            </Content>
        </Container>
    </>
}

export default Home;