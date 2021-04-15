import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, ToastAndroid } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import AudioControls from '../components/AudioControls';
import TrackPlayer, { play } from 'react-native-track-player';
import { TrackPlayerEvents } from 'react-native-track-player';


const Audio = ({ audioArray }) => {
    const [playing, setPlaying] = useState(null);
    const [track, setTrack] = useState(null);
    const jumpInterval = 30;

    useEffect(() => {
        if (audioArray) {
            console.log('First track: ', JSON.stringify(audioArray[0]))
            setTrack(audioArray[7])
        }
    }, [audioArray])

    const setupTrackPlayer = async () => {
        TrackPlayer.updateOptions({
            jumpInterval: jumpInterval,       // 10 second skip interval
        })

        if (track) {
            await TrackPlayer.add([track]).then(() => {
                setPlaying(prevState => ({
                    ...prevState,
                    name: track.title,
                    status: false,
                    progress: 0,
                    duration: Math.round(track.duration.$numberDecimal),
                    position: track.position,
                    image: track.artwork
                }))
            })
        }
    };

    const updateTrackInfo = async () => {
        await TrackPlayer.getPosition().then(position => {
            setPlaying(prevState => ({
                ...prevState,
                position: position
            }))
        }).catch(e => {
            console.error(e)
        });
    }

    useEffect(() => {
        setupTrackPlayer();
    }, [])

    useEffect(() => {
        updateTrackInfo();
    })

    // TODO: UI for audio controls
    // A basic example function that is passed to customButton and called from there via callback 
    const togglePlayback = () => {
        if (playing.status == false) {
            setPlaying(prevState => ({
                ...prevState,
                status: true
            }));
            TrackPlayer.play()
            ToastAndroid.show('Resumed playback', ToastAndroid.SHORT)
        } else {
            setPlaying(prevState => ({
                ...prevState,
                status: false
            }));
            TrackPlayer.pause()
            ToastAndroid.show('Paused audio', ToastAndroid.SHORT)
        }
    }

    const skip = (way) => {
        switch (way) {
            case 'backward': {
                TrackPlayer.seekTo(playing.position - jumpInterval)
                return
            }
            case 'forward': {
                TrackPlayer.seekTo(playing.position + jumpInterval)
                return
            }
            default: return
        }

    }

    const handlePress = () => {
        setPlaying(prevState => ({
            ...prevState,
            status: !prevState.status
        }));
    }

    return <View>
        {playing && <AudioControls
            title={playing.name}
            duration={playing.duration}
            position={playing.position}
            image={playing.image}
            status={playing.status}
            skip={skip}
            togglePlayback={togglePlayback}
            handlePress={handlePress} /> }
    </View>
}

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        alignSelf: 'center',
    },
    progress: {
        color: 'black',
        alignSelf: 'center'
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 100,
    },
    audioButton: {
        width: 70,
        height: 70,
        margin: 8,
        borderRadius: 70,
        justifyContent: 'center'
    }
})

const track1 = {
    id: 'podcast', // Must be a string, required
    url: 'https://content.blubrry.com/muutos/Minna_Kosonen_muutos_podcast.mp3', // Load media from the network
    title: 'Jakso 7: Viljelykasvien monimuotoisuus tukee luonnon monimuotoisuutta',
    artist: 'Juha Kauppinen',
    album: 'Podcast: Puhetta monimuotoisuudesta',
    genre: 'Podcast',
    date: '23.11.2019', // RFC 3339
    artwork: 'https://www.muutoslehti.fi/wp-content/uploads/powerpress/muutos_podcast_logo.jpg', // Load artwork from the network
    duration: 2247 // Duration in seconds
};

export default Audio;