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

const Home = (props) => {
    const [view, setView] = useState('main');
    const [audioArray, setAudioArray] = useState([]);
    const [position, setPosition] = useState(0)
    const [audio, setAudio] = useState(null);
    let playing = false;
    const jumpInterval = 30;

    useEffect(() => {
        getAudio();
    }, []);

    useEffect(() => {
        for (let i in audioArray) {
            const track = {
                id: audioArray[i]._id,
                title: audioArray[i].title,
                url: audioArray[i].url,
                album: audioArray[i].album,
                artwork: audioArray[i].artwork,
                artist: audioArray[i].artist,
                duration: Math.round(audioArray[i].duration.$numberDecimal)
            }
            addAudio(track);
        }
        getQueue();
    }, [audioArray])

    useEffect(() => {
        getCurrentAudio();
        initView();
    }, [TrackPlayer.getCurrentTrack])

    useEffect(() => {
        if (TrackPlayer) {
            updateTrackInfo();
        }
    });

    const initView = async () => {
        const trackId = await TrackPlayer.getCurrentTrack();
        const trackObject = await TrackPlayer.getTrack(trackId);
        // console.log('Track obj:', trackObject)

        setAudio(trackObject);
    }

    const getAudio = async () => {
        try {
            const url = `${API_URL}/audio`;
            // console.log('API: ', url);
            await axios.get(url).then(response => {
                // console.log('Audio response: ', JSON.stringify(response.data,'','\t'))
                setAudioArray(response.data)
            });
        } catch (e) {
            console.error(e.message)
        }
    }

    const updateTrackInfo = async () => {
        await TrackPlayer.getPosition().then(position => {
            setPosition(position)
        }).catch(e => {
            console.error(e)
        });
    }

    const addAudio = async (audio) => {
        await TrackPlayer.add(audio);
    }

    const getCurrentAudio = async () => {
        await TrackPlayer.getCurrentTrack().then((res) => {
            //console.log('Current track id: ', res)
        })
    }

    const setupTrackPlayer = async () => {
        await TrackPlayer.setupPlayer();
    }

    const getQueue = async () => {
        await TrackPlayer.getQueue().then((response) => {
            // console.log('TrackPlayer queue: ', JSON.stringify(response, '', '\t'))
        });
    }

    const skip = (way) => {
        if (way === 'brackward') TrackPlayer.seekTo(playing.position - jumpInterval)
        if (way === 'forward') TrackPlayer.seekTo(playing.position + jumpInterval)
    }

    // TODO: UI for audio controls
    // A basic example function that is passed to customButton and called from there via callback 
    const togglePlayback = async () => {
        if (!playing) {
            playing = true;
            await TrackPlayer.play()
        } else {
            playing = false;
            await TrackPlayer.pause()
        }
    }

    // Makes first letter uppercase. For prettier UI
    const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    return <>
        <CustomHeader title={capitalize('home')} />
        <Container>
            <Content>

                <PlayerInfo />
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