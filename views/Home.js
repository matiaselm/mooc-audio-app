import React, { useState, useEffect, useContext } from 'react';
import { Container, Text, Content, Picker, Spinner } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import AudioControls from '../components/AudioControls';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import ProgressBar from '../components/ProgressBar';
import AppContext from '../AppContext';

const Home = (props) => {
    const { 
        audio, 
        setAudio,
        user, 
        queue, 
        setQueue } = useContext(AppContext);
    const [position, setPosition] = useState(0);
    const [playing, setPlaying] = useState(false);
    const jumpInterval = 30;

    useEffect(() => {
        audio && setTrackPlayerAudio(audio.id)
    }, [audio])

    useEffect(() => {
        const counter = setInterval(() => {
            getPosition()
        }, 500)

        return () => clearInterval(counter);
    })

    const getPosition = async() => {
        await TrackPlayer.getPosition().then(position => {
            setPosition(position);
        }).catch(e => {
            console.error(e)
        });
    }

    const setTrackPlayerAudio = async(id) => {
        await TrackPlayer.skip(id).then((res) => {
            console.log('Changed to track ', id)
        }).catch((e) => {
            console.error(e.message)
        })
    }

    const skip = async(way) => {
        if (way === 'backward') await TrackPlayer.seekTo(position - jumpInterval)
        if (way === 'forward') await TrackPlayer.seekTo(position + jumpInterval)
    }
    // TODO: UI for audio controls
    // A basic example function that is passed to customButton and called from there via callback 
    const togglePlayback = async () => {
        if (!playing) {
            console.log('Play')
            setPlaying(true);
            await TrackPlayer.play()
        } else {
            console.log('Pause')
            setPlaying(false);
            await TrackPlayer.pause()
        }
    }

    // Makes first letter uppercase. For prettier UI
    const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    return <>
        <CustomHeader title={capitalize('home')} />
        <Container>
            <Content>

                <Picker
                    selectedValue={audio}
                    onValueChange={(itemValue, itemIndex) =>
                        setAudio(itemValue)
                    }>
                    {queue && queue.map((audio, key) => {
                        return <Picker.Item key={key} label={audio.title} value={audio} />
                    })}

                </Picker>
                {/*<PlayerInfo />*/}
                {audio ? <AudioControls
                    title={audio.title}
                    duration={audio.duration && Math.round(audio.duration.$numberDecimal)}
                    position={position}
                    image={audio.image}
                    status={playing}
                    skip={skip}
                    togglePlayback={togglePlayback} />
                    : <Text> No audio, no controls </Text>
                }
            </Content>
        </Container>
    </>
}

export default Home;