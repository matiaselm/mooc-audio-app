import React, { useState, useEffect } from 'react';
import { Container, Text, Content, Picker, Spinner } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from './components/CustomHeader';
import AudioControls from './components/AudioControls';
import useTrackPlayerHooks from './hooks/trackPlayerHooks';
import TrackPlayer from 'react-native-track-player';

const Home = (props) => {
    const [audio, setAudio] = useState(null);
    const [queue, setQueue] = useState(null);
    const [position, setPosition] = useState(0);
    const [playing, setPlaying] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPosition()
    })

    useEffect(() => {
        getTrackPlayerQueue()
    }, [])

    useEffect(() => {
        audio && setTrackPlayerAudio(audio.id)
    }, [audio])

    const getTrackPlayerQueue = async () => {
        await TrackPlayer.getQueue().then(response => {
            console.log('Response: ', JSON.stringify(response,'','\t'))
            setQueue(response)
            setLoading(false)
        });
    }

    const setTrackPlayerAudio = async (id) => {
        await TrackPlayer.skip(id).then((res) => {
            console.log('Changed to track ', id)
        }).catch((e) => {
            console.error(e.message)
        })
    }

    const skip = (way) => {
        if (way === 'brackward') TrackPlayer.seekTo(playing.position - jumpInterval)
        if (way === 'forward') TrackPlayer.seekTo(playing.position + jumpInterval)
    }

    const getCurrentAudio = async () => {
        const trackId = await TrackPlayer.getCurrentTrack();
        const trackObject = await TrackPlayer.getTrack(trackId);
        return trackObject;
    }

    const getPosition = async () => {
        await TrackPlayer.getPosition().then(position => {
            console.log('Position ', position)
            setPosition(position);
        }).catch(e => {
            console.error(e)
        });
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
            {!loading ?
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
                : <Content>
                    <Spinner />
                </Content>}
        </Container>
    </>
}

export default Home;